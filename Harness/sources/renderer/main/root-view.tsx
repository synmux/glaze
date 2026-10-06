import { SplitView, Status } from "@glaze/core/components";
import { useConnection, useEnvironment, useTheme } from "@glaze/core/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Outlet } from "@tanstack/react-router";
import * as React from "react";

import { AppSidebar } from "./sidebar";

export function RootView() {
  useTheme();
  const queryClient = useQueryClient();

  const connectionQuery = useConnection();
  const environmentQuery = useEnvironment();

  React.useEffect(() => {
    const unsubscribe = window.glazeAPI?.glaze?.ipc?.onNotification?.("harness:changed", () => {
      void queryClient.invalidateQueries({ queryKey: ["overview"] });
      void queryClient.invalidateQueries({ queryKey: ["plugins"] });
    });
    return () => {
      unsubscribe?.();
      window.glazeAPI?.glaze?.ipc?.disconnect();
    };
  }, [queryClient]);

  return (
    <div className="h-full relative [&:not(:has([data-toolbar]))_.drag-region]:z-50">
      <div className="drag-region fixed top-0 left-0 right-0 h-13" />
      <SplitView className="h-full" sidebar={<AppSidebar />} storageKey="harness">
        <Outlet />
      </SplitView>

      <div className="flex flex-col items-end gap-1 mt-2 fixed bottom-12 right-2">
        {import.meta.env.DEV ? (
          <>
            {connectionQuery.error ? <Status variant="error">Backend disconnected</Status> : null}
            {environmentQuery.data ? null : <Status variant="error">Dev Server not found</Status>}
          </>
        ) : null}
      </div>
    </div>
  );
}
