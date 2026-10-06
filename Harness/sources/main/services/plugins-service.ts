import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";

import { readText, writeTextAtomic } from "./atomic-write.js";
import { backupFile } from "./backup.js";

export interface PluginView {
  id: string;
  name: string;
  tool: "claudeCode" | "codex";
  marketplace: string;
  version: string;
  enabled: boolean;
  installPath: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function home(...parts: string[]): string {
  return path.join(os.homedir(), ...parts);
}

async function claudePlugins(): Promise<PluginView[]> {
  const settingsFile = home(".claude", "settings.json");
  const installedFile = home(".claude", "plugins", "installed_plugins.json");

  const settingsText = await readText(settingsFile);
  const installedText = await readText(installedFile);
  if (!installedText) return [];

  const settings = settingsText ? (JSON.parse(settingsText) as unknown) : {};
  const enabled = isRecord(settings) && isRecord(settings.enabledPlugins) ? settings.enabledPlugins : {};
  const installed = JSON.parse(installedText) as unknown;
  if (!isRecord(installed) || !isRecord(installed.plugins)) return [];

  const views: PluginView[] = [];
  for (const [id, installs] of Object.entries(installed.plugins)) {
    const list = Array.isArray(installs) ? installs : [];
    const first = list.find(isRecord);
    const [name, marketplace] = id.split("@");
    views.push({
      id,
      name: name || id,
      tool: "claudeCode",
      marketplace: marketplace || "",
      version: first && typeof first.version === "string" ? first.version : "",
      enabled: enabled[id] !== false,
      installPath: first && typeof first.installPath === "string" ? first.installPath : "",
    });
  }
  return views;
}

async function codexPlugins(): Promise<PluginView[]> {
  const file = home(".codex", "config.toml");
  const text = await readText(file);
  if (!text) return [];

  const views: PluginView[] = [];
  const pattern = /^\[plugins\."([^"\]]+)"\]\s*$/gm;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    const id = match[1];
    const rest = text.slice(match.index, text.indexOf("\n[", match.index + 1));
    const [name, marketplace] = id.split("@");
    views.push({
      id,
      name: name || id,
      tool: "codex",
      marketplace: marketplace || "",
      version: "",
      enabled: !/enabled\s*=\s*false/.test(rest),
      installPath: "",
    });
  }
  return views;
}

export async function listPlugins(): Promise<PluginView[]> {
  const [claude, codex] = await Promise.all([
    claudePlugins().catch(() => [] as PluginView[]),
    codexPlugins().catch(() => [] as PluginView[]),
  ]);
  return [...claude, ...codex].sort(
    (a, b) => a.tool.localeCompare(b.tool) || a.marketplace.localeCompare(b.marketplace) || a.name.localeCompare(b.name),
  );
}

export async function setPluginEnabled(
  tool: "claudeCode" | "codex",
  id: string,
  enabled: boolean,
): Promise<void> {
  if (tool === "claudeCode") {
    const file = home(".claude", "settings.json");
    const text = await readText(file);
    if (!text) throw new Error("Claude Code settings weren't found.");
    const settings = JSON.parse(text) as Record<string, unknown>;
    const plugins = isRecord(settings.enabledPlugins) ? settings.enabledPlugins : {};
    plugins[id] = enabled;
    settings.enabledPlugins = plugins;
    await writeTextAtomic(file, `${JSON.stringify(settings, null, 2)}\n`);
    return;
  }

  const file = home(".codex", "config.toml");
  const text = await readText(file);
  if (!text) throw new Error("Codex config wasn't found.");

  const header = `[plugins."${id}"]`;
  const start = text.indexOf(header);
  if (start < 0) throw new Error(`${id} isn't in the Codex config.`);

  const next = text.indexOf("\n[", start + 1);
  const end = next < 0 ? text.length : next;
  let block = text.slice(start, end);
  if (/enabled\s*=/.test(block)) {
    block = block.replace(/enabled\s*=\s*(true|false)/, `enabled = ${enabled}`);
  } else {
    block = `${block.replace(/\n*$/, "")}\nenabled = ${enabled}\n`;
  }

  await backupFile(file);
  const updated = text.slice(0, start) + block + text.slice(end);
  await fs.writeFile(file, updated, "utf8");
}
