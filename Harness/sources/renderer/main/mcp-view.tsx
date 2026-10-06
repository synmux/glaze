import {
  Badge,
  Button,
  Checkbox,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  EmptyState,
  ScrollArea,
  Table,
  Toolbar,
  ToolbarActions,
  ToolbarContent,
  ToolbarSearchButton,
  ToolbarTitle,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from "@glaze/core/components";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, RefreshCw } from "lucide-react";
import * as React from "react";

import { api, TOOLS, toolLabel, type McpRow, type McpServerInput, type ToolId } from "../lib/api";
import { McpEditor } from "./mcp-editor";

const TRANSPORT_LABEL: Record<McpRow["transport"], string> = {
  stdio: "Local",
  http: "HTTP",
  sse: "SSE",
};

function rowToInput(row: McpRow): McpServerInput {
  return {
    id: row.id,
    name: row.name,
    transport: row.transport,
    command: row.transport === "stdio" ? row.summary.split(" ")[0] : "",
    args: row.transport === "stdio" ? row.summary.split(" ").slice(1) : [],
    env: [],
    url: row.transport === "stdio" ? "" : row.summary,
    headers: [],
    timeoutSec: null,
    targets: { ...row.targets },
  };
}

export function McpView() {
  const queryClient = useQueryClient();
  const overview = useQuery({ queryKey: ["overview"], queryFn: api.overview });

  const [query, setQuery] = React.useState("");
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<McpServerInput | null>(null);

  const refresh = (next: Awaited<ReturnType<typeof api.overview>>) => {
    queryClient.setQueryData(["overview"], next);
  };

  const run = async (action: () => Promise<Awaited<ReturnType<typeof api.overview>>>, success: string) => {
    try {
      refresh(await action());
      toast.success(success);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  const rows = (overview.data?.rows ?? []).filter((row) => {
    const haystack = `${row.name} ${row.summary}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });
  const managed = rows.filter((row) => row.managed);
  const unmanaged = rows.filter((row) => !row.managed);

  const toggle = (row: McpRow, tool: ToolId, enabled: boolean) =>
    run(
      () => api.setTarget(row.id, tool, enabled),
      enabled ? `Added ${row.name} to ${toolLabel(tool)}` : `Removed ${row.name} from ${toolLabel(tool)}`,
    );

  return (
    <>
      <ScrollArea
        className="h-full"
        title="MCP Servers"
        subtitle="Tick a tool to copy a server into it."
        toolbar={
          <Toolbar>
            <ToolbarContent>
              <ToolbarTitle>MCP Servers</ToolbarTitle>
            </ToolbarContent>
            <ToolbarActions>
              <ToolbarSearchButton value={query} onChange={setQuery} />
              {(overview.data?.pendingChanges ?? 0) > 0 ? (
                <Button onClick={() => run(api.applyAll, "Synced every tool")}>
                  <RefreshCw />
                  Sync {overview.data?.pendingChanges}
                </Button>
              ) : null}
              <Button
                variant="accent"
                onClick={() => {
                  setEditing(null);
                  setEditorOpen(true);
                }}
              >
                <Plus />
                Add Server
              </Button>
            </ToolbarActions>
          </Toolbar>
        }
      >
        {overview.isLoading ? (
          <div className="flex flex-col gap-2 p-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-8 rounded-md bg-control-subtle" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            placement="viewport"
            title={query ? "No matching servers" : "No MCP servers yet"}
            description="Add one, or import the servers already set up in your tools."
            actions={
              <Button
                variant="accent"
                onClick={() => {
                  setEditing(null);
                  setEditorOpen(true);
                }}
              >
                Add Server
              </Button>
            }
          />
        ) : (
          <div className="pb-8">
            <ServerTable
              rows={managed}
              onToggle={toggle}
              onEdit={(row) => {
                setEditing(rowToInput(row));
                setEditorOpen(true);
              }}
              onDelete={(row) => run(() => api.deleteServer(row.id), `Removed ${row.name}`)}
              onTake={(row, tool) =>
                run(() => api.takeToolVersion(row.id, tool), `Took ${toolLabel(tool)}'s version of ${row.name}`)
              }
            />

            {unmanaged.length > 0 ? (
              <div className="mt-6">
                <div className="flex items-baseline justify-between px-4 pb-2">
                  <h2 className="text-heading3">Not managed</h2>
                  <p className="text-small text-tertiary">
                    Found in your tools. Import one to start managing it.
                  </p>
                </div>
                <ServerTable
                  rows={unmanaged}
                  unmanaged
                  onImport={(row) => run(() => api.importServer(row.name), `Imported ${row.name}`)}
                />
              </div>
            ) : null}
          </div>
        )}
      </ScrollArea>

      <McpEditor
        open={editorOpen}
        server={editing}
        onOpenChange={setEditorOpen}
        onSave={async (server) => {
          refresh(await api.saveServer(server));
          toast.success(editing ? `Updated ${server.name}` : `Added ${server.name}`);
        }}
      />
    </>
  );
}

