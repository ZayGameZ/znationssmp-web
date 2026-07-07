import { ComingSoonPage } from "@/components/dashboard/coming-soon-page";

export default function NationPage() {
  return (
    <ComingSoonPage
      embedded
      title="Nation Court"
      description="Diplomacy, member towns, wars, and the nation treasury will be governed here once nation data flows from the server."
      integration="a nations/diplomacy data feed via the ZNationsBridge"
    />
  );
}
