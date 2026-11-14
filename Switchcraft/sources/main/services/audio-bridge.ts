/**
 * Talks to the native CoreAudio helper (native/switchcraft-audio) over JSON lines.
 * Keeps the latest device snapshot and restarts the helper if it ever stops.
 */
import { spawn, type ChildProcess } from "child_process";
import { EventEmitter } from "events";
import * as readline from "readline";

import { logger } from "@glaze/core/backend";
import helperPath from "swift:../../native/switchcraft-audio";

import type {
  AudioDefaults,
  AudioDevice,
  AudioSnapshot,
  CurrentSettings,
  DeviceRole,
  VolumeLevels,
} from "../shared/types.js";
import { emitChange } from "./changes.js";
import { clampLevel, isRecord } from "./preset-model.js";

const CALL_TIMEOUT_MS = 10_000;
const MIN_RESTART_DELAY_MS = 500;
const MAX_RESTART_DELAY_MS = 15_000;

interface PendingCall {
  method: string;
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
  timer: NodeJS.Timeout;
}

type SnapshotListener = (
  snapshot: AudioSnapshot,
  previous: AudioSnapshot | null,
) => void;

function parseDevice(value: unknown): AudioDevice | null {
  if (
    !isRecord(value) ||
    typeof value.uid !== "string" ||
    typeof value.name !== "string"
  )
    return null;
  return {
    uid: value.uid,
    name: value.name,
    transport: typeof value.transport === "string" ? value.transport : "other",
    hasOutput: value.hasOutput === true,
    hasInput: value.hasInput === true,
    canBeDefaultOutput: value.canBeDefaultOutput === true,
    canBeDefaultInput: value.canBeDefaultInput === true,
    canBeSystemOutput: value.canBeSystemOutput === true,
    outputVolumeSettable: value.outputVolumeSettable === true,
    inputVolumeSettable: value.inputVolumeSettable === true,
  };
}

function parseDefaults(value: unknown): AudioDefaults {
  const raw = isRecord(value) ? value : {};
  return {
    output: typeof raw.output === "string" ? raw.output : null,
    alert: typeof raw.alert === "string" ? raw.alert : null,
    input: typeof raw.input === "string" ? raw.input : null,
  };
}

