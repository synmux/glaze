import {
  Badge,
  EmptyState,
  ScrollArea,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from "@glaze/core/components";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { api, type PluginView } from "../lib/api";

const GROUPS: { tool: PluginView["tool"]; label: string }[] = [
  { tool: "claudeCode", label: "Claude Code" },
  { tool: "codex", label: "Codex" },
];

export function PluginsView() {
  const queryClient = useQueryClient();
  const plugins = useQuery({ queryKey: ["plugins"], queryFn: api.plugins });

  const toggle = async (plugin: PluginView, enabled: boolean) => {
    const previous = queryClient.getQueryData<PluginView[]>(["plugins"]);
    queryClient.setQueryData<PluginView[]>(["plugins"], (current) =>
      current?.map((entry) => (entry.id === plugin.id && entry.tool === plugin.tool ? { ...entry, enabled } : entry)),
    );
    try {
      const next = await api.setPluginEnabled(plugin.tool, plugin.id, enabled);
      queryClient.setQueryData(["plugins"], next);
    } catch (error) {
      queryClient.setQueryData(["plugins"], previous);
      toast.error(error instanceof Error ? error.message : "Couldn't update that plugin.");
    }
  };

  const rows = plugins.data ?? [];

  return (
    <ScrollArea
      className="h-full"
      title="Plugins"
      subtitle="Turn installed plugins on or off. They can't move between tools."
    >
      {plugins.isLoading ? (
        <div className="flex flex-col gap-2 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-8 rounded-md bg-control-subtle" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          placement="viewport"
          title="No plugins installed"
          description="Plugins installed for Claude Code and Codex will show up here."
        />
      ) : (
        <div className="flex flex-col gap-6 pb-8">
          {GROUPS.map((group) => {
            const groupRows = rows.filter((plugin) => plugin.tool === group.tool);
            if (groupRows.length === 0) return null;
            return (
              <section key={group.tool}>
                <h2 className="px-4 pb-2 text-heading3">{group.label}</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plugin</TableHead>
                      <TableHead>Marketplace</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead className="text-right">Enabled</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupRows.map((plugin) => (
                      <TableRow key={`${plugin.tool}:${plugin.id}`}>
                        <TableCell>
                          <span className="font-medium">{plugin.name}</span>
                        </TableCell>
                        <TableCell>
                          {plugin.marketplace ? <Badge>{plugin.marketplace}</Badge> : null}
                        </TableCell>
                        <TableCell>
                          <span className="tabular-nums text-tertiary">{plugin.version || "—"}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Switch
                            aria-label={`${plugin.name} enabled`}
                            checked={plugin.enabled}
                            onCheckedChange={(checked) => toggle(plugin, checked)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </section>
            );
          })}
          <p className="px-4 text-small text-tertiary">
            Claude Desktop and Goose don't have a plugin list Harness can edit.
          </p>
        </div>
      )}
    </ScrollArea>
  );
}
