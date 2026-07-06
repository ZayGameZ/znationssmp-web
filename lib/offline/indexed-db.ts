"use client";

const DB_NAME = "znations-web-cache";
const STORE = "snapshots";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function saveOfflineSnapshot<T>(key: string, value: T) {
  if (typeof indexedDB === "undefined") return;
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put({ value, savedAt: new Date().toISOString() }, key);
}

export async function getOfflineSnapshot<T>(key: string): Promise<T | null> {
  if (typeof indexedDB === "undefined") return null;
  const db = await openDb();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).get(key);
    request.onsuccess = () => resolve((request.result?.value as T) ?? null);
    request.onerror = () => resolve(null);
  });
}