function ServerTable({
  rows,
  unmanaged = false,
  onToggle,
  onEdit,
  onDelete,
  onTake,
  onImport,
}: {
  rows: McpRow[];
  unmanaged?: boolean;
  onToggle?: (row: McpRow, tool: ToolId, enabled: boolean) => void;
  onEdit?: (row: McpRow) => void;
  onDelete?: (row: McpRow) => void;
  onTake?: (row: McpRow, tool: ToolId) => void;
  onImport?: (row: McpRow) => void;
}) {
  if (rows.length === 0) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Command / URL</TableHead>
          {TOOLS.map((tool) => (
            <TableHead key={tool.id} className="text-center">
              {tool.short}
            </TableHead>
          ))}
          {unmanaged ? <TableHead /> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const cells = (
            <>
              <TableCell>
                <span className="flex items-center gap-2">
                  <span className="font-medium">{row.name}</span>
                  {row.status === "drift" ? (
                    <Badge color="yellow">Out of sync</Badge>
                  ) : row.status === "pending" ? (
                    <Badge color="yellow">Not applied</Badge>
                  ) : null}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-secondary">{TRANSPORT_LABEL[row.transport]}</span>
              </TableCell>
              <TableCell>
                <span className="block max-w-64 truncate text-tertiary" title={row.summary}>
                  {row.summary || "—"}
                </span>
              </TableCell>
              {TOOLS.map((tool) => (
                <TableCell key={tool.id} className="text-center">
                  {unmanaged ? (
                    row.presentIn[tool.id] ? (
                      <Badge>In use</Badge>
                    ) : null
                  ) : (
                    <Checkbox
                      aria-label={`${row.name} in ${tool.label}`}
                      checked={row.targets[tool.id]}
                      onCheckedChange={(checked) => onToggle?.(row, tool.id, checked === true)}
                    />
                  )}
                </TableCell>
              ))}
              {unmanaged ? (
                <TableCell className="text-right">
                  <Button size="small" onClick={() => onImport?.(row)}>
                    Import
                  </Button>
                </TableCell>
              ) : null}
            </>
          );

          if (unmanaged) {
            return <TableRow key={row.id}>{cells}</TableRow>;
          }

          return (
            <ContextMenu key={row.id}>
              <ContextMenuTrigger asChild>
                <TableRow>{cells}</TableRow>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onSelect={() => onEdit?.(row)}>Edit</ContextMenuItem>
                {row.driftedTools.map((tool) => (
                  <ContextMenuItem key={tool} onSelect={() => onTake?.(row, tool)}>
                    Use {toolLabel(tool)}'s version
                  </ContextMenuItem>
                ))}
                <ContextMenuSeparator />
                <ContextMenuItem color="red" onSelect={() => onDelete?.(row)}>
                  Remove from library
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
      </TableBody>
    </Table>
  );
}
