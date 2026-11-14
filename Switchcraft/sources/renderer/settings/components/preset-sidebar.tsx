import { useState, type ReactNode } from "react";
import {
  AudioLines,
  Check,
  Plus,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";
import {
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Sidebar,
  SidebarList,
  SidebarListGroup,
  SidebarListItem,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@glaze/core/components";
import { cn } from "@glaze/core/utils";

import type { SwitchcraftState } from "../../../main/shared/types";

export type SidebarSelection = "general" | { presetId: string } | null;

interface PresetSidebarProps {
  state: SwitchcraftState | undefined;
  selected: SidebarSelection;
  onSelectGeneral: () => void;
  onSelectPreset: (id: string) => void;
  onCreate: () => void;
  onApply: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (ids: string[]) => void;
}

function moveId(
  ids: readonly string[],
  sourceId: string,
  targetIndex: number,
): string[] {
  const next = ids.filter((id) => id !== sourceId);
  next.splice(Math.max(0, Math.min(targetIndex, next.length)), 0, sourceId);
  return next;
}

export function PresetSidebar({
  state,
  selected,
  onSelectGeneral,
  onSelectPreset,
  onCreate,
  onApply,
  onDuplicate,
  onDelete,
  onReorder,
}: PresetSidebarProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const presets = state?.presets ?? [];
  const ids = presets.map((preset) => preset.id);

  const move = (id: string, offset: number) => {
    const index = ids.indexOf(id);
    if (index < 0) return;
    onReorder(moveId(ids, id, index + offset));
  };

  return (
    <Sidebar
      actions={
        <Tooltip>
          <TooltipTrigger asChild>
            <Button iconOnly aria-label="New preset" onClick={onCreate}>
              <Plus className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Preset</TooltipContent>
        </Tooltip>
      }
    >
      <SidebarList>
        <SidebarListItem
          icon={<SlidersHorizontal className="size-4" />}
          title="General"
          selected={selected === "general"}
          onClick={onSelectGeneral}
        />
        <SidebarListGroup title="Presets">
          {state && presets.length === 0 ? (
            <Text variant="small" color="tertiary" className="px-2 py-1">
              No presets yet
            </Text>
          ) : null}
          {presets.map((preset, index) => {
            const isCurrent = state?.currentPresetId === preset.id;
            const shortcutTaken =
              state?.shortcuts[preset.id]?.status === "taken";
            let accessory: ReactNode;
            if (shortcutTaken) {
              accessory = (
                <TriangleAlert
                  aria-label="Shortcut unavailable"
                  className="size-4 text-support-orange"
                />
              );
            } else if (isCurrent) {
              accessory = (
                <Check
                  aria-label="Current preset"
                  className="size-4 text-secondary"
                />
              );
            }
            return (
              <ContextMenu key={preset.id}>
                <ContextMenuTrigger asChild>
                  <SidebarListItem
                    icon={<AudioLines className="size-4" />}
                    title={preset.slug}
                    accessory={accessory}
                    selected={
                      typeof selected === "object" &&
                      selected?.presetId === preset.id
                    }
                    onClick={() => onSelectPreset(preset.id)}
                    draggable
                    className={cn(
                      draggingId === preset.id && "opacity-50",
                      dropTargetId === preset.id &&
                        draggingId !== preset.id &&
                        "bg-list-hover",
                    )}
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", preset.id);
                      event.dataTransfer.effectAllowed = "move";
                      setDraggingId(preset.id);
                    }}
                    onDragOver={(event) => {
                      if (!draggingId) return;
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      setDropTargetId(preset.id);
                    }}
                    onDragLeave={() =>
                      setDropTargetId((current) =>
                        current === preset.id ? null : current,
                      )
                    }
                    onDrop={(event) => {
                      event.preventDefault();
                      const sourceId =
                        event.dataTransfer.getData("text/plain") || draggingId;
                      setDraggingId(null);
                      setDropTargetId(null);
                      if (
                        sourceId &&
                        sourceId !== preset.id &&
                        ids.includes(sourceId)
                      ) {
                        onReorder(moveId(ids, sourceId, index));
                      }
                    }}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDropTargetId(null);
                    }}
                  />
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    icon="play"
                    onSelect={() => onApply(preset.id)}
                  >
                    Apply Now
                  </ContextMenuItem>
                  <ContextMenuItem
                    icon="plus.square.on.square"
                    onSelect={() => onDuplicate(preset.id)}
                  >
                    Duplicate
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    icon="arrow.up"
                    disabled={index === 0}
                    onSelect={() => move(preset.id, -1)}
                  >
                    Move Up
                  </ContextMenuItem>
                  <ContextMenuItem
                    icon="arrow.down"
                    disabled={index === presets.length - 1}
                    onSelect={() => move(preset.id, 1)}
                  >
                    Move Down
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    icon="trash"
                    color="red"
                    onSelect={() => onDelete(preset.id)}
                  >
                    Delete…
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </SidebarListGroup>
      </SidebarList>
    </Sidebar>
  );
}
