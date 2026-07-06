import { accepted, api } from "@/lib/api/response";
import { siteData } from "@/lib/mock-data";
import { announcementInput } from "@/lib/validators/admin";

// Admin content endpoint. D1 production implementation stores announcements and writes an audit log.
export async function GET() {
  return api(siteData.announcements);
}

export async function POST(request: Request) {
  const input = announcementInput.parse(await request.json());
  return accepted({
    id: crypto.randomUUID(),
    ...input,
    image: "/backgrounds/news-update.jpg",
    timeAgo: "just now"
  });
}
