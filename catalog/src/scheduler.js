import { syncRemoteCatalog, syncEnabled } from "./sync.js";

export function startCatalogScheduler() {
  if (!syncEnabled()) return { enabled: false };
  const intervalMs = Math.max(5, Number(process.env.CATALOG_SYNC_INTERVAL_MINUTES || 30)) * 60 * 1000;
  let running = false;

  const run = async () => {
    if (running) return;
    running = true;
    try {
      await syncRemoteCatalog();
      console.log("[catalog] synchronized");
    } catch (error) {
      console.error("[catalog] sync failed:", error.message);
    } finally {
      running = false;
    }
  };

  run();
  const timer = setInterval(run, intervalMs);
  return { enabled: true, intervalMs, timer };
}
