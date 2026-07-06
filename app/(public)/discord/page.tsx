import { Gamepad2 } from "lucide-react";
import { PublicInfoPage } from "@/components/dashboard/public-info-page";
import { configuredUrl, getPublicConfig } from "@/lib/config/site";

export default function DiscordPage() {
  const config = getPublicConfig();

  return (
    <PublicInfoPage
      eyebrow="Crossplay Community"
      title="Discord"
      description={configuredUrl(config.discordUrl) ? "Discord is the public gathering place for announcements, event coordination, support, and civilization diplomacy outside Minecraft." : "Discord is part of the public release setup. Add NEXT_PUBLIC_DISCORD_URL to make this button open your server invite."}
      icon={Gamepad2}
      primaryHref={configuredUrl(config.discordUrl) ? config.discordUrl : "/how-to-join"}
      primaryLabel={configuredUrl(config.discordUrl) ? "Open Discord" : "How To Join"}
      secondaryHref="/rules"
      secondaryLabel="Read Rules"
      cards={[
        { title: "Announcements", body: "Major updates, restart notices, and civilization news should be mirrored here and on Discord." },
        { title: "Events", body: "Discord will coordinate large civilization events once the event module is connected." },
        { title: "Support", body: "For public release, Discord is the fastest support path until tickets are connected.", href: "/rules", action: "Read rules" }
      ]}
    />
  );
}
