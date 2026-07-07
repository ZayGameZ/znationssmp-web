import { ComingSoonPage } from "@/components/dashboard/coming-soon-page";

export default function TransactionsPage() {
  return (
    <ComingSoonPage
      embedded
      title="Transactions"
      description="A live ledger of market activity — buys, sells, and listings — will appear here once the shop plugin streams real transaction data to the website."
      integration="a DynamicShop / economy transaction feed via /api/ingest"
    />
  );
}
