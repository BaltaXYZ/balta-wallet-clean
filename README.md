# balta-wallet-clean

Minimal Vercel + Neon (Postgres) API med enkel UI.

## Endpoints
- `GET /api/transactions` – lista transaktioner
- `POST /api/transactions` – skapa { date, person, card, category, amountCents, note? }
- `GET /api/db-check` – hälsa på DB
- UI: `/` (minimal HTML som pratar med API)

## Miljövariabler
- `DATABASE_URL` = postgres://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require

## Drift (Vercel)
- Framework Preset: **Other**
- Inga custom routes
- Production Protection: **Public** (om du vill dela UI)

## Återställning / rollback
1. Gå till **Releases** → välj tagen (ex. `v0.1.0`).
2. Klicka commit-hashen → **Revert** till branch `main` *eller* skapa ny release/tagg.
3. I Vercel → **Deployments** → välj den fungerande deployen → **Promote** för att peka prod till exakt den builden (ingen ny build behövs).

## Lokal utveckling (valfritt)
Detta repo har ingen build. Kör endast mot Vercel, eller lägg till egen dev-server vid behov.

## Databas
Kräver tabell:
```sql
create extension if not exists pgcrypto;
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  person text not null,
  card text not null,
  category text not null,
  amount_cents integer not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
