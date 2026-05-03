# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

---

## BAC Orientation App (`artifacts/bac-orientation`)

React + Vite + TailwindCSS app for Tunisian students to find university filières based on their BAC score.

### Platform Structure

```
/                    → Landing page (public, no auth required)
/login               → Sign In page
/signup              → Sign Up page
/app/*               → Protected routes (requires Supabase auth)
  /app/orientation   → Main orientation tool (CSV-based filière search)
  /app/calculator    → BAC moyenne calculator
  /app/quiz          → Profiling quiz (5 questions → domain recommendation)
  /app/guide         → Orientation guide (domains, programs, careers)
  /app/profile       → User profile (name, email, phone, region, section)
```

### Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Top-level routing (wouter), public vs protected split |
| `src/layouts/AppLayout.tsx` | Sidebar + mobile drawer for /app/* routes |
| `src/components/ProtectedRoute.tsx` | Auth guard — redirects to /login if not authenticated |
| `src/pages/Landing.tsx` | Public landing page (hero, features, how-it-works, CTA) |
| `src/pages/Home.tsx` | Orientation tool (used by /app/orientation) |
| `src/pages/app/Calculator.tsx` | Grade average calculator |
| `src/pages/app/Quiz.tsx` | 5-question profiling quiz |
| `src/pages/app/Guide.tsx` | Domain + program reference guide |
| `src/context/AuthContext.tsx` | Supabase session + profile state (global) |
| `src/lib/supabase.ts` | Supabase client (reads VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) |
| `src/utils/logic.ts` | Score, probability, trend, category logic |
| `src/utils/regions.ts` | Tunisian governorates list |
| `src/hooks/useCSVData.ts` | PapaParse CSV loader |

### Data

CSV: `attached_assets/Data_Last_Score_Bac_23_24_25_*.csv`  
Columns: `domaine, universite, etablissement, code_specialite, specialite, score_2023, score_2024, score_2025`

### Supabase Setup

Project: `https://nxhmidoeknnqqsjgltkd.supabase.co`  
Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

Required SQL (run once in Supabase SQL Editor):

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text, phone text, region text, section text, email text
);
alter table public.profiles enable row level security;
create policy "select_own" on public.profiles for select using (auth.uid() = id);
create policy "insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "update_own" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, phone, region, section)
  values (new.id, new.email,
    new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'region', new.raw_user_meta_data->>'section')
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```
