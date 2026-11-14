import {
  Callout,
  Field,
  FieldSet,
  ScrollArea,
  Switch,
  toast,
} from "@glaze/core/components";

import type { AppSettings, SwitchcraftState } from "../../../main/shared/types";
import { api, errorText, usePatchState, useRefreshState } from "../api";

export function GeneralPane({ state }: { state: SwitchcraftState }) {
  const patchState = usePatchState();
  const refreshState = useRefreshState();

  async function setPreference(change: Partial<AppSettings>): Promise<void> {
    patchState((s) => ({ ...s, settings: { ...s.settings, ...change } }));
    try {
      const settings = await api.setPreferences(change);
      patchState((s) => ({ ...s, settings }));
    } catch (error) {
      toast.error(`Couldn't change that preference: ${errorText(error)}`);
      void refreshState();
    }
  }

  return (
    <ScrollArea className="h-full" title="General">
      <div className="flex flex-col gap-6 px-4 pb-8">
        {state.audioError ? (
          <Callout color="red">{state.audioError}</Callout>
        ) : null}
        <FieldSet>
          <Field
            label="Show device details in menu"
            description="Lists what each preset switches to under its name in the menu bar menu."
          >
            <Switch
              aria-label="Show device details in menu"
              checked={state.settings.showDeviceDetails}
              onCheckedChange={(showDeviceDetails) =>
                void setPreference({ showDeviceDetails })
              }
            />
          </Field>
          <Field
            label="Launch at login"
            description="Start Switchcraft automatically when you log in."
          >
            <Switch
              aria-label="Launch at login"
              checked={state.settings.launchAtLogin}
              onCheckedChange={(launchAtLogin) =>
                void setPreference({ launchAtLogin })
              }
            />
          </Field>
        </FieldSet>
      </div>
    </ScrollArea>
  );
}
