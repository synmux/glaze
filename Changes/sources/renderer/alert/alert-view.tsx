import { useCallback, useEffect, useState } from "react";
import {
  Button,
  CollapsibleChevron,
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
  Text,
} from "@glaze/core/components";
import { Bell, ExternalLink } from "lucide-react";

import { startSoundLoop, type SoundOption } from "../lib/alert-sounds";

type DiffLineType = "add" | "remove" | "context" | "skip";

interface DiffLine {
  type: DiffLineType;
  text: string;
}

interface PendingChange {
  id: string;
  label: string;
  url: string;
  changedAt: number;
  sound: SoundOption;
  diff?: DiffLine[];
}

function DiffView({ diff }: { diff: DiffLine[] }) {
  if (diff.length === 0) {
    return (
      <Text variant="mini" color="tertiary">
        No line-level differences.
      </Text>
    );
  }
  return (
    <div className="max-h-40 overflow-y-auto rounded-md bg-control-subtle p-2 font-mono text-[11px] leading-4">
      {diff.map((line, i) => (
        <div
          key={i}
          className={
            line.type === "add"
              ? "whitespace-pre-wrap break-all bg-support-green-10 text-support-green"
              : line.type === "remove"
                ? "whitespace-pre-wrap break-all bg-support-red-10 text-support-red"
                : line.type === "skip"
                  ? "py-0.5 text-quaternary italic"
                  : "whitespace-pre-wrap break-all text-tertiary"
          }
        >
          {line.type === "add" ? "+ " : line.type === "remove" ? "- " : line.type === "skip" ? "" : "  "}
          {line.text}
        </div>
      ))}
    </div>
  );
}

interface AlertPayload {
  changes: PendingChange[];
  sound: SoundOption;
}

/** Loops the selected alert sound via Web Audio so the alert is hard to miss. */
function useSoundLoop(option: SoundOption, active: boolean) {
  useEffect(() => {
    if (!active) return;
    return startSoundLoop(option);
  }, [option, active]);
}

export function AlertView() {
  const [payload, setPayload] = useState<AlertPayload>({ changes: [], sound: "none" });

  useEffect(() => {
    void window.glazeAPI.glaze.ipc
      .invoke("alert:get")
      .then((data) => setPayload(data as AlertPayload));

    const off = window.glazeAPI.glaze.ipc.onNotification("alert:changed", (params) => {
      setPayload(params as AlertPayload);
    });
    return () => off?.();
  }, []);

  useSoundLoop(payload.sound, payload.changes.length > 0);

  const dismiss = useCallback(() => {
    void window.glazeAPI.glaze.ipc.invoke("alert:dismiss");
  }, []);

  const open = useCallback((id: string) => {
    void window.glazeAPI.glaze.ipc.invoke("alert:open", { id });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismiss]);

  const count = payload.changes.length;

  return (
    <div className="drag-region flex h-screen flex-col">
      <div className="flex flex-1 flex-col gap-4 overflow-hidden px-6 pb-5 pt-9">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-control">
            <Bell className="size-5 text-accent" />
          </div>
          <div className="min-w-0">
            <Text as="h1" variant="large-strong">
              {count > 1 ? `${count} pages changed` : "A page changed"}
            </Text>
            <Text variant="small" color="secondary">
              Detected content changes since the last check.
            </Text>
          </div>
        </div>

        <div className="no-drag flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          {payload.changes.map((change) => (
            <div key={change.id} className="rounded-lg bg-control px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <Text variant="strong" truncate>
                    {change.label}
                  </Text>
                  <Text variant="mini" color="tertiary" truncate>
                    {change.url}
                  </Text>
                </div>
                <Button
                  variant="glass"
                  size="small"
                  className="no-drag shrink-0"
                  onClick={() => open(change.id)}
                >
                  <ExternalLink className="size-3.5" />
                  Open
                </Button>
              </div>
              {change.diff ? (
                <CollapsibleRoot className="mt-1">
                  <CollapsibleTrigger variant="section" className="no-drag gap-1">
                    <CollapsibleChevron />
                    View diff
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="pt-1.5">
                      <DiffView diff={change.diff} />
                    </div>
                  </CollapsibleContent>
                </CollapsibleRoot>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="no-drag flex justify-end gap-2 px-6 pb-6">
        <Button variant="accent" onClick={dismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}
