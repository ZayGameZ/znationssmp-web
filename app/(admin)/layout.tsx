import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";

// Admin pages live inside the same app shell as the rest of the logged-in
// experience, so they share the sidebar, mobile menu, and a consistent way back
// to the dashboard instead of stranding the user on a chrome-less page.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
