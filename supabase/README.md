# Supabase setup

## Quick start

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor**
3. Run these files in order:
   1. [`RUN_IN_SUPABASE_SCHEMA.sql`](./RUN_IN_SUPABASE_SCHEMA.sql)
   2. [`RUN_IN_SUPABASE_SEEDS.sql`](./RUN_IN_SUPABASE_SEEDS.sql)
   3. [`RUN_IN_SUPABASE_DATA.sql`](./RUN_IN_SUPABASE_DATA.sql)

This creates all tables/RLS policies first, then static seed data, then the trip data from the app's JSON files.

## Files

| File | Purpose |
|------|---------|
| `RUN_IN_SUPABASE_SCHEMA.sql` | DDL, enums, triggers, indexes, RLS policies |
| `RUN_IN_SUPABASE_SEEDS.sql` | Static-ish seed data: family, trip config, agreements, checklist definitions |
| `RUN_IN_SUPABASE_DATA.sql` | Dynamic trip data: days, itinerary, plans, night events, places, tasks, docs, flights, memories, alternatives, timeline |
| `RUN_IN_SUPABASE.sql` | Optional all-in-one file for local resets |
| `schema.sql` | Schema-only reference copy |
| `migrations/001_initial.sql` | All-in-one copy for migration tooling |

## Regenerating SQL from JSON

If you update `data/*.json`, regenerate the SQL:

```bash
node scripts/generate-supabase-sql.mjs
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase URL and keys.

The app reads mutable state (itinerary, tasks, checklists, plan statuses, memories, mock today) from Supabase on load. If the database is empty or unreachable, it falls back to static JSON defaults and seeds Supabase on first load.
