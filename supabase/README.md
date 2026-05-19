# Supabase setup

## Quick start

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor**
3. Paste the contents of [`RUN_IN_SUPABASE.sql`](./RUN_IN_SUPABASE.sql) and click **Run**

This creates all tables, RLS policies, and seed data from the app's JSON files.

## Files

| File | Purpose |
|------|---------|
| `RUN_IN_SUPABASE.sql` | Single file to paste in SQL Editor |
| `schema.sql` | Same content as RUN_IN_SUPABASE (reference copy) |
| `migrations/001_initial.sql` | Same content for migration tooling |

## Regenerating SQL from JSON

If you update `data/*.json`, regenerate the SQL:

```bash
node scripts/generate-supabase-sql.mjs
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase URL and keys.

The app reads mutable state (itinerary, tasks, checklists, plan statuses, memories, mock today) from Supabase on load. If the database is empty or unreachable, it falls back to static JSON defaults and seeds Supabase on first load.
