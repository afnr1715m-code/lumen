-- ============================================
-- Lumen — Supabase schema
-- Run in Supabase → SQL Editor → New query → Run
-- ============================================

-- Project inquiries submitted from the "Start a Project" form.
create table if not exists project_inquiries (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    company text,
    email text not null,
    phone text not null,
    project_type text not null,
    budget text,
    timeline text,
    details text not null,
    status text not null default 'new' check (status in ('new', 'reviewing', 'proposal_sent', 'won', 'lost')),
    created_at timestamptz not null default now()
);

-- Consultation types Lumen offers — admin-editable, publicly readable
-- (needed so the site can show live price/duration without a redeploy).
create table if not exists consultation_types (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    description text,
    duration_minutes integer not null default 45,
    price_cents integer,          -- null until Lumen sets a real price
    currency text not null default 'SAR',
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

-- Individual bookable time slots per consultation type. Admin populates
-- availability; a slot disappears from the booking UI once referenced by
-- a non-cancelled booking (see the query in /api/bookings/availability).
create table if not exists availability_slots (
    id uuid primary key default gen_random_uuid(),
    consultation_type_id uuid not null references consultation_types(id) on delete cascade,
    starts_at timestamptz not null,
    created_at timestamptz not null default now(),
    unique (consultation_type_id, starts_at)
);

create table if not exists bookings (
    id uuid primary key default gen_random_uuid(),
    consultation_type_id uuid not null references consultation_types(id),
    slot_id uuid not null references availability_slots(id),
    customer_name text not null,
    customer_email text not null,
    customer_phone text not null,
    notes text,
    status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
    created_at timestamptz not null default now()
);

create index if not exists bookings_slot_id_idx on bookings(slot_id);

-- Payment record for a booking (also reusable later for project milestone
-- payments via a nullable project_inquiry_id, kept out of scope for now).
create table if not exists payments (
    id uuid primary key default gen_random_uuid(),
    booking_id uuid references bookings(id) on delete cascade,
    amount_cents integer not null,
    currency text not null default 'SAR',
    status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
    provider text,                 -- e.g. 'moyasar', 'paytabs' — null while unconfigured
    provider_reference text,       -- the gateway's own transaction/session id
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists payments_booking_id_idx on payments(booking_id);

-- ============================================
-- Milestone-based payments for larger projects (not consultations).
-- No admin UI yet — Lumen creates a proposal and its milestones directly
-- in the Supabase table editor after reviewing a project_inquiries row,
-- then shares the /proposal/{id} link with the client.
-- ============================================

create table if not exists project_proposals (
    id uuid primary key default gen_random_uuid(),
    inquiry_id uuid references project_inquiries(id) on delete set null,
    project_name text not null,
    client_name text not null,
    currency text not null default 'SAR',
    status text not null default 'sent' check (status in ('draft', 'sent', 'approved', 'completed')),
    created_at timestamptz not null default now()
);

create table if not exists project_milestones (
    id uuid primary key default gen_random_uuid(),
    proposal_id uuid not null references project_proposals(id) on delete cascade,
    name text not null,
    amount_cents integer not null,
    order_index integer not null default 0,
    status text not null default 'pending' check (status in ('pending', 'awaiting_confirmation', 'paid')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists project_milestones_proposal_id_idx on project_milestones(proposal_id);

-- Reuse the same `payments` table for milestone payments, alongside booking
-- payments — exactly one of booking_id / milestone_id must be set per row.
alter table payments add column if not exists milestone_id uuid references project_milestones(id) on delete cascade;

alter table payments drop constraint if exists payments_exactly_one_target;
alter table payments add constraint payments_exactly_one_target
    check ((booking_id is not null)::int + (milestone_id is not null)::int = 1);

create index if not exists payments_milestone_id_idx on payments(milestone_id);

-- ============================================
-- Row Level Security
-- ============================================

alter table project_inquiries enable row level security;
alter table consultation_types enable row level security;
alter table availability_slots enable row level security;
alter table bookings enable row level security;
alter table payments enable row level security;
alter table project_proposals enable row level security;
alter table project_milestones enable row level security;

-- Public site only ever talks to Supabase through server-side Route
-- Handlers using the service role key (which bypasses RLS), so no
-- anon-key policies are required for writes. Only the two read-only
-- lookups the public site needs directly are exposed to `anon`.

create policy "consultation_types_public_read" on consultation_types
    for select to anon using (is_active = true);

create policy "availability_slots_public_read" on availability_slots
    for select to anon using (true);

-- ============================================
-- Seed: consultation types from the brief (no invented prices — set
-- price_cents for real once Lumen decides pricing)
-- ============================================
insert into consultation_types (slug, title, duration_minutes, price_cents) values
    ('project-idea', 'Project Idea Consultation', 45, null),
    ('apps-websites', 'App & Website Consultation', 45, null),
    ('automation', 'Automation Consultation', 45, null),
    ('ai', 'AI Consultation', 45, null),
    ('systems-review', 'Existing Systems & Projects Review', 45, null),
    ('digital-transformation', 'Digital Transformation', 45, null)
on conflict (slug) do nothing;
