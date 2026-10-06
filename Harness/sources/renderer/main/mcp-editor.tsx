import {
  Button,
  Checkbox,
  Dialog,
  Field,
  FieldSet,
  Input,
  Label,
  SegmentedControl,
  SegmentedControlItem,
} from "@glaze/core/components";
import { Plus, X } from "lucide-react";
import * as React from "react";

import { TOOLS, type KeyValue, type McpServerInput, type ToolId } from "../lib/api";

interface McpEditorProps {
  open: boolean;
  server: McpServerInput | null;
  onOpenChange: (open: boolean) => void;
  onSave: (server: McpServerInput) => Promise<void>;
}

function blank(): McpServerInput {
  return {
    id: "",
    name: "",
    transport: "stdio",
    command: "",
    args: [],
    env: [],
    url: "",
    headers: [],
    timeoutSec: null,
    targets: { claudeCode: false, claudeDesktop: false, codex: false, goose: false },
  };
}

function KeyValueEditor({
  label,
  rows,
  onChange,
}: {
  label: string;
  rows: KeyValue[];
  onChange: (rows: KeyValue[]) => void;
}) {
  return (
    <Field label={label} orientation="vertical">
      <div className="flex flex-col gap-1.5">
        {rows.map((row, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <Input
              aria-label={`${label} name`}
              placeholder="Name"
              value={row.key}
              onChange={(event) => {
                const next = [...rows];
                next[index] = { ...row, key: event.target.value };
                onChange(next);
              }}
            />
            <Input
              aria-label={`${label} value`}
              placeholder="Value"
              type="password"
              value={row.value}
              onChange={(event) => {
                const next = [...rows];
                next[index] = { ...row, value: event.target.value };
                onChange(next);
              }}
            />
            <Button
              iconOnly
              variant="transparent"
              size="small"
              aria-label="Remove"
              onClick={() => onChange(rows.filter((_, item) => item !== index))}
            >
              <X />
            </Button>
          </div>
        ))}
        <Button
          variant="transparent"
          size="small"
          className="self-start"
          onClick={() => onChange([...rows, { key: "", value: "" }])}
        >
          <Plus />
          Add
        </Button>
      </div>
    </Field>
  );
}

export function McpEditor({ open, server, onOpenChange, onSave }: McpEditorProps) {
  const [draft, setDraft] = React.useState<McpServerInput>(server ?? blank());

  React.useEffect(() => {
    if (open) setDraft(server ?? blank());
  }, [open, server]);

  const patch = (partial: Partial<McpServerInput>) => setDraft((current) => ({ ...current, ...partial }));

  const toggleTarget = (tool: ToolId, checked: boolean) =>
    setDraft((current) => ({ ...current, targets: { ...current.targets, [tool]: checked } }));

  const remote = draft.transport !== "stdio";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={server ? "Edit Server" : "Add Server"}
      description="Saved to the library, then written to each tool you tick."
      size="large"
      confirmLabel="Save"
      confirmDisabled={!draft.name.trim()}
      onConfirm={() => onSave(draft)}
    >
      <div className="flex flex-col gap-3">
        <Field label="Name" orientation="vertical">
          <Input
            autoFocus
            placeholder="dash"
            value={draft.name}
            onChange={(event) => patch({ name: event.target.value.trim() })}
          />
        </Field>

        <Field label="Transport" orientation="vertical">
          <SegmentedControl
            value={draft.transport}
            onValueChange={(value) => patch({ transport: value as McpServerInput["transport"] })}
            aria-label="Transport"
          >
            <SegmentedControlItem value="stdio">Local command</SegmentedControlItem>
            <SegmentedControlItem value="http">HTTP</SegmentedControlItem>
            <SegmentedControlItem value="sse">SSE</SegmentedControlItem>
          </SegmentedControl>
        </Field>

        {remote ? (
          <Field label="URL" orientation="vertical">
            <Input
              placeholder="https://example.com/mcp"
              value={draft.url}
              onChange={(event) => patch({ url: event.target.value })}
            />
          </Field>
        ) : (
          <>
            <Field label="Command" orientation="vertical">
              <Input
                placeholder="npx"
                value={draft.command}
                onChange={(event) => patch({ command: event.target.value })}
              />
            </Field>
            <Field label="Arguments" description="Separated by spaces." orientation="vertical">
              <Input
                placeholder="-y @scope/server"
                value={draft.args.join(" ")}
                onChange={(event) =>
                  patch({
                    args: event.target.value.split(" ").filter((arg) => arg.length > 0),
                  })
                }
              />
            </Field>
          </>
        )}

        {remote ? (
          <KeyValueEditor
            label="Headers"
            rows={draft.headers}
            onChange={(headers) => patch({ headers })}
          />
        ) : (
          <KeyValueEditor
            label="Environment"
            rows={draft.env}
            onChange={(env) => patch({ env })}
          />
        )}

        <FieldSet title="Use in">
          {TOOLS.map((tool) => (
            <Field key={tool.id} label={tool.label} orientation="horizontal">
              <Label>
                <Checkbox
                  checked={draft.targets[tool.id]}
                  onCheckedChange={(checked) => toggleTarget(tool.id, checked === true)}
                />
                <span className="sr-only">{tool.label}</span>
              </Label>
            </Field>
          ))}
        </FieldSet>

        {remote && draft.targets.claudeDesktop ? (
          <p className="text-small text-tertiary">
            Claude Desktop only runs local servers, so this one will be bridged with mcp-remote.
          </p>
        ) : null}
      </div>
    </Dialog>
  );
}
