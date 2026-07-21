import { CalendarClock, Flag, Trophy } from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getGameEvents, type GameEvent } from "@/lib/api/adapters/game-feeds";

export const dynamic = "force-dynamic";

const PHASE_LABEL: Record<GameEvent["phase"], string> = {
  SCHEDULED: "Scheduled",
  ANNOUNCED: "Announced — prepare!",
  ACTIVE: "ACTIVE NOW",
  RESOLVED: "Paying rewards",
  CANCELLED: "Cancelled",
  ARCHIVED: "Concluded"
};

export default async function EventsPage() {
  const events = await getGameEvents();
  const current = events.filter((event) => event.phase !== "ARCHIVED" && event.phase !== "CANCELLED");
  const concluded = events.filter((event) => event.phase === "ARCHIVED" || event.phase === "CANCELLED");

  return (
    <div className="min-h-screen bg-zn-black text-white">
      <PublicNav />
      <main className="mx-auto max-w-[1320px] px-4 py-8 md:px-8">
        <section className="rounded-lg border border-zn-line bg-[linear-gradient(135deg,rgba(212,175,55,.16),transparent),#080808] p-6 md:p-10">
          <Badge><CalendarClock className="mr-2 h-3.5 w-3.5" /> Season 1 &mdash; Live from the server</Badge>
          <h1 className="mt-5 text-4xl font-black uppercase md:text-6xl">Civilization Events</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">
            Famines, plagues, resource races, and festivals &mdash; shared history in the making.
            Check <span className="text-zn-lightGold">/events</span> in game to contribute and claim your place.
          </p>
        </section>

        <section className="mt-5">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-black uppercase text-zn-lightGold">
            <Flag className="h-5 w-5" /> Current &amp; Upcoming
          </h2>
          {current.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-zinc-400">
                No events on the horizon. When one is scheduled, it is announced in game, on Discord,
                and here — with time to prepare.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {current.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {concluded.length > 0 && (
          <section className="mt-5">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-black uppercase text-zn-lightGold">
              <Trophy className="h-5 w-5" /> Concluded
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {concluded.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function EventCard({ event }: { event: GameEvent }) {
  const active = event.phase === "ACTIVE";
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className={`text-lg font-black uppercase ${active ? "text-red-300" : "text-zn-parchment"}`}>
            {event.name}
          </p>
          <Badge>{PHASE_LABEL[event.phase] ?? event.phase}</Badge>
        </div>
        <p className="mt-2 text-sm text-zinc-400">
          {event.category.replace("_", " ").toLowerCase()} event &middot; {formatWindow(event)}
        </p>
        {event.budget > 0 && (
          <p className="mt-1 text-sm text-zn-gold">{event.budget.toLocaleString()} ZMarks in prizes</p>
        )}
        {event.summary && <p className="mt-2 text-sm italic text-zinc-500">{event.summary}</p>}
      </CardContent>
    </Card>
  );
}

function formatWindow(event: GameEvent): string {
  const starts = safeDate(event.startsAt);
  const ends = safeDate(event.endsAt);
  if (event.phase === "SCHEDULED" || event.phase === "ANNOUNCED") {
    return starts ? `starts ${starts}` : "starting soon";
  }
  if (event.phase === "ACTIVE") {
    return ends ? `ends ${ends}` : "ending soon";
  }
  return ends ? `ended ${ends}` : "ended";
}

function safeDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
    timeZoneName: "short"
  });
}
