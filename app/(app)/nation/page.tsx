import { PlugZap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NationPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-black uppercase text-zn-gold">Not Connected Yet</p>
        <h1 className="text-4xl font-black uppercase">Nation Management</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">Nation controls are disabled until the diplomacy/towns plugin is installed and synced.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Waiting For Nation Plugin</CardTitle><PlugZap className="h-5 w-5 text-zn-gold" /></CardHeader>
        <CardContent className="text-sm leading-6 text-zinc-400">
          This page will show real nation towns, diplomacy, banks, wars, and public relation history after the server bridge exposes a live nation integration.
        </CardContent>
      </Card>
    </div>
  );
}
