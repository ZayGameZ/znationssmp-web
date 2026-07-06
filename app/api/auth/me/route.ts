import { api } from "@/lib/api/response";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  return api(await getCurrentUser());
}
