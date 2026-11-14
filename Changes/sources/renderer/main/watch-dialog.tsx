import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Dialog,
  Field,
  FieldGroup,
  FieldSet,
  Input,
  NumberInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
  toast,
} from "@glaze/core/components";
import { Play } from "lucide-react";

import { previewSound, SOUND_META, SOUND_OPTIONS, type SoundOption } from "../lib/alert-sounds";
import { fromSeconds, toSeconds, type IntervalUnit, type Watch, type WatchInput } from "./watch-types";

interface WatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Watch | null;
}

function isValidUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return false;
  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
}

export function WatchDialog({ open, onOpenChange, editing }: WatchDialogProps) {
  const queryClient = useQueryClient();

  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [intervalValue, setIntervalValue] = useState<number | null>(5);
  const [intervalUnit, setIntervalUnit] = useState<IntervalUnit>("minutes");
  const [sound, setSound] = useState<SoundOption>("gentle");
  const [previewing, setPreviewing] = useState(false);
  const [jsonNormalize, setJsonNormalize] = useState(false);
  const [ignorePathsText, setIgnorePathsText] = useState("");
  const [cacheBust, setCacheBust] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  // Reset the form whenever the dialog opens (for add or a specific edit target).
  useEffect(() => {
    if (!open) return;
    if (editing) {
      const { value, unit } = fromSeconds(editing.intervalSeconds);
      setUrl(editing.url);
      setLabel(editing.label);
      setIntervalValue(value);
      setIntervalUnit(unit);
      setSound(editing.sound);
      setJsonNormalize(editing.jsonNormalize);
      setIgnorePathsText(editing.ignorePaths.join("\n"));
      setCacheBust(editing.cacheBust);
      setShowDiff(editing.showDiff);
    } else {
      setUrl("");
      setLabel("");
      setIntervalValue(5);
      setIntervalUnit("minutes");
      setSound("gentle");
      setJsonNormalize(false);
      setIgnorePathsText("");
      setCacheBust(false);
      setShowDiff(false);
    }
  }, [open, editing]);

  const mutation = useMutation({
    mutationFn: async (input: WatchInput) => {
      const channel = editing ? "watches:update" : "watches:add";
      const args = editing ? { id: editing.id, ...input } : input;
      await window.glazeAPI.glaze.ipc.invoke(channel, args);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["watches"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Could not save watch: ${error instanceof Error ? error.message : String(error)}`);
    },
  });

  const valid = isValidUrl(url) && intervalValue !== null && intervalValue > 0;

  const handleConfirm = () => {
    if (!valid || intervalValue === null) return;
    const ignorePaths = ignorePathsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    mutation.mutate({
      url: url.trim(),
      label: label.trim(),
      intervalSeconds: toSeconds(intervalValue, intervalUnit),
      sound,
      jsonNormalize,
      ignorePaths,
      cacheBust,
      showDiff,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? "Edit watch" : "Add a watch"}
      description="Glaze checks the page on a schedule and alerts you the moment its content changes."
      confirmLabel={editing ? "Save" : "Add watch"}
      confirmDisabled={!valid || mutation.isPending}
      onConfirm={handleConfirm}
      size="medium"
    >
      <FieldSet>
        <FieldGroup>
          <Field label="URL" orientation="vertical">
            <Input
              type="url"
              placeholder="https://example.com/status.json"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus
            />
          </Field>
          <Field label="Name" description="Optional label shown in the list." orientation="vertical">
            <Input placeholder="e.g. Pricing page" value={label} onChange={(e) => setLabel(e.target.value)} />
          </Field>
          <Field label="Check every">
            <div className="flex items-center gap-2">
              <NumberInput value={intervalValue} onValueChange={setIntervalValue} min={1} max={9999} className="w-24" />
              <Select value={intervalUnit} onValueChange={(v) => setIntervalUnit(v as IntervalUnit)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Seconds</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Field>
          <Field label="Sound" description={SOUND_META[sound].description}>
            <div className="flex items-center gap-2">
              <Select value={sound} onValueChange={(v) => setSound(v as SoundOption)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOUND_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {SOUND_META[option].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="muted"
                size="small"
                type="button"
                disabled={sound === "none" || previewing}
                onClick={() => {
                  const ms = previewSound(sound);
                  if (ms <= 0) return;
                  setPreviewing(true);
                  setTimeout(() => setPreviewing(false), ms);
                }}
              >
                <Play className="size-3.5" />
                Preview
              </Button>
            </div>
          </Field>
          <Field
            label="Bust cache"
            description="Append a random parameter to the URL on every check so a cached response can't hide a real change."
          >
            <Switch checked={cacheBust} onCheckedChange={setCacheBust} />
          </Field>
          <Field label="Normalize JSON" description="Ignore key order and formatting; compare JSON by value.">
            <Switch checked={jsonNormalize} onCheckedChange={setJsonNormalize} />
          </Field>
          <Field
            label="Show diff"
            description={
              jsonNormalize
                ? "Include a line-by-line diff of the normalized JSON in the alert."
                : "Include a line-by-line diff of what changed in the alert."
            }
          >
            <Switch checked={showDiff} onCheckedChange={setShowDiff} />
          </Field>
          {jsonNormalize ? (
            <Field
              label="Ignore JSON paths"
              description="One JSONPath per line, e.g. $.timestamp or $.data.updatedAt. Matched values are excluded before comparing."
              orientation="vertical"
            >
              <Textarea
                placeholder={"$.timestamp\n$.qtyOrders"}
                rows={3}
                value={ignorePathsText}
                onChange={(e) => setIgnorePathsText(e.target.value)}
              />
            </Field>
          ) : null}
        </FieldGroup>
      </FieldSet>
    </Dialog>
  );
}
