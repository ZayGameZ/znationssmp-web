import postgres, { type Sql } from "postgres";

/**
 * Supabase (Postgres) data layer.
 *
 * This replaces the previous Cloudflare D1 binding. The app deploys to Vercel,
 * where D1 does not exist, so the old `withD1()` always fell back to mock data
 * and nothing persisted. Here we connect to Supabase Postgres over the standard
 * connection string and expose a tiny D1-compatible statement shim so the
 * existing call sites keep working with minimal changes:
 *
 *   db.prepare("SELECT * FROM t WHERE id = ?").bind(id).first<Row>()
 *   db.prepare("... ?, ? ...").bind(a, b).all<Row>()   -> { results, success }
 *   db.prepare("UPDATE ...").bind(...).run()           -> { meta: { changes } }
 *
 * `?` placeholders are rewritten to Postgres `$1, $2, ...` at execution time.
 *
 * When no database URL is configured the helper runs the provided `fallback`,
 * so the site still renders (with seeded/mock data) instead of crashing. This
 * keeps the "no page crashes from missing env vars" guarantee.
 */

export type DbRow = Record<string, string | number | boolean | null>;

export interface DbStatement {
  bind(...values: unknown[]): DbStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[]; success: boolean }>;
  run(): Promise<{ success: boolean; meta: { changes: number } }>;
}

export interface DbClient {
  prepare(query: string): DbStatement;
}

function connectionString(): string {
  // Support the common env var names so this works with a raw Supabase string,
  // the Vercel Supabase/Postgres integration, or a manual override.
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.SUPABASE_DB_URL ??
    ""
  );
}

const globalForDb = globalThis as typeof globalThis & {
  __znDbClient?: Sql;
};

function getSql(): Sql | null {
  const url = connectionString();
  if (!url) return null;

  if (!globalForDb.__znDbClient) {
    const insecure = url.includes("localhost") || url.includes("127.0.0.1") || url.includes("sslmode=disable");
    globalForDb.__znDbClient = postgres(url, {
      // Supabase's transaction pooler (port 6543) multiplexes many client
      // connections onto a small server pool, so opening several per warm
      // instance is both safe and NECESSARY here. max:1 meant every concurrent
      // request on an instance shared ONE connection — a single slow query (the
      // admin page fans out 7 at once) head-of-line-blocked every other request
      // site-wide, since every page reads the session from the DB. That was the
      // "one admin click freezes all devices for minutes" bug.
      max: 5,
      idle_timeout: 20,
      max_lifetime: 60 * 30,
      connect_timeout: 10,
      prepare: false,
      ssl: insecure ? false : "require"
    });
  }

  return globalForDb.__znDbClient;
}

function toPositional(query: string): string {
  let index = 0;
  return query.replace(/\?/g, () => `$${(index += 1)}`);
}

// Hard client-side ceiling on any single query. If a query — or the pooler —
// stalls, this rejects so withDb() degrades to its fallback instead of pinning
// the request (and, before max was raised, the whole instance) for minutes. The
// underlying promise's late result is swallowed so it can't surface as an
// unhandledRejection.
const QUERY_TIMEOUT_MS = 10_000;
function withQueryTimeout<T>(promise: Promise<T>): Promise<T> {
  promise.catch(() => {});
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`query exceeded ${QUERY_TIMEOUT_MS}ms`)), QUERY_TIMEOUT_MS);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer)) as Promise<T>;
}

function makeClient(sql: Sql): DbClient {
  return {
    prepare(query: string): DbStatement {
      let params: unknown[] = [];
      const text = toPositional(query);

      const statement: DbStatement = {
        bind(...values: unknown[]) {
          params = values;
          return statement;
        },
        async first<T>() {
          const rows = await withQueryTimeout(sql.unsafe(text, params as never[]));
          return (rows[0] as T) ?? null;
        },
        async all<T>() {
          const rows = await withQueryTimeout(sql.unsafe(text, params as never[]));
          return { results: rows as unknown as T[], success: true };
        },
        async run() {
          const rows = await withQueryTimeout(sql.unsafe(text, params as never[]));
          return { success: true, meta: { changes: rows.count ?? 0 } };
        }
      };

      return statement;
    }
  };
}

/**
 * Returns true when a database connection string is configured. Callers can use
 * this to surface honest "not configured" states instead of pretending writes
 * succeeded.
 */
export function isDatabaseConfigured(): boolean {
  return connectionString().length > 0;
}

export async function withDb<T>(operation: (db: DbClient) => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  const sql = getSql();
  if (!sql) return fallback();

  try {
    return await operation(makeClient(sql));
  } catch (error) {
    // Do not swallow silently: name the system so failures are debuggable, but
    // still degrade to the fallback so a DB hiccup never takes the page down.
    console.error("[database] query failed, falling back to seed/offline data:", error);
    return fallback();
  }
}
