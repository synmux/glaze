import { Button, Field, FieldSet, ScrollArea, Switch, toast } from "@glaze/core/components";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { api, type LibrarySettings } from "../lib/api";

declare const __APP_DISPLAY_NAME__: string | undefined;

export function SettingsView() {
  const queryClient = useQueryClient();
  const settings = useQuery({ queryKey: ["settings"], queryFn: api.getSettings });

  const save = async (partial: Partial<LibrarySettings>) => {
    const previous = queryClient.getQueryData<LibrarySettings>(["settings"]);
    if (previous) queryClient.setQueryData(["settings"], { ...previous, ...partial });
    try {
      const next = await api.saveSettings(partial);
      queryClient.setQueryData(["settings"], next);
    } catch (error) {
      queryClient.setQueryData(["settings"], previous);
      toast.error(error instanceof Error ? error.message : "Couldn't save settings.");
    }
  };

  const current = settings.data;

  return (
    <ScrollArea
      className="h-full"
      title="Settings"
      subtitle={__APP_DISPLAY_NAME__ || "Harness"}
    >
      <div className="flex flex-col gap-6 p-4 pb-8">
        <FieldSet title="Sync" description="How changes reach your tools.">
          <Field
            label="Apply changes immediately"
            description="Off, and changes wait until you press Sync."
          >
            <Switch
              aria-label="Apply changes immediately"
              checked={current?.autoApply ?? true}
              disabled={!current}
              onCheckedChange={(checked) => save({ autoApply: checked })}
            />
          </Field>
          <Field label="Backups to keep" description="A copy is saved before every write.">
            <input
              aria-label="Backups to keep"
              type="number"
              min={1}
              max={200}
              value={current?.backupKeep ?? 20}
              disabled={!current}
              onChange={(event) => save({ backupKeep: Number(event.target.value) })}
              className="h-7 w-20 rounded-md bg-control-subtle px-2 text-right text-small tabular-nums outline-none"
            />
          </Field>
        </FieldSet>

        <FieldSet title="Library">
          <Field label="Library file">
            <Button size="small" onClick={() => api.revealLibrary()}>
              Reveal in Finder
            </Button>
          </Field>
          <Field label="Backups">
            <Button size="small" onClick={() => api.revealBackups()}>
              Reveal in Finder
            </Button>
          </Field>
        </FieldSet>
      </div>
    </ScrollArea>
  );
}
