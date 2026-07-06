import { PlugZap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TownPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-black uppercase text-zn-gold">Not Connected Yet</p>
        <h1 className="text-4xl font-black uppercase">Town Management</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">Town controls are disabled until the towns/nations plugin is installed and synced.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Waiting For Town Plugin</CardTitle><PlugZap className="h-5 w-5 text-zn-gold" /></CardHeader>
        <CardContent className="text-sm leading-6 text-zinc-400">
          This page will show real town members, banks, taxes, roles, and queued actions after the server bridge exposes a live towns integration.
        </CardContent>
      </Card>
    </div>
  );
}
