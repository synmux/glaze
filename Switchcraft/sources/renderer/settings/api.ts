import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  AppSettings,
  ApplyResult,
  CurrentTargets,
  Preset,
  PresetUpdateResult,
  ShortcutCheckResult,
  SwitchcraftState,
} from "../../main/shared/types";

export const STATE_KEY = ["switchcraft", "state"] as const;
const STATE_CHANNEL = "switchcraft:changed";

function invoke<T>(channel: string, ...args: unknown[]): Promise<T> {
  return window.glazeAPI.glaze.ipc.invoke<T>(channel, ...args);
}

export const api = {
  getState: () => invoke<SwitchcraftState>("switchcraft:getState"),
  createPreset: () => invoke<Preset>("presets:create"),
  updatePreset: (preset: Preset) =>
    invoke<PresetUpdateResult>("presets:update", preset),
  duplicatePreset: (id: string) => invoke<Preset>("presets:duplicate", id),
  deletePreset: (id: string) => invoke<void>("presets:delete", id),
  reorderPresets: (ids: string[]) => invoke<void>("presets:reorder", ids),
  applyPreset: (id: string) => invoke<ApplyResult>("presets:apply", id),
  getCurrentTargets: () => invoke<CurrentTargets>("audio:getCurrentTargets"),
  checkShortcut: (accelerator: string, presetId: string) =>
    invoke<ShortcutCheckResult>("shortcuts:check", accelerator, presetId),
  setShortcutRecording: (recording: boolean) =>
    invoke<void>("shortcuts:setRecording", recording),
  setPreferences: (preferences: Partial<AppSettings>) =>
    invoke<AppSettings>("prefs:set", preferences),
};

export function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isState(value: unknown): value is SwitchcraftState {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { presets?: unknown }).presets)
  );
}

/** App state from the backend, kept live by its change broadcasts. */
export function useSwitchcraftState() {
  const queryClient = useQueryClient();
  useEffect(() => {
    return window.glazeAPI.glaze.ipc.on(STATE_CHANNEL, (_event, payload) => {
      if (isState(payload)) queryClient.setQueryData(STATE_KEY, payload);
    });
  }, [queryClient]);
  return useQuery({
    queryKey: STATE_KEY,
    queryFn: api.getState,
    staleTime: Infinity,
  });
}

/** Optimistically adjust the cached state; the next broadcast replaces it. */
export function usePatchState() {
  const queryClient = useQueryClient();
  return (change: (state: SwitchcraftState) => SwitchcraftState) => {
    queryClient.setQueryData<SwitchcraftState>(STATE_KEY, (old) =>
      old ? change(old) : old,
    );
  };
}

export function useRefreshState() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: STATE_KEY });
}
