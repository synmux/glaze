import * as React from "react";
import { Button } from "./button";
import { GlazeLogo } from "./glaze-logo";
import { Text } from "./text";
import { isBundledStoreApp } from "../utils/build-flavor";

export function ErrorBoundaryView({ error }: { error: unknown }) {
  const storeApp = isBundledStoreApp();

  React.useEffect(() => {
    console.error("[Router] Uncaught error:", error);
  }, [error]);

  const handleFixWithAgent = React.useCallback(async () => {
    const errorMessage =
      error instanceof Error
        ? error.stack?.includes(error.message)
          ? error.stack
          : `${error.message}\n\n${error.stack ?? ""}`
        : String(error);
    const prompt = `Fix this runtime error:\n\n${errorMessage}`;

    let projectPath: string | undefined;
    try {
      projectPath = await window.glazeAPI.glaze.ipc.invoke<string>("app:getProjectPath");
    } catch {
      // The native agent opener can still fall back to the runtime root.
    }

    try {
      await window.glazeAPI.glaze.ipc.invoke("glaze:openAgent", { projectPath, prompt });
    } catch {
      // best-effort — user can open agent manually
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-2 p-8 text-center">
      <div className="drag-region fixed top-0 left-0 right-0 h-13" />
      <Text as="p" variant="heading1">
        Something went wrong
      </Text>
      {storeApp ? (
        <Text as="p" color="secondary" className="max-w-md">
          This app encountered an error. Try reloading or contact the app developer.
        </Text>
      ) : error instanceof Error ? (
        <Text
          as="pre"
          variant="small-mono"
          color="quaternary"
          className="max-w-[80vw] whitespace-pre-wrap wrap-break-word mt-1"
        >
          {error.message}
        </Text>
      ) : (
        <Text as="p" color="secondary" className="max-w-md">
          The agent has access to logs and can help fix this issue.
        </Text>
      )}
      <div className="flex items-center gap-2 mt-4">
        {!storeApp && (
          <Button variant="filled" onClick={handleFixWithAgent}>
            <GlazeLogo className="w-3 h-3 mx-0 mb-0" />
            Fix with Agent
          </Button>
        )}
        <Button variant={storeApp ? "filled" : "muted"} onClick={() => window.location.reload()}>
          Reload
        </Button>
      </div>
    </div>
  );
}
