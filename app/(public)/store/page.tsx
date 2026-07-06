import { ComingSoonPage } from "@/components/dashboard/coming-soon-page";

export default function StorePage() {
  return (
    <ComingSoonPage
      title="Support Store"
      description="Ranks, cosmetics, and purchase history will go live once the store provider is connected."
      integration="store/payment provider API"
    />
  );
}
