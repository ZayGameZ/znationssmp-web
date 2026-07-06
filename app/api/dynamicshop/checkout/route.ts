import { accepted } from "@/lib/api/response";

// Checkout remains a queued website transaction until a secure DynamicShop purchase endpoint is configured.
export async function POST(request: Request) {
  const payload = await request.json();
  return accepted({
    id: crypto.randomUUID(),
    status: "queued",
    type: "dynamicshop-checkout",
    payload,
    createdAt: new Date().toISOString()
  });
}
