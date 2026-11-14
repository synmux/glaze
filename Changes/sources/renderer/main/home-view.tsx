import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  ScrollArea,
  Status,
  Text,
} from "@glaze/core/components";
import { Braces, FileDiff, MoreHorizontal, Plus, Shuffle, Volume2, VolumeX } from "lucide-react";

import { WatchDialog } from "./watch-dialog";
import { formatInterval, formatRelative, type Watch } from "./watch-types";
import { SOUND_META } from "../lib/alert-sounds";

type StatusVariant = "error" | "warning" | "loading" | "success" | "neutral";

function statusFor(watch: Watch): { variant: StatusVariant; label: string } {
  if (!watch.enabled) return { variant: "neutral", label: "Paused" };
  switch (watch.lastStatus) {
    case "error":
      return { variant: "error", label: "Error" };
    case "changed":
      return { variant: "warning", label: "Changed" };
    case "watching":
      return { variant: "success", label: "Watching" };
    default:
      return { variant: "loading", label: "Checking…" };
  }
}

export function HomeView() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Watch | null>(null);

  const { data: watches = [], isLoading } = useQuery({
    queryKey: ["watches"],
    queryFn: async () => (await window.glazeAPI.glaze.ipc.invoke("watches:list")) as Watch[],
  });

  // Live updates pushed from the backend polling loop.
  useEffect(() => {
    const off = window.glazeAPI.glaze.ipc.onNotification("watches:changed", (params) => {
      const next = (params as { watches?: Watch[] })?.watches;
      if (next) queryClient.setQueryData(["watches"], next);
    });
    return () => off?.();
  }, [queryClient]);

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["watches"] });

  const checkNow = useMutation({
    mutationFn: (id: string) => window.glazeAPI.glaze.ipc.invoke("watches:checkNow", { id }),
  });
  const setEnabled = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      window.glazeAPI.glaze.ipc.invoke("watches:setEnabled", { id, enabled }),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => window.glazeAPI.glaze.ipc.invoke("watches:remove", { id }),
    onSuccess: invalidate,
  });

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (watch: Watch) => {
    setEditing(watch);
    setDialogOpen(true);
  };

  return (
    <>
      <ScrollArea
        title="Watches"
        actions={
          <Button onClick={openAdd}>
            <Plus className="size-4" />
            Add
          </Button>
        }
      >
        {isLoading ? (
          <div className="flex flex-col divide-y divide-separator">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[68px] px-4 py-3">
                <div className="h-4 w-40 rounded bg-control-subtle" />
                <div className="mt-2 h-3 w-64 rounded bg-control-subtle" />
              </div>
            ))}
          </div>
        ) : watches.length === 0 ? (
          <EmptyState
            placement="center"
            title="No watches yet"
            description="Add a URL and Glaze will alert you the moment its content changes."
            actions={
              <Button variant="accent" onClick={openAdd}>
                <Plus className="size-4" />
                Add a watch
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col divide-y divide-separator">
            {watches.map((watch) => {
              const status = statusFor(watch);
              return (
                <div key={watch.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <Text variant="strong" truncate>
                        {watch.label || watch.url}
                      </Text>
                      {watch.jsonNormalize ? (
                        <Braces className="size-3.5 shrink-0 text-tertiary" aria-label="JSON normalized" />
                      ) : null}
                      {watch.cacheBust ? (
                        <Shuffle className="size-3.5 shrink-0 text-tertiary" aria-label="Cache busting enabled" />
                      ) : null}
                      {watch.showDiff ? (
                        <FileDiff className="size-3.5 shrink-0 text-tertiary" aria-label="Diff shown in alert" />
                      ) : null}
                      {watch.sound !== "none" ? (
                        <Volume2 className="size-3.5 shrink-0 text-tertiary" aria-label={`Sound: ${SOUND_META[watch.sound].label}`} />
                      ) : (
                        <VolumeX className="size-3.5 shrink-0 text-quaternary" aria-label="Sound off" />
                      )}
                    </div>
                    {watch.label ? (
                      <Text variant="small" color="secondary" truncate>
                        {watch.url}
                      </Text>
                    ) : null}
                    <Text variant="mini" color="tertiary" truncate>
                      {formatInterval(watch.intervalSeconds)} · Checked {formatRelative(watch.lastCheckedAt)}
                      {watch.lastStatus === "error" && watch.lastError ? ` · ${watch.lastError}` : ""}
                    </Text>
                  </div>

                  <Status variant={status.variant} className="shrink-0">
                    {status.label}
                  </Status>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="transparent" size="small" iconOnly aria-label="Watch actions">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => checkNow.mutate(watch.id)}>
                        Check now
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => openEdit(watch)}>Edit…</DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setEnabled.mutate({ id: watch.id, enabled: !watch.enabled })}
                      >
                        {watch.enabled ? "Pause" : "Resume"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem color="red" onSelect={() => remove.mutate(watch.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      <WatchDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} />
    </>
  );
}
