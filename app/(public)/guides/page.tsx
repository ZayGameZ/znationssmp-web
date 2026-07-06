import { BookOpen } from "lucide-react";
import { PublicInfoPage } from "@/components/dashboard/public-info-page";

export default function GuidesPage() {
  return (
    <PublicInfoPage
      eyebrow="Knowledge Base"
      title="Guides"
      description="Learn the ZNations systems before joining: professions, marketplace, towns, nations, offline actions, and live map context."
      icon={BookOpen}
      primaryHref="/professions"
      primaryLabel="Profession Guide"
      secondaryHref="/town"
      secondaryLabel="Town Guide"
      cards={[
        { title: "Dynamic Shop", body: "Understand buy and sell prices, market trends, profession recommendations, watchlists, carts, and transaction history.", href: "/shop", action: "Open shop" },
        { title: "Professions", body: "Compare market tags, restrictions, perks, synergies, and economy impact for each ZProfessions role.", href: "/professions", action: "View professions" },
        { title: "Towns And Nations", body: "Queue town and nation actions from the web, then sync them when the Minecraft plugin endpoint is online.", href: "/nation", action: "Open nation panel" }
      ]}
    />
  );
}
