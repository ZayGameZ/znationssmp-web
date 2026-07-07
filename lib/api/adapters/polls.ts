import { withDb, type DbClient } from "@/lib/db/database";
import type { Poll, PollOption, PollStatus } from "@/types";

type PollRow = {
  id: string;
  question: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  closes_at: string | null;
};

type OptionRow = {
  id: string;
  poll_id: string;
  label: string;
  sort: number;
  votes: number | string;
};

// A poll marked "open" whose close date has passed is effectively closed. We
// compute this at read time so a missed cron/close never leaves voting open.
function effectiveStatus(row: PollRow): PollStatus {
  if (row.status === "closed") return "closed";
  if (row.closes_at) {
    const closes = Date.parse(row.closes_at);
    if (!Number.isNaN(closes) && closes <= Date.now()) return "closed";
  }
  return "open";
}

async function assemble(db: DbClient, pollRows: PollRow[], userId?: string): Promise<Poll[]> {
  if (pollRows.length === 0) return [];

  // One query for every option + its live vote count, across all polls.
  const optionRows = (
    await db
      .prepare(
        `SELECT po.id, po.poll_id, po.label, po.sort, COUNT(pv.id) AS votes
         FROM poll_options po
         LEFT JOIN poll_votes pv ON pv.option_id = po.id
         GROUP BY po.id, po.poll_id, po.label, po.sort
         ORDER BY po.sort ASC`
      )
      .all<OptionRow>()
  ).results;

  // The current viewer's vote in each poll, if any.
  const myVotes = new Map<string, string>();
  if (userId) {
    const voteRows = (
      await db.prepare("SELECT poll_id, option_id FROM poll_votes WHERE user_id = ?").bind(userId).all<{ poll_id: string; option_id: string }>()
    ).results;
    for (const vote of voteRows) myVotes.set(vote.poll_id, vote.option_id);
  }

  return pollRows.map((row) => {
    const options: PollOption[] = optionRows
      .filter((option) => option.poll_id === row.id)
      .map((option) => ({ id: option.id, label: option.label, votes: Number(option.votes) }));
    const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
    return {
      id: row.id,
      question: row.question,
      description: row.description,
      category: row.category,
      status: effectiveStatus(row),
      createdAt: row.created_at,
      closesAt: row.closes_at ?? undefined,
      options,
      totalVotes,
      votedOptionId: myVotes.get(row.id)
    };
  });
}

export async function getPolls(userId?: string): Promise<Poll[]> {
  return withDb(
    async (db) => {
      const pollRows = (
        await db
          .prepare("SELECT * FROM polls ORDER BY (status = 'open') DESC, created_at DESC LIMIT 50")
          .all<PollRow>()
      ).results;
      return assemble(db, pollRows, userId);
    },
    // Polls are a DB-only feature — no seed data. Empty is the honest state.
    async () => []
  );
}

export async function getPoll(id: string, userId?: string): Promise<Poll | null> {
  return withDb(
    async (db) => {
      const row = await db.prepare("SELECT * FROM polls WHERE id = ?").bind(id).first<PollRow>();
      if (!row) return null;
      const [poll] = await assemble(db, [row], userId);
      return poll ?? null;
    },
    async () => null
  );
}

export async function createPoll(input: {
  question: string;
  description: string;
  category: string;
  options: string[];
  closesAt?: string;
  createdBy: string;
}): Promise<Poll | null> {
  return withDb(
    async (db) => {
      const id = `poll-${crypto.randomUUID()}`;
      await db
        .prepare(
          `INSERT INTO polls (id, question, description, category, status, created_by, closes_at)
           VALUES (?, ?, ?, ?, 'open', ?, ?)`
        )
        .bind(id, input.question, input.description, input.category, input.createdBy, input.closesAt ?? null)
        .run();
      let sort = 0;
      for (const label of input.options) {
        await db
          .prepare("INSERT INTO poll_options (id, poll_id, label, sort) VALUES (?, ?, ?, ?)")
          .bind(`opt-${crypto.randomUUID()}`, id, label, sort)
          .run();
        sort += 1;
      }
      return getPoll(id, input.createdBy);
    },
    async () => null
  );
}

export type VoteResult =
  | { ok: true; poll: Poll }
  | { ok: false; reason: "not-configured" | "not-found" | "closed" | "bad-option" | "already-voted" };

export async function castVote(pollId: string, optionId: string, userId: string): Promise<VoteResult> {
  return withDb<VoteResult>(
    async (db) => {
      const pollRow = await db.prepare("SELECT * FROM polls WHERE id = ?").bind(pollId).first<PollRow>();
      if (!pollRow) return { ok: false, reason: "not-found" };
      if (effectiveStatus(pollRow) === "closed") return { ok: false, reason: "closed" };

      const option = await db
        .prepare("SELECT id FROM poll_options WHERE id = ? AND poll_id = ?")
        .bind(optionId, pollId)
        .first<{ id: string }>();
      if (!option) return { ok: false, reason: "bad-option" };

      // ON CONFLICT enforces one vote per user per poll atomically; changes === 0
      // means the unique index rejected a second vote.
      const result = await db
        .prepare(
          `INSERT INTO poll_votes (id, poll_id, option_id, user_id)
           VALUES (?, ?, ?, ?)
           ON CONFLICT (poll_id, user_id) DO NOTHING`
        )
        .bind(`vote-${crypto.randomUUID()}`, pollId, optionId, userId)
        .run();
      if (result.meta.changes === 0) return { ok: false, reason: "already-voted" };

      const poll = await getPoll(pollId, userId);
      if (!poll) return { ok: false, reason: "not-found" };
      return { ok: true, poll };
    },
    async () => ({ ok: false, reason: "not-configured" })
  );
}
