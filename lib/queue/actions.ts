"use client";

import { getOfflineSnapshot, saveOfflineSnapshot } from "@/lib/offline/indexed-db";
import type { QueuedAction } from "@/types";

const QUEUE_KEY = "queued-actions";

export async function queueClientAction(action: Omit<QueuedAction, "id" | "status" | "createdAt">) {
  const current = (await getOfflineSnapshot<QueuedAction[]>(QUEUE_KEY)) ?? [];
  const queued: QueuedAction = {
    ...action,
    id: crypto.randomUUID(),
    status: "queued",
    createdAt: new Date().toISOString()
  };
  await saveOfflineSnapshot(QUEUE_KEY, [queued, ...current]);
  return queued;
}
