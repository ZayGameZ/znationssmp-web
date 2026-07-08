"use client";

import { getOfflineSnapshot, saveOfflineSnapshot } from "@/lib/offline/indexed-db";
import type { QueuedAction } from "@/types";

const QUEUE_KEY = "queued-actions";

export async function queueClientAction(action: Omit<QueuedAction, "id" | "status" | "createdAt" | "userId">) {
  // Try the real, DB-backed queue first; only fall back to the local IndexedDB
  // snapshot (kept for the "usable offline" promise) if the server is unreachable
  // — previously this only ever wrote to IndexedDB and never reached the server.
  try {
    const response = await fetch("/api/queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action)
    });
    if (response.ok) {
      const body = await response.json();
      return body.data as QueuedAction;
    }
  } catch {
    // offline or network error — fall through to the local queue below
  }

  const current = (await getOfflineSnapshot<QueuedAction[]>(QUEUE_KEY)) ?? [];
  const queued: QueuedAction = {
    ...action,
    userId: "",
    id: crypto.randomUUID(),
    status: "queued",
    createdAt: new Date().toISOString()
  };
  await saveOfflineSnapshot(QUEUE_KEY, [queued, ...current]);
  return queued;
}
