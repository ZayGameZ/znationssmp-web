import { ComingSoonPage } from "@/components/dashboard/coming-soon-page";

export default function TownPage() {
  return (
    <ComingSoonPage
      embedded
      title="Town Hall"
      description="Your town's members, bank, claims, and standing will be managed here once the towns plugin syncs live data to the website."
      integration="a Towny/towns data feed via the ZNationsBridge"
    />
  );
}
