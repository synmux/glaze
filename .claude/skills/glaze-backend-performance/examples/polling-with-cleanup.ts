// Example: Polling setup with proper lifecycle cleanup.
// Demonstrates lightweight poll responses and interval management.
// Applies to: running apps, file watchers, system monitors, task trackers, etc.
// Copy and adapt for your app.

import { app, ipcMain } from "@glaze/core/backend";

// === Polling state ===

let pollInterval: ReturnType<typeof setInterval> | null = null;

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- example function for agents to copy
function startPolling(intervalMs = 2000) {
  stopPolling(); // clear any existing interval first
  pollInterval = setInterval(async () => {
    try {
      const data = await fetchItems();
      // IMPORTANT: Only lightweight metadata — no images, no binary data
      ipcMain.broadcast("data:updated", data);
    } catch (err) {
      console.error("Poll error:", err);
    }
  }, intervalMs);
}

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
}

// CRITICAL: Clean up on shutdown — leaked intervals cause resource exhaustion
app.on("before-quit", () => {
  stopPolling();
});

// === IPC handlers ===

// Lightweight poll endpoint — metadata only
ipcMain.handle("data:list", async () => {
  return fetchItems();
});

// === Data fetching (lightweight) ===

interface ItemInfo {
  id: string;
  name: string;
  path: string;
  status: string;
  // Add your domain-specific fields here (e.g., bundleId, filePath, pid)
}

async function fetchItems(): Promise<ItemInfo[]> {
  // Return only metadata — NO images, NO thumbnails, NO file contents
  // Examples:
  //   Running apps → lsappinfo list → { id, name, bundleId, pid }
  //   File watcher → fs.readdir → { id, name, size, modified }
  //   System monitor → top/ps → { id, name, cpu, memory }
  return [];
}

// === Frontend usage ===
//
// import { getFileIconUrl } from "@glaze/core/utils";
//
// // Poll for lightweight metadata
// const { data: items } = useQuery({
//   queryKey: ["items"],
//   queryFn: () => window.glazeAPI.glaze.ipc.invoke("data:list"),
//   refetchInterval: 2000,
// });
//
// // Derive cached, display-density-aware icon URLs without moving image data over IPC.
// const rows = items?.map((item) => ({ ...item, iconUrl: getFileIconUrl(item.path, { size: 32 }) }));
