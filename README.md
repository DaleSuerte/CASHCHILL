# CashChill MVP 🧘‍♀️

> **Tagline:** tu plata, pero relax

Landing + waitlist funcional en Supabase + mini admin protegido por key + export CSV.

## 1) Requisitos previos

- Node.js 18+
- npm 9+
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Vercel](https://vercel.com)

## 2) Correr local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre `http://localhost:3000`.

## 3) Configurar Supabase (DB)

1. Crea un proyecto nuevo en Supabase.
2. Ve a **SQL Editor**.
3. Ejecuta completo el script `supabase/schema.sql`.
4. Copia estas variables desde **Project Settings > API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### SQL exacto (tabla + unique + policies + view)

```sql
-- CashChill waitlist schema
create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  stage text not null check (stage in ('uni', 'trabajo')),
  frequency text not null check (frequency in ('casi-nunca', 'semanal', 'varias-veces')),
  whatsapp text,
  source text not null default 'landing'
);

alter table public.waitlist enable row level security;

-- Avoid duplicates by email
create unique index if not exists waitlist_email_unique_idx on public.waitlist (lower(email));

-- Public can only insert into waitlist (for landing form)
drop policy if exists "waitlist_public_insert" on public.waitlist;
create policy "waitlist_public_insert"
on public.waitlist
for insert
to anon
with check (true);

-- No public read access (admin must use service role server-side)
drop policy if exists "waitlist_no_public_select" on public.waitlist;
create policy "waitlist_no_public_select"
on public.waitlist
for select
to anon
using (false);

-- Optional helper view for exports
create or replace view public.waitlist_export as
select
  id,
  created_at,
  name,
  email,
  stage,
  frequency,
  coalesce(whatsapp, '') as whatsapp,
  source
from public.waitlist
order by created_at desc;
```

## 4) Variables de entorno

`.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_KEY=your-admin-key
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

## 5) Admin mini

Ruta: `/admin?key=TU_ADMIN_KEY`

- Lista leads desde servidor (service role).
- Permite exportar CSV desde `/api/admin/export?key=...`.

## 6) Analytics

- Si defines `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, se carga script de Plausible automáticamente.
- Si no existe, los eventos se registran como `console.log` placeholder.

Eventos actuales:
- `cta_opened`
- `waitlist_submitted`
- `waitlist_error`

## 7) Despliegue en Vercel (paso a paso)

### Opción A: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Durante el setup:
- Framework: **Next.js**
- Build command: `next build` (default)
- Output: `.next` (default)

Luego agrega variables en Vercel (Project Settings > Environment Variables):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_KEY`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (opcional)

Deploy producción:

```bash
vercel --prod
```

### Opción B: Import desde GitHub

1. Sube este repo a GitHub.
2. En Vercel: **Add New Project** → selecciona el repo.
3. Configura env vars.
4. Deploy.

## 8) Checklist QA final (mobile-first)

- [ ] Hero y CTA visibles sin scroll excesivo en iPhone (390x844).
- [ ] Botón principal con tap area cómoda.
- [ ] Modal abre/cierra bien, no se rompe layout.
- [ ] Validación de email funciona.
- [ ] Email duplicado muestra mensaje amable.
- [ ] Insert real en Supabase confirmado.
- [ ] `/admin?key=...` bloquea sin key y muestra tabla con key correcta.
- [ ] Export CSV descarga correctamente.
- [ ] SEO tags (title, description, OpenGraph) presentes.
- [ ] Sin regaños en microcopy; tono relax ✅

## 9) Comandos útiles

```bash
npm run dev
npm run lint
npm run build
npm run start
```
