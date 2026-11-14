import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import {
  Button,
  Key,
  KeyGroup,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
} from "@glaze/core/components";

import { api, errorText } from "../api";
import { acceleratorFromEvent, acceleratorGlyphs } from "../lib/shortcut";

interface ShortcutRecorderProps {
  presetId: string;
  value: string | null;
  onChange: (accelerator: string | null) => void;
  onMessage: (message: string | null) => void;
}

/**
 * Click to record, press a key combination, Esc to cancel. The combination is checked for
 * conflicts before it's saved; a taken shortcut is reported and not saved.
 */
export function ShortcutRecorder({
  presetId,
  value,
  onChange,
  onMessage,
}: ShortcutRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!recording) return;
    api.setShortcutRecording(true).catch(() => undefined);

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const plain =
        !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;
      if (event.key === "Escape" && plain) {
        setRecording(false);
        return;
      }
      const recorded = acceleratorFromEvent(event);
      if (recorded.kind === "modifierOnly") return;
      setRecording(false);
      if (recorded.kind === "invalid") {
        onMessage("That key can't be used in a shortcut.");
        return;
      }
      setChecking(true);
      api
        .checkShortcut(recorded.accelerator, presetId)
        .then((result) => {
          if (result.ok) {
            onMessage(null);
            onChange(recorded.accelerator);
          } else {
            onMessage(result.message ?? "That shortcut isn't available.");
          }
        })
        .catch((error: unknown) =>
          toast.error(`Couldn't check the shortcut: ${errorText(error)}`),
        )
        .finally(() => setChecking(false));
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      api.setShortcutRecording(false).catch(() => undefined);
    };
  }, [recording, presetId, onChange, onMessage]);

  let content: ReactNode;
  if (recording) content = "Type Shortcut…";
  else if (checking) content = "Checking…";
  else if (value) {
    content = (
      <KeyGroup>
        {acceleratorGlyphs(value).map((glyph, index) => (
          <Key key={`${glyph}-${index}`}>{glyph}</Key>
        ))}
      </KeyGroup>
    );
  } else content = "Record Shortcut";

  return (
    <div className="flex items-center gap-1">
      <Button
        size="small"
        variant={recording ? "accent" : "filled"}
        aria-label={
          value ? `Shortcut ${value}. Click to change.` : "Record shortcut"
        }
        disabled={checking}
        onClick={() => {
          onMessage(null);
          setRecording((current) => !current);
        }}
        onBlur={() => setRecording(false)}
      >
        {content}
      </Button>
      {value && !recording ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              iconOnly
              size="small"
              variant="transparent"
              aria-label="Remove shortcut"
              onClick={() => {
                onMessage(null);
                onChange(null);
              }}
            >
              <X />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove Shortcut</TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  );
}