function parseSnapshot(value: unknown): AudioSnapshot | null {
  if (!isRecord(value) || !Array.isArray(value.devices)) return null;
  const devices = value.devices
    .map(parseDevice)
    .filter((device): device is AudioDevice => device !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
  return { devices, defaults: parseDefaults(value.defaults) };
}

function parseCurrentSettings(value: unknown): CurrentSettings {
  const raw = isRecord(value) ? value : {};
  const volumes = isRecord(raw.volumes) ? raw.volumes : {};
  const levels: VolumeLevels = {
    output: clampLevel(volumes.output),
    input: clampLevel(volumes.input),
    alert: clampLevel(volumes.alert),
  };
  return { defaults: parseDefaults(raw.defaults), volumes: levels };
}

class AudioBridge {
  private child: ChildProcess | null = null;
  private nextId = 1;
  private readonly pending = new Map<number, PendingCall>();
  private snapshot: AudioSnapshot | null = null;
  private stopped = true;
  private restartDelayMs = MIN_RESTART_DELAY_MS;
  private restartTimer: NodeJS.Timeout | null = null;
  private lastError: string | null = null;
  private readonly events = new EventEmitter();
  private readyWaiters: Array<(snapshot: AudioSnapshot) => void> = [];

  start(): void {
    if (!this.stopped) return;
    this.stopped = false;
    this.launch();
  }

  stop(): void {
    this.stopped = true;
    if (this.restartTimer) clearTimeout(this.restartTimer);
    this.restartTimer = null;
    const child = this.child;
    this.child = null;
    child?.stdin?.end();
    child?.kill();
    this.failPending(new Error("Switchcraft is quitting."));
  }

  onSnapshot(listener: SnapshotListener): void {
    this.events.on("snapshot", listener);
  }

  getSnapshot(): AudioSnapshot | null {
    return this.snapshot;
  }

  getError(): string | null {
    return this.lastError;
  }

  waitForSnapshot(timeoutMs: number): Promise<AudioSnapshot | null> {
    if (this.snapshot) return Promise.resolve(this.snapshot);
    return new Promise((resolve) => {
      const waiter = (snapshot: AudioSnapshot) => {
        clearTimeout(timer);
        resolve(snapshot);
      };
      const timer = setTimeout(() => {
        this.readyWaiters = this.readyWaiters.filter((w) => w !== waiter);
        resolve(null);
      }, timeoutMs);
      this.readyWaiters.push(waiter);
    });
  }

  // ── Operations ──────────────────────────────────────────────────────

  async refresh(): Promise<AudioSnapshot> {
    const snapshot = parseSnapshot(await this.call("getSnapshot"));
    if (!snapshot)
      throw new Error(
        "The audio helper returned a device list Switchcraft couldn't read.",
      );
    this.setSnapshot(snapshot);
    return snapshot;
  }

  async getCurrentSettings(): Promise<CurrentSettings> {
    return parseCurrentSettings(await this.call("getCurrentSettings"));
  }

  async setDefaultDevice(role: DeviceRole, uid: string): Promise<void> {
    await this.call("setDefaultDevice", { role, uid });
  }

  async setVolume(
    uid: string,
    scope: "output" | "input",
    level: number,
  ): Promise<void> {
    await this.call("setVolume", { uid, scope, level });
  }

  async setAlertVolume(level: number): Promise<void> {
    await this.call("setAlertVolume", { level });
  }

  async checkSystemShortcut(accelerator: string): Promise<string | null> {
    const result = await this.call("checkSystemShortcut", { accelerator });
    return isRecord(result) && typeof result.conflict === "string"
      ? result.conflict
      : null;
  }

  // ── Process management ──────────────────────────────────────────────

  private launch(): void {
    logger.info("audio", "Starting audio helper", { helperPath });
    const child = spawn(helperPath, [], { stdio: ["pipe", "pipe", "pipe"] });
    this.child = child;
    let dead = false;
    const onDead = (reason: string) => {
      if (dead) return;
      dead = true;
      if (this.child === child) this.child = null;
      this.failPending(new Error(reason));
      this.scheduleRestart();
    };

    if (child.stdout) {
      readline
        .createInterface({ input: child.stdout })
        .on("line", (line) => this.handleLine(line));
    }
    child.stderr?.on("data", (chunk: Buffer) => {
      const text = chunk.toString("utf-8").trim();
      if (text)
        logger.warn("audio", "Audio helper reported a problem", { text });
    });
    child.stdin?.on("error", (error) => {
      logger.warn("audio", "Audio helper input closed", {
        error: String(error),
      });
    });
    child.on("error", (error) => {
      logger.error("audio", "Audio helper failed", {
        error: String(error),
        helperPath,
      });
      this.lastError =
        "Switchcraft couldn't reach its audio helper, so devices can't be listed or switched.";
      emitChange();
      onDead(`Audio helper failed: ${String(error)}`);
    });
    child.on("exit", (code, signal) => {
      if (!this.stopped)
        logger.warn("audio", "Audio helper exited", { code, signal });
      onDead("The audio helper stopped unexpectedly.");
    });

    this.refresh().catch((error: unknown) => {
      logger.warn("audio", "Couldn't read audio devices", {
        error: String(error),
      });
    });
  }

  private scheduleRestart(): void {
    if (this.stopped || this.restartTimer) return;
    const delay = this.restartDelayMs;
    this.restartDelayMs = Math.min(
      this.restartDelayMs * 2,
      MAX_RESTART_DELAY_MS,
    );
    this.restartTimer = setTimeout(() => {
      this.restartTimer = null;
      if (!this.stopped) this.launch();
    }, delay);
  }

  private failPending(error: Error): void {
    for (const call of this.pending.values()) {
      clearTimeout(call.timer);
      call.reject(error);
    }
    this.pending.clear();
  }

  private setSnapshot(snapshot: AudioSnapshot): void {
    const previous = this.snapshot;
    this.snapshot = snapshot;
    if (this.lastError) {
      this.lastError = null;
      emitChange();
    }
    const waiters = this.readyWaiters;
    this.readyWaiters = [];
    for (const waiter of waiters) waiter(snapshot);
    this.events.emit("snapshot", snapshot, previous);
  }

  private handleLine(line: string): void {
    let message: unknown;
    try {
      message = JSON.parse(line);
    } catch {
      logger.warn("audio", "Ignored unreadable output from the audio helper", {
        line,
      });
      return;
    }
    if (!isRecord(message)) return;

    if (message.event === "audioChanged") {
      const snapshot = parseSnapshot(message.snapshot);
      if (snapshot) this.setSnapshot(snapshot);
      return;
    }

    if (typeof message.id !== "number") return;
    const call = this.pending.get(message.id);
    if (!call) return;
    this.pending.delete(message.id);
    clearTimeout(call.timer);
    this.restartDelayMs = MIN_RESTART_DELAY_MS;
    if (message.ok === true) {
      call.resolve(message.result);
    } else {
      const reason =
        typeof message.error === "string"
          ? message.error
          : "the audio helper failed";
      call.reject(new Error(reason));
    }
  }

  private call(
    method: string,
    params: Record<string, unknown> = {},
  ): Promise<unknown> {
    const child = this.child;
    const stdin = child?.stdin;
    if (!child || !stdin || child.exitCode !== null || !stdin.writable) {
      return Promise.reject(
        new Error("Switchcraft's audio helper isn't running."),
      );
    }
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`The audio helper didn't respond (${method}).`));
      }, CALL_TIMEOUT_MS);
      this.pending.set(id, { method, resolve, reject, timer });
      stdin.write(`${JSON.stringify({ id, method, params })}\n`);
    });
  }
}

export const audio = new AudioBridge();
