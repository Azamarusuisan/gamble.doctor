import { appendFile } from "node:fs/promises";

const driver = (process.env.NOTIFY_DRIVER ?? "console").toLowerCase();
const logFile = process.env.NOTIFY_LOG_FILE ?? "./notify.log";

export async function sendDemoNotification(event: string, payload: Record<string, unknown>) {
  const message = {
    event,
    timestamp: new Date().toISOString(),
    payload
  };

  if (driver === "file") {
    await appendFile(logFile, `${JSON.stringify(message)}\n`, "utf-8");
    return { driver: "file", file: logFile } as const;
  }

  // Default console driver
  console.info("[DEMO NOTIFY]", message);
  return { driver: "console" } as const;
}
