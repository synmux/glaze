import { useEffect, useState, type ReactNode } from "react";
import {
  AlertDialog,
  Button,
  EmptyState,
  ScrollArea,
  SplitView,
  toast,
} from "@glaze/core/components";
import { useTheme } from "@glaze/core/hooks";

import type { Preset, SwitchcraftState } from "../../main/shared/types";
import {
  api,
  errorText,
  usePatchState,
  useRefreshState,
  useSwitchcraftState,
} from "./api";
import { GeneralPane } from "./components/general-pane";
import { PresetEditor } from "./components/preset-editor";
import {
  PresetSidebar,
  type SidebarSelection,
} from "./components/preset-sidebar";

/** Close Preferences on Escape, unless a field is focused or a popover is open. */
function useCloseOnEscape(): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      const el = document.activeElement;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      ) {
        return;
      }
      if (document.querySelector("[data-radix-popper-content-wrapper]")) return;
      event.preventDefault();
      void window.glazeAPI.glaze.ipc.invoke("window:closeSettings");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

function upsertPreset(
  state: SwitchcraftState,
  preset: Preset,
  afterId?: string,
): SwitchcraftState {
  if (state.presets.some((p) => p.id === preset.id)) return state;
  const presets = [...state.presets];
  const afterIndex = afterId ? presets.findIndex((p) => p.id === afterId) : -1;
  if (afterIndex >= 0) presets.splice(afterIndex + 1, 0, preset);
  else presets.push(preset);
  return { ...state, presets };
}

export function SettingsView() {
  useTheme();
  useCloseOnEscape();

  const stateQuery = useSwitchcraftState();
  const patchState = usePatchState();
  const refreshState = useRefreshState();
  const [selection, setSelection] = useState<SidebarSelection>(null);
  const [pendingDelete, setPendingDelete] = useState<Preset | null>(null);

  const state = stateQuery.data;
  const presets = state?.presets ?? [];

  // Derived view: General, a preset (falling back to the first one), or the empty state.
  const explicitPreset =
    selection !== null && selection !== "general"
      ? presets.find((p) => p.id === selection.presetId)
      : undefined;
  const activePreset =
    selection === "general" ? undefined : (explicitPreset ?? presets[0]);
  const sidebarSelection: SidebarSelection =
    selection === "general"
      ? "general"
      : activePreset
        ? { presetId: activePreset.id }
        : null;

  async function createPreset(): Promise<void> {
    try {
      const preset = await api.createPreset();
      patchState((s) => upsertPreset(s, preset));
      setSelection({ presetId: preset.id });
    } catch (error) {
      toast.error(`Couldn't create a preset: ${errorText(error)}`);
    }
  }

  async function duplicatePreset(id: string): Promise<void> {
    try {
      const copy = await api.duplicatePreset(id);
      patchState((s) => upsertPreset(s, copy, id));
      setSelection({ presetId: copy.id });
    } catch (error) {
      toast.error(`Couldn't duplicate the preset: ${errorText(error)}`);
    }
  }

  async function applyPreset(id: string): Promise<void> {
    try {
      await api.applyPreset(id);
    } catch (error) {
      toast.error(`Couldn't apply the preset: ${errorText(error)}`);
    }
  }

  function reorderPresets(ids: string[]): void {
    patchState((s) => {
      const byId = new Map(s.presets.map((p) => [p.id, p]));
      const reordered = ids
        .map((id) => byId.get(id))
        .filter((p): p is Preset => p !== undefined);
      return reordered.length === s.presets.length
        ? { ...s, presets: reordered }
        : s;
    });
    api.reorderPresets(ids).catch((error: unknown) => {
      toast.error(`Couldn't reorder presets: ${errorText(error)}`);
      void refreshState();
    });
  }

  async function confirmDelete(): Promise<void> {
    const target = pendingDelete;
    if (!target) return;
    const index = presets.findIndex((p) => p.id === target.id);
    const neighbour = presets[index + 1] ?? presets[index - 1];
    try {
      await api.deletePreset(target.id);
      patchState((s) => ({
        ...s,
        presets: s.presets.filter((p) => p.id !== target.id),
      }));
      setSelection(neighbour ? { presetId: neighbour.id } : null);
      setPendingDelete(null);
    } catch (error) {
      toast.error(`Couldn't delete ${target.slug}: ${errorText(error)}`);
    }
  }

  function requestDelete(id: string): void {
    const preset = presets.find((p) => p.id === id);
    if (preset) setPendingDelete(preset);
  }

  let content: ReactNode;
  if (!state) {
    content = (
      <ScrollArea className="h-full" title="Presets">
        {stateQuery.error ? (
          <EmptyState
            title="Switchcraft couldn't load its presets"
            description={errorText(stateQuery.error)}
            actions={
              <Button onClick={() => void refreshState()}>Try Again</Button>
            }
          />
        ) : null}
      </ScrollArea>
    );
  } else if (selection === "general") {
    content = <GeneralPane state={state} />;
  } else if (activePreset) {
    content = (
      <PresetEditor
        key={activePreset.id}
        preset={activePreset}
        state={state}
        onDuplicate={() => void duplicatePreset(activePreset.id)}
        onDelete={() => requestDelete(activePreset.id)}
      />
    );
  } else {
    content = (
      <ScrollArea className="h-full" title="Presets">
        <EmptyState
          title="No presets yet"
          description="A preset switches your Mac's output, alert sounds and input in one click from the menu bar."
          actions={
            <Button variant="accent" onClick={() => void createPreset()}>
              New Preset
            </Button>
          }
        />
      </ScrollArea>
    );
  }

  return (
    <div className="h-full">
      <SplitView
        className="h-full"
        storageKey="switchcraft-preferences"
        sidebarSize={{ default: 200, min: 170, max: 260 }}
        sidebar={
          <PresetSidebar
            state={state}
            selected={sidebarSelection}
            onSelectGeneral={() => setSelection("general")}
            onSelectPreset={(id) => setSelection({ presetId: id })}
            onCreate={() => void createPreset()}
            onApply={(id) => void applyPreset(id)}
            onDuplicate={(id) => void duplicatePreset(id)}
            onDelete={requestDelete}
            onReorder={reorderPresets}
          />
        }
      >
        {content}
      </SplitView>
      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title={`Delete ${pendingDelete?.slug ?? "this preset"}?`}
        description="Its keyboard shortcut and device rule are removed too. This can't be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
