-- Viajamos — Miami + Islamorada Family Hub
-- Generated schema only

-- ---------------------------------------------------------------------------
-- Drop existing objects (reverse dependency order)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS checklist_item_states CASCADE;
DROP TABLE IF EXISTS memories CASCADE;
DROP TABLE IF EXISTS trip_tasks CASCADE;
DROP TABLE IF EXISTS itinerary_events CASCADE;
DROP TABLE IF EXISTS day_alternative_plans CASCADE;
DROP TABLE IF EXISTS possible_plans CASCADE;
DROP TABLE IF EXISTS night_events CASCADE;
DROP TABLE IF EXISTS flights CASCADE;
DROP TABLE IF EXISTS travel_timeline_items CASCADE;
DROP TABLE IF EXISTS travel_documents CASCADE;
DROP TABLE IF EXISTS essential_places CASCADE;
DROP TABLE IF EXISTS agreements CASCADE;
DROP TABLE IF EXISTS checklists CASCADE;
DROP TABLE IF EXISTS trip_days CASCADE;
DROP TABLE IF EXISTS trip_config CASCADE;
DROP TABLE IF EXISTS family_members CASCADE;

DROP TYPE IF EXISTS flight_status CASCADE;
DROP TYPE IF EXISTS night_event_type CASCADE;
DROP TYPE IF EXISTS checklist_type CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS task_priority CASCADE;
DROP TYPE IF EXISTS document_type CASCADE;
DROP TYPE IF EXISTS essential_place_type CASCADE;
DROP TYPE IF EXISTS alternative_trigger CASCADE;
DROP TYPE IF EXISTS possible_plan_status CASCADE;
DROP TYPE IF EXISTS plan_source CASCADE;
DROP TYPE IF EXISTS best_for CASCADE;
DROP TYPE IF EXISTS intensity CASCADE;
DROP TYPE IF EXISTS possible_plan_category CASCADE;
DROP TYPE IF EXISTS event_status CASCADE;
DROP TYPE IF EXISTS event_category CASCADE;
DROP TYPE IF EXISTS event_period CASCADE;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
CREATE TYPE event_period AS ENUM ('morning', 'afternoon', 'night', 'late_night');
CREATE TYPE event_category AS ENUM ('food', 'music', 'museum', 'shopping', 'walk', 'travel', 'rest', 'experience', 'event');
CREATE TYPE event_status AS ENUM ('idea', 'planned', 'reserved', 'booked', 'done', 'cancelled');
CREATE TYPE possible_plan_category AS ENUM (
  'restaurant', 'cafe', 'jazz', 'electronic_music', 'museum', 'gallery',
  'shopping', 'walk', 'bar', 'experience', 'rainy_day', 'nearby', 'late_night'
);
CREATE TYPE intensity AS ENUM ('light', 'moderate', 'intense');
CREATE TYPE best_for AS ENUM ('family', 'caio', 'geovanin', 'adelaide', 'sofia', 'caio_sofia', 'adults', 'everyone');
CREATE TYPE plan_source AS ENUM ('manual', 'ai_generated', 'user_added');
CREATE TYPE possible_plan_status AS ENUM ('candidate', 'shortlisted', 'added_to_itinerary', 'discarded');
CREATE TYPE alternative_trigger AS ENUM ('rain', 'tired', 'late_start', 'too_hot', 'reservation_failed', 'extra_energy');
CREATE TYPE essential_place_type AS ENUM (
  'lodging', 'airport', 'pharmacy', 'market', 'hospital', 'shopping',
  'consulate', 'meeting_point', 'parking'
);
CREATE TYPE document_type AS ENUM ('flight', 'lodging', 'ticket', 'reservation', 'insurance', 'car_rental', 'other');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_status AS ENUM ('open', 'done');
CREATE TYPE checklist_type AS ENUM ('before_trip', 'travel_day', 'daily', 'return');
CREATE TYPE night_event_type AS ENUM ('jazz', 'electronic', 'bar', 'late_food');
CREATE TYPE flight_status AS ENUM ('confirmed', 'pending', 'delayed', 'boarding');

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
CREATE TABLE family_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE trip_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  destination TEXT NOT NULL,
  base_address TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  mock_today DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE trip_days (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  area TEXT,
  base_name TEXT,
  base_address TEXT,
  weather TEXT,
  is_travel_day BOOLEAN NOT NULL DEFAULT FALSE,
  is_return_day BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trip_days_date ON trip_days(date);

CREATE TABLE itinerary_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  period event_period NOT NULL,
  location_name TEXT,
  address TEXT,
  neighborhood TEXT,
  category event_category NOT NULL,
  people TEXT[] NOT NULL DEFAULT '{}',
  status event_status NOT NULL DEFAULT 'planned',
  group_id TEXT,
  group_label TEXT,
  google_maps_url TEXT,
  apple_maps_url TEXT,
  website_url TEXT,
  ticket_url TEXT,
  reservation_url TEXT,
  uber_url TEXT,
  notes TEXT,
  leave_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_itinerary_events_date ON itinerary_events(date);

CREATE TABLE possible_plans (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  why_go TEXT,
  category possible_plan_category NOT NULL,
  periods event_period[] NOT NULL DEFAULT '{}',
  neighborhood TEXT,
  address TEXT,
  estimated_duration_minutes INTEGER,
  price_level SMALLINT CHECK (price_level BETWEEN 1 AND 4),
  intensity intensity NOT NULL,
  best_for best_for[] NOT NULL DEFAULT '{}',
  google_maps_url TEXT,
  apple_maps_url TEXT,
  website_url TEXT,
  ticket_url TEXT,
  reservation_url TEXT,
  instagram_url TEXT,
  uber_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  status possible_plan_status NOT NULL DEFAULT 'candidate',
  source plan_source DEFAULT 'manual',
  notes TEXT,
  is_nearby BOOLEAN NOT NULL DEFAULT FALSE,
  cuisine TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE day_alternative_plans (
  id TEXT PRIMARY KEY,
  day_id TEXT NOT NULL REFERENCES trip_days(id) ON DELETE CASCADE,
  trigger alternative_trigger NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  plan_item_ids TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_day_alternatives_day_id ON day_alternative_plans(day_id);

CREATE TABLE essential_places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type essential_place_type NOT NULL,
  address TEXT NOT NULL,
  area TEXT,
  base_name TEXT,
  notes TEXT,
  google_maps_url TEXT,
  apple_maps_url TEXT,
  uber_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE travel_documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type document_type NOT NULL,
  url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE trip_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  due_date DATE,
  related_plan_id TEXT,
  assigned_to TEXT REFERENCES family_members(id),
  status task_status NOT NULL DEFAULT 'open',
  priority task_priority NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE checklists (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type checklist_type NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE checklist_item_states (
  item_id TEXT PRIMARY KEY,
  checked BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE night_events (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  type night_event_type NOT NULL,
  title TEXT NOT NULL,
  venue TEXT NOT NULL,
  neighborhood TEXT,
  start_time TEXT NOT NULL,
  end_time TEXT,
  price_info TEXT,
  dress_code TEXT,
  intensity intensity NOT NULL,
  buy_ahead BOOLEAN NOT NULL DEFAULT FALSE,
  google_maps_url TEXT,
  apple_maps_url TEXT,
  website_url TEXT,
  ticket_url TEXT,
  uber_url TEXT,
  status possible_plan_status NOT NULL DEFAULT 'candidate',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_night_events_date ON night_events(date);

CREATE TABLE flights (
  id TEXT PRIMARY KEY,
  passenger_id TEXT NOT NULL REFERENCES family_members(id),
  passenger_name TEXT NOT NULL,
  route TEXT NOT NULL,
  "from" TEXT NOT NULL,
  "to" TEXT NOT NULL,
  flight_number TEXT NOT NULL,
  seat TEXT,
  terminal TEXT,
  gate TEXT,
  boarding_time TEXT,
  departure_time TEXT NOT NULL,
  arrival_time TEXT,
  date DATE NOT NULL,
  status flight_status NOT NULL DEFAULT 'pending',
  confirmation_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_flights_date ON flights(date);

CREATE TABLE memories (
  id TEXT PRIMARY KEY,
  day_id TEXT NOT NULL REFERENCES trip_days(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  best_moment TEXT,
  best_food TEXT,
  favorite_place TEXT,
  rating SMALLINT CHECK (rating BETWEEN 0 AND 5),
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_memories_day_id ON memories(day_id);

CREATE TABLE agreements (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE travel_timeline_items (
  id TEXT PRIMARY KEY,
  time TEXT NOT NULL,
  label TEXT NOT NULL,
  date DATE NOT NULL,
  is_departure BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_travel_timeline_date ON travel_timeline_items(date);

-- updated_at triggers
CREATE TRIGGER family_members_updated_at BEFORE UPDATE ON family_members FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trip_config_updated_at BEFORE UPDATE ON trip_config FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trip_days_updated_at BEFORE UPDATE ON trip_days FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER itinerary_events_updated_at BEFORE UPDATE ON itinerary_events FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER possible_plans_updated_at BEFORE UPDATE ON possible_plans FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER day_alternative_plans_updated_at BEFORE UPDATE ON day_alternative_plans FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER essential_places_updated_at BEFORE UPDATE ON essential_places FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER travel_documents_updated_at BEFORE UPDATE ON travel_documents FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trip_tasks_updated_at BEFORE UPDATE ON trip_tasks FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER checklists_updated_at BEFORE UPDATE ON checklists FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER checklist_item_states_updated_at BEFORE UPDATE ON checklist_item_states FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER night_events_updated_at BEFORE UPDATE ON night_events FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER flights_updated_at BEFORE UPDATE ON flights FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER memories_updated_at BEFORE UPDATE ON memories FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER agreements_updated_at BEFORE UPDATE ON agreements FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER travel_timeline_items_updated_at BEFORE UPDATE ON travel_timeline_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS — permissive public access (personal app, no auth)
-- ---------------------------------------------------------------------------
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE possible_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_alternative_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE essential_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_item_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE night_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_timeline_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_all" ON family_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON trip_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON trip_days FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON itinerary_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON possible_plans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON day_alternative_plans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON essential_places FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON travel_documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON trip_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON checklists FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON checklist_item_states FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON night_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON flights FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON memories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON agreements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON travel_timeline_items FOR ALL USING (true) WITH CHECK (true);

