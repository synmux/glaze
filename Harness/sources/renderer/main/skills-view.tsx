import {
  AlertDialog,
  Button,
  Checkbox,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Dialog,
  EmptyState,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from "@glaze/core/components";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderPlus, Import } from "lucide-react";
import * as React from "react";

import { api, TOOLS, toolLabel, type MigrationMove, type SkillView, type ToolId } from "../lib/api";

const SKILL_TOOLS = TOOLS.filter((tool) => tool.id !== "claudeDesktop");

export function SkillsView() {
  const queryClient = useQueryClient();
  const skills = useQuery({ queryKey: ["skills"], queryFn: api.skills });

  const [planOpen, setPlanOpen] = React.useState(false);
  const [plan, setPlan] = React.useState<MigrationMove[] | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<string | null>(null);

  const refresh = (next: SkillView[]) => queryClient.setQueryData(["skills"], next);

  const run = async (action: () => Promise<SkillView[]>, success: string) => {
    try {
      refresh(await action());
      toast.success(success);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  const openPlan = async () => {
    try {
      setPlan(await api.migrationPlan());
      setPlanOpen(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't read your skill folders.");
    }
  };

  const rows = skills.data ?? [];

  return (
    <>
      <ScrollArea
        className="h-full"
        title="Skills"
        subtitle="One master copy, linked into each tool you tick."
        actions={
          <>
            <Button size="small" onClick={openPlan}>
              <Import />
              Import Existing
            </Button>
            <Button
              size="small"
              variant="accent"
              onClick={async () => {
                const result = await api.addSkill();
                if (!result) return;
                refresh(result.skills);
                toast.success(`Added ${result.name}`);
              }}
            >
              <FolderPlus />
              Add Skill
            </Button>
          </>
        }
      >
        {skills.isLoading ? (
          <div className="flex flex-col gap-2 p-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-8 rounded-md bg-control-subtle" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            placement="viewport"
            title="No skills in the library"
            description="Import the skills already installed for your tools, or add a folder."
            actions={
              <Button variant="accent" onClick={openPlan}>
                Import Existing
              </Button>
            }
          />
        ) : (
          <div className="pb-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  {SKILL_TOOLS.map((tool) => (
                    <TableHead key={tool.id} className="text-center">
                      {tool.short}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Desktop</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((skill) => (
                  <ContextMenu key={skill.name}>
                    <ContextMenuTrigger asChild>
                      <TableRow>
                        <TableCell>
                          <span className="font-medium">{skill.name}</span>
                        </TableCell>
                        <TableCell>
                          <span className="block max-w-80 truncate text-tertiary">
                            {skill.description || "—"}
                          </span>
                        </TableCell>
                        {SKILL_TOOLS.map((tool) => (
                          <TableCell key={tool.id} className="text-center">
                            <Checkbox
                              aria-label={`${skill.name} in ${tool.label}`}
                              checked={skill.targets[tool.id]}
                              onCheckedChange={(checked) =>
                                run(
                                  () => api.setSkillTarget(skill.name, tool.id, checked === true),
                                  checked
                                    ? `Linked ${skill.name} into ${tool.label}`
                                    : `Unlinked ${skill.name} from ${tool.label}`,
                                )
                              }
                            />
                          </TableCell>
                        ))}
                        <TableCell className="text-center">
                          <Checkbox disabled aria-label="Claude Desktop has no skills folder" />
                        </TableCell>
                      </TableRow>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onSelect={() => api.revealSkill(skill.name)}>
                        Reveal in Finder
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem color="red" onSelect={() => setPendingDelete(skill.name)}>
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </TableBody>
            </Table>
            <p className="px-4 pt-3 text-small text-tertiary">
              Claude Desktop doesn't keep skills in a folder, so its column stays off.
            </p>
          </div>
        )}
      </ScrollArea>

      <Dialog
        open={planOpen}
        onOpenChange={setPlanOpen}
        title="Import existing skills"
        description={
          plan && plan.length > 0
            ? `${plan.length} skill folders will move into Harness. Each tool keeps the ones it already has.`
            : "Nothing to import."
        }
        size="large"
        confirmLabel="Move into Harness"
        confirmDisabled={!plan || plan.length === 0}
        onConfirm={async () => {
          const result = await api.migrateSkills();
          refresh(result.skills);
          toast.success(`Moved ${result.moved} skills into Harness`);
        }}
      >
        <ul className="flex flex-col divide-y divide-separator">
          {(plan ?? []).map((move) => (
            <li key={move.name} className="flex items-baseline justify-between gap-3 py-1.5">
              <span className="font-medium">{move.name}</span>
              <span className="text-small text-tertiary">
                {move.keepIn.length > 0
                  ? `Keeps: ${move.keepIn.map((tool) => toolLabel(tool as ToolId)).join(", ")}`
                  : "Not linked anywhere yet"}
              </span>
            </li>
          ))}
        </ul>
      </Dialog>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title={`Delete ${pendingDelete ?? "this skill"}?`}
        description="The master copy is removed and its links disappear from every tool. This can't be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={async () => {
          if (!pendingDelete) return;
          refresh(await api.deleteSkill(pendingDelete));
          toast.success(`Deleted ${pendingDelete}`);
          setPendingDelete(null);
        }}
      />
    </>
  );
}
