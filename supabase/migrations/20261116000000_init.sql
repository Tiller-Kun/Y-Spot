-- Y-Spot initial schema. Mirrors src/types/spot.ts; keep the two in sync.

create table public.buildings (
  id         text primary key,
  name       text not null,
  name_ko    text not null default '',
  -- Position on the schematic map, 0–1 from the top-left corner.
  map_x      real not null check (map_x between 0 and 1),
  map_y      real not null check (map_y between 0 and 1)
);

create table public.spots (
  id             text primary key,
  building_id    text not null references public.buildings (id),
  name           text not null,
  name_ko        text not null default '',
  category       text not null check (category in ('library', 'lounge', 'outdoor', 'cafe', 'classroom')),
  floor          text not null default '',
  entrance_hint  text not null default '',
  directions     text not null default '',
  noise          text not null check (noise in ('silent', 'quiet', 'moderate', 'lively')),
  intents        text[] not null default '{}',
  group_min      int not null default 1,
  group_max      int not null default 1,
  -- { "weekdays": { "open": "09:00", "close": "22:00" } | null, "weekends": ... }
  hours          jsonb not null,
  -- { "outlets": bool, "restroom": bool, "food": bool, "discussionRooms": bool, "wifi": bool }
  amenities      jsonb not null,
  access         text not null check (access in ('open', 'student_id', 'reservation')),
  bookable       boolean not null default false,
  departments    text[] not null default '{}',
  walk_minutes   int not null default 0,
  tip            text,
  photo_url      text,
  -- Simulated typical occupancy per hour (24 values, 0–1). Not live data.
  busy_by_hour   real[] not null check (array_length(busy_by_hour, 1) = 24),
  verified       boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- "Share a spot" suggestions from students, reviewed by the team.
create table public.spot_suggestions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 200),
  details     text not null default '' check (char_length(details) <= 2000),
  status      text not null default 'new' check (status in ('new', 'accepted', 'rejected')),
  created_at  timestamptz not null default now()
);

-- Student-shared photos showing roughly how busy a spot is. Faces must be
-- blurred before a photo is approved; only approved photos are public.
create table public.spot_photos (
  id            uuid primary key default gen_random_uuid(),
  spot_id       text not null references public.spots (id) on delete cascade,
  storage_path  text not null,
  status        text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  taken_at      timestamptz,
  created_at    timestamptz not null default now()
);

-- Row level security: the app uses the public anon key, so lock everything
-- down and open only what students need.
alter table public.buildings enable row level security;
alter table public.spots enable row level security;
alter table public.spot_suggestions enable row level security;
alter table public.spot_photos enable row level security;

create policy "Anyone can read buildings" on public.buildings for select using (true);
create policy "Anyone can read spots" on public.spots for select using (true);
create policy "Anyone can suggest a spot" on public.spot_suggestions for insert with check (status = 'new');
create policy "Anyone can read approved photos" on public.spot_photos for select using (status = 'approved');
