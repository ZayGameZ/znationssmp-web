import { Gavel } from "lucide-react";
import { PublicInfoPage } from "@/components/dashboard/public-info-page";

export default function RulesPage() {
  return (
    <PublicInfoPage
      eyebrow="Server Law"
      title="Rules"
      description="The core ZNations rules protect civilization gameplay: fair trade, respectful diplomacy, clean conflict, and no hidden location exposure."
      icon={Gavel}
      primaryHref="/guides"
      primaryLabel="Read Guides"
      secondaryHref="/dashboard"
      secondaryLabel="Player Hub"
      cards={[
        { title: "Civilization First", body: "Build, trade, ally, rival, and compete without bypassing protection systems or turning conflict into random griefing." },
        { title: "Economy Integrity", body: "No exploit trading, duping, market manipulation through bugs, or abuse of queued web actions." },
        { title: "Privacy Boundaries", body: "Public profiles show gameplay stats, not coordinates, IP addresses, staff notes, or private moderation data." }
      ]}
    />
  );
}
