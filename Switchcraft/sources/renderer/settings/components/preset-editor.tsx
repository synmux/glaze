import { useEffect, useRef, useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import {
  Button,
  Callout,
  Field,
  FieldSet,
  Input,
  ScrollArea,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
} from "@glaze/core/components";

import type {
  Preset,
  PresetValidationErrors,
  PresetVolumes,
  SwitchcraftState,
} from "../../../main/shared/types";
import { api, errorText } from "../api";
import {
  NO_CHANGE,
  NO_TRIGGER,
  SAME_AS_OUTPUT,
  alertTargetFromValue,
  deviceTargetFromValue,
  deviceValue,
  roleOptions,
  savedDevice,
  targetValue,
  triggerFromValue,
  triggerOptions,
} from "../lib/devices";
import { DeviceSelect } from "./device-select";
import { LevelSlider } from "./level-slider";
import { ShortcutRecorder } from "./shortcut-recorder";

const SAVE_DEBOUNCE_MS = 300;
const DEFAULT_LEVEL = 50;

const NO_CHANGE_OPTION = { value: NO_CHANGE, label: "No change" };
const SAME_AS_OUTPUT_OPTION = {
  value: SAME_AS_OUTPUT,
  label: "Same as main output",
};
const NO_TRIGGER_OPTION = { value: NO_TRIGGER, label: "None" };

/** Typing helper: lowercase and turn spaces into hyphens as the user types. */
function toSlugInput(value: string): string {
  return value.toLowerCase().replace(/[\s_]+/g, "-");
}

interface PresetEditorProps {
  preset: Preset;
  state: SwitchcraftState;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function PresetEditor({
  preset,
  state,
  onDuplicate,
  onDelete,
}: PresetEditorProps) {
  const [draft, setDraft] = useState<Preset>(preset);
  const [errors, setErrors] = useState<PresetValidationErrors>({});
  const [shortcutMessage, setShortcutMessage] = useState<string | null>(null);
  const draftRef = useRef<Preset>(preset);
  const timerRef = useRef<number | null>(null);
  const saveSeqRef = useRef(0);

  const snapshot = state.snapshot;
  const volumes = draft.volumes;
  const isCurrent = state.currentPresetId === preset.id;

  async function save(next: Preset): Promise<void> {
    const seq = ++saveSeqRef.current;
    try {
      const result = await api.updatePreset(next);
      if (seq !== saveSeqRef.current) return;
      setErrors(result.ok ? {} : result.errors);
    } catch (error) {
      toast.error(
        `Couldn't save ${next.slug || "this preset"}: ${errorText(error)}`,
      );
    }
  }

  function cancelPendingSave(): boolean {
    if (timerRef.current === null) return false;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
    return true;
  }

  function commit(next: Preset, debounce = false): void {
    draftRef.current = next;
    setDraft(next);
    cancelPendingSave();
    if (debounce) {
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        void save(draftRef.current);
      }, SAVE_DEBOUNCE_MS);
    } else {
      void save(next);
    }
  }

  function update(change: (current: Preset) => Preset, debounce = false): void {
    commit(change(draftRef.current), debounce);
  }

  function updateVolumes(
    change: (current: PresetVolumes) => PresetVolumes,
    debounce = false,
  ): void {
    update(
      (current) => ({ ...current, volumes: change(current.volumes) }),
      debounce,
    );
  }

  // Save a pending (debounced) edit if the editor closes or switches preset.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
        void api.updatePreset(draftRef.current).catch(() => undefined);
      }
    };
  }, []);

  async function fillFromCurrent(): Promise<void> {
    try {
      const current = await api.getCurrentTargets();
      update((p) => {
        const next: Preset = {
          ...p,
          output: current.output,
          alert: current.alert,
          input: current.input,
        };
        if (p.volumes.enabled) {
          const { output, input, alert } = current.volumes;
          next.volumes = {
            ...p.volumes,
            output,
            input,
            alertLinked: alert === null || alert === output,
            alert: alert ?? p.volumes.alert,
          };
        }
        return next;
      });
    } catch (error) {
      toast.error(
        `Couldn't read the current sound settings: ${errorText(error)}`,
      );
    }
  }

  async function currentLevel(role: "output" | "input"): Promise<number> {
    try {
      const current = await api.getCurrentTargets();
      return current.volumes[role] ?? DEFAULT_LEVEL;
    } catch {
      return DEFAULT_LEVEL;
    }
  }

  async function setLevelEnabled(
    role: "output" | "input",
    enabled: boolean,
  ): Promise<void> {
    if (!enabled) {
      updateVolumes((v) => ({ ...v, [role]: null }));
      return;
    }
    const level = await currentLevel(role);
    updateVolumes((v) => ({ ...v, [role]: level }));
  }

  async function applyNow(): Promise<void> {
    if (cancelPendingSave()) await save(draftRef.current);
    try {
      await api.applyPreset(preset.id);
    } catch (error) {
      toast.error(`Couldn't apply ${draft.slug}: ${errorText(error)}`);
    }
  }

  const takenState = state.shortcuts[preset.id];
  const shortcutError =
    shortcutMessage ??
    errors.shortcut ??
    (takenState?.status === "taken" ? takenState.message : undefined);

  return (
    <ScrollArea
      className="h-full"
      title={draft.slug || "Untitled"}
      subtitle={isCurrent ? "Current preset" : undefined}
      actions={
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                iconOnly
                aria-label="Duplicate preset"
                onClick={onDuplicate}
              >
                <Copy />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Duplicate</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button iconOnly aria-label="Delete preset" onClick={onDelete}>
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </>
      }
    >
      <div className="flex flex-col gap-6 px-4 pb-8">
        {state.audioError ? (
          <Callout color="red">{state.audioError}</Callout>
        ) : null}

        <FieldSet>
          <Field
            label="Name"
            description={
              errors.slug
                ? undefined
                : "Lowercase letters, digits and hyphens. Shown in the menu bar."
            }
            error={errors.slug}
            data-invalid={Boolean(errors.slug)}
          >
            <Input
              id="preset-slug"
              size="small"
              className="w-48"
              value={draft.slug}
              maxLength={24}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-invalid={Boolean(errors.slug)}
              onChange={(event) =>
                update(
                  (p) => ({ ...p, slug: toSlugInput(event.target.value) }),
                  true,
                )
              }
            />
          </Field>
        </FieldSet>

        {errors.changes ? (
          <Callout color="orange">{errors.changes}</Callout>
        ) : null}

        <FieldSet title="Devices">
          <Field label="Output" description="The main sound output.">
            <DeviceSelect
              id="preset-output"
              value={targetValue(draft.output)}
              special={[NO_CHANGE_OPTION]}
              options={roleOptions(
                snapshot,
                "output",
                savedDevice(draft.output),
              )}
              onValueChange={(value) =>
                update((p) => ({
                  ...p,
                  output: deviceTargetFromValue(
                    value,
                    snapshot,
                    savedDevice(p.output),
                  ),
                }))
              }
            />
          </Field>
          <Field
            label="Alerts"
            description="Where alert sounds and sound effects play."
          >
            <DeviceSelect
              id="preset-alert"
              value={targetValue(draft.alert)}
              special={[NO_CHANGE_OPTION, SAME_AS_OUTPUT_OPTION]}
              options={roleOptions(snapshot, "alert", savedDevice(draft.alert))}
              onValueChange={(value) =>
                update((p) => ({
                  ...p,
                  alert: alertTargetFromValue(
                    value,
                    snapshot,
                    savedDevice(p.alert),
                  ),
                }))
              }
            />
          </Field>
          <Field label="Input" description="The microphone or line in.">
            <DeviceSelect
              id="preset-input"
              value={targetValue(draft.input)}
              special={[NO_CHANGE_OPTION]}
              options={roleOptions(snapshot, "input", savedDevice(draft.input))}
              onValueChange={(value) =>
                update((p) => ({
                  ...p,
                  input: deviceTargetFromValue(
                    value,
                    snapshot,
                    savedDevice(p.input),
                  ),
                }))
              }
            />
          </Field>
          <Field>
            <Button onClick={() => void fillFromCurrent()}>
              Use Current Settings
            </Button>
            <Button variant="accent" onClick={() => void applyNow()}>
              Apply Now
            </Button>
          </Field>
        </FieldSet>

        <FieldSet title="Volumes">
          <Field
            label="Set volumes"
            description="When off, this preset never changes any volume."
          >
            <Switch
              aria-label="Set volumes"
              checked={volumes.enabled}
              onCheckedChange={(enabled) =>
                updateVolumes((v) => ({ ...v, enabled }))
              }
            />
          </Field>
          {volumes.enabled ? (
            <>
              <Field
                label="Change output volume"
                description="Applies to whichever device ends up as the output."
              >
                <Switch
                  aria-label="Change output volume"
                  checked={volumes.output !== null}
                  onCheckedChange={(on) => void setLevelEnabled("output", on)}
                />
              </Field>
              {volumes.output !== null ? (
                <>
                  <Field label="Output volume">
                    <LevelSlider
                      label="Output volume"
                      value={volumes.output}
                      onChange={(level) =>
                        updateVolumes((v) => ({ ...v, output: level }), true)
                      }
                    />
                  </Field>
                  <Field
                    label="Link alert volume to output"
                    description="Sets the alert volume slider to the same level."
                  >
                    <Switch
                      aria-label="Link alert volume to output"
                      checked={volumes.alertLinked}
                      onCheckedChange={(linked) =>
                        updateVolumes((v) => ({
                          ...v,
                          alertLinked: linked,
                          alert: linked ? v.alert : (v.output ?? v.alert),
                        }))
                      }
                    />
                  </Field>
                  {!volumes.alertLinked ? (
                    <Field label="Alert volume">
                      <LevelSlider
                        label="Alert volume"
                        value={volumes.alert}
                        onChange={(level) =>
                          updateVolumes((v) => ({ ...v, alert: level }), true)
                        }
                      />
                    </Field>
                  ) : null}
                </>
              ) : null}
              <Field
                label="Change input volume"
                description="Applies to whichever device ends up as the input."
              >
                <Switch
                  aria-label="Change input volume"
                  checked={volumes.input !== null}
                  onCheckedChange={(on) => void setLevelEnabled("input", on)}
                />
              </Field>
              {volumes.input !== null ? (
                <Field label="Input volume">
                  <LevelSlider
                    label="Input volume"
                    value={volumes.input}
                    onChange={(level) =>
                      updateVolumes((v) => ({ ...v, input: level }), true)
                    }
                  />
                </Field>
              ) : null}
            </>
          ) : null}
        </FieldSet>

        <FieldSet title="Triggers">
          <Field
            label="Keyboard shortcut"
            description={
              shortcutError ? undefined : "Applies this preset from any app."
            }
            error={shortcutError}
            data-invalid={Boolean(shortcutError)}
          >
            <ShortcutRecorder
              presetId={preset.id}
              value={draft.shortcut}
              onMessage={setShortcutMessage}
              onChange={(shortcut) => update((p) => ({ ...p, shortcut }))}
            />
          </Field>
          <Field
            label="Apply when connected"
            description={
              errors.autoApplyDevice
                ? undefined
                : "Applies this preset automatically when the device connects."
            }
            error={errors.autoApplyDevice}
            data-invalid={Boolean(errors.autoApplyDevice)}
          >
            <DeviceSelect
              id="preset-trigger"
              value={
                draft.autoApplyDevice
                  ? deviceValue(draft.autoApplyDevice.uid)
                  : NO_TRIGGER
              }
              special={[NO_TRIGGER_OPTION]}
              options={triggerOptions(
                snapshot,
                state.presets,
                preset.id,
                draft.autoApplyDevice,
              )}
              onValueChange={(value) =>
                update((p) => ({
                  ...p,
                  autoApplyDevice: triggerFromValue(
                    value,
                    snapshot,
                    p.autoApplyDevice,
                  ),
                }))
              }
            />
          </Field>
        </FieldSet>
      </div>
    </ScrollArea>
  );
}
