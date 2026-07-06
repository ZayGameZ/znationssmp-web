import { NextResponse } from "next/server";
import type { ApiResponse, DataSource } from "@/types";

export function api<T>(data: T, source: DataSource = "offline", stale = source !== "live") {
  const body: ApiResponse<T> = { data, source, stale };
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": source === "live" ? "public, max-age=15" : "public, max-age=60",
      "X-ZNations-Source": source
    }
  });
}

export function accepted<T>(data: T) {
  return NextResponse.json({ data, source: "cache", stale: false }, { status: 202 });
}
