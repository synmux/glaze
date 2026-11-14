import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Coffee, MoonStar, CalendarClock, Monitor, PanelBottom } from "lucide-react";
import {
  Toolbar,
  ToolbarContent,
  ToolbarTitle,
  ScrollArea,
  Button,
  Switch,
  Separator,
  Text,
} from "@glaze/core/components";

import {
  keepAwakeApi,
  DEFAULT_STATE,
  DEFAULT_SETTINGS,
  DURATION_PRESETS,
  formatCountdown,
  formatEndTime,
  type KeepAwakeState,
  type AppSettings,
} from "./keep-awake";

/** Re-render every second while a timed session is running. */
function useNow(enabled: boolean): number {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (!enabled) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [enabled]);
  return now;
}

function SettingRow({
  id,
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex items-center justify-center size-8 rounded-control bg-well text-secondary shrink-0">
        {icon}
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <label htmlFor={id} className="text-regular">
          {label}
        </label>
        <Text variant="small" color="secondary">
          {description}
        </Text>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function HomeView() {
  const queryClient = useQueryClient();

  const statusQuery = useQuery({ queryKey: ["keepAwake"], queryFn: keepAwakeApi.getStatus });
  const settingsQuery = useQuery({ queryKey: ["settings"], queryFn: keepAwakeApi.getSettings });

  const state = statusQuery.data ?? DEFAULT_STATE;
  const settings = settingsQuery.data ?? DEFAULT_SETTINGS;

  // Immediate refresh when the tray/menu changes state out from under us.
  React.useEffect(() => {
    return keepAwakeApi.onStatusChanged((next) => {
      queryClient.setQueryData(["keepAwake"], next);
      queryClient.setQueryData<AppSettings>(["settings"], (prev) =>
        prev ? { ...prev, keepDisplayAwake: next.keepDisplayAwake } : prev,
      );
    });
  }, [queryClient]);

  const applyState = (next: KeepAwakeState) => queryClient.setQueryData(["keepAwake"], next);

  const toggleAwake = useMutation({
    mutationFn: () => (state.active ? keepAwakeApi.stop() : keepAwakeApi.startIndefinite()),
    onSuccess: applyState,
  });
  const startFor = useMutation({ mutationFn: keepAwakeApi.startFor, onSuccess: applyState });
  const startUntil = useMutation({ mutationFn: keepAwakeApi.startAt, onSuccess: applyState });
  const setDisplay = useMutation({ mutationFn: keepAwakeApi.setKeepDisplayAwake, onSuccess: applyState });
  const setHideDock = useMutation({
    mutationFn: keepAwakeApi.setHideDock,
    onSuccess: (value) =>
      queryClient.setQueryData<AppSettings>(["settings"], (prev) => ({
        ...(prev ?? DEFAULT_SETTINGS),
        hideDockIcon: value,
      })),
  });

  const timed = state.mode === "timed" && state.endsAt !== null;
  const now = useNow(timed);
  const remaining = state.endsAt ? state.endsAt - now : 0;

  return (
    <ScrollArea
      className="h-full"
      toolbar={
        <Toolbar>
          <ToolbarContent>
            <ToolbarTitle>Caffeinate</ToolbarTitle>
          </ToolbarContent>
        </Toolbar>
      }
    >
      <div className="px-5 pb-6 flex flex-col gap-5">
        {/* Status hero */}
        <div className="flex flex-col items-center text-center gap-3 pt-1">
          <div className="flex items-center justify-center size-20 rounded-full bg-well">
            {state.active ? (
              <Coffee className="size-9 text-accent" />
            ) : (
              <MoonStar className="size-9 text-tertiary" />
            )}
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <Text variant="heading2">{state.active ? "Keeping Awake" : "Sleep Allowed"}</Text>
            {timed && state.endsAt ? (
              <>
                <Text variant="heading1" color="accent" className="tabular-nums leading-tight">
                  {formatCountdown(remaining)}
                </Text>
                <Text variant="small" color="secondary">
                  until {formatEndTime(state.endsAt)}
                </Text>
              </>
            ) : (
              <Text variant="small" color="secondary">
                {state.mode === "indefinite" ? "Until you turn it off" : "Your Mac can sleep normally"}
              </Text>
            )}
          </div>
        </div>

        {/* Primary toggle */}
        <Button
          variant={state.active ? "muted" : "accent"}
          size="large"
          className="w-full"
          onClick={() => toggleAwake.mutate()}
        >
          {state.active ? "Allow Sleep Now" : "Keep Awake"}
        </Button>

        <Separator />

        {/* Timed sessions */}
        <section className="flex flex-col gap-3">
          <Text variant="small-strong" color="secondary" className="uppercase tracking-wide">
            Keep awake for
          </Text>
          <div className="grid grid-cols-3 gap-2">
            {DURATION_PRESETS.map((preset) => (
              <Button key={preset.ms} variant="muted" onClick={() => startFor.mutate(preset.ms)}>
                {preset.label}
              </Button>
            ))}
          </div>
          <Button
            variant="muted"
            className="w-full gap-2"
            onClick={async (event) => {
              const button = event.currentTarget;
              const rect = button.getBoundingClientRect();
              const now = Date.now();
              const result = await window.glazeAPI.dialog.showDatePicker({
                mode: "dateAndTime",
                x: Math.round(rect.left),
                y: Math.round(rect.bottom + 4),
                initialValue: new Date(now + 60 * 60 * 1000).toISOString(),
                min: new Date(now + 60 * 1000).toISOString(),
              });
              if (!result.canceled && result.value) {
                startUntil.mutate(new Date(result.value).getTime());
              }
            }}
          >
            <CalendarClock className="size-4 shrink-0" />
            Until date &amp; time…
          </Button>
        </section>

        <Separator />

        {/* Options */}
        <section className="flex flex-col">
          <SettingRow
            id="keep-display-awake"
            icon={<Monitor className="size-4" />}
            label="Keep display awake"
            description="Also prevent the screen from turning off"
            checked={state.keepDisplayAwake}
            onChange={(value) => setDisplay.mutate(value)}
          />
          <SettingRow
            id="hide-dock-icon"
            icon={<PanelBottom className="size-4" />}
            label="Hide Dock icon"
            description="Run only from the menu bar"
            checked={settings.hideDockIcon}
            onChange={(value) => setHideDock.mutate(value)}
          />
        </section>
      </div>
    </ScrollArea>
  );
}
