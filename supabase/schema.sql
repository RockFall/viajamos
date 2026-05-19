-- Viajamos — Miami Family Hub
-- Generated schema + seed data

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
CREATE TYPE event_category AS ENUM ('food', 'music', 'museum', 'shopping', 'walk', 'travel', 'rest', 'event');
CREATE TYPE event_status AS ENUM ('idea', 'planned', 'reserved', 'booked', 'done', 'cancelled');
CREATE TYPE possible_plan_category AS ENUM (
  'restaurant', 'cafe', 'jazz', 'electronic_music', 'museum', 'gallery',
  'shopping', 'walk', 'bar', 'experience', 'rainy_day', 'nearby', 'late_night'
);
CREATE TYPE intensity AS ENUM ('light', 'moderate', 'intense');
CREATE TYPE best_for AS ENUM ('family', 'parents', 'caio', 'sister', 'caio_sister', 'everyone');
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

-- ---------------------------------------------------------------------------
-- Seed data
-- ---------------------------------------------------------------------------
-- family_members
INSERT INTO family_members (id, name, short_name, color) VALUES ('caio', 'Caio Rocha', 'Caio', '#FF6B6B');
INSERT INTO family_members (id, name, short_name, color) VALUES ('father', 'Pai', 'Pai', '#4ECDC4');
INSERT INTO family_members (id, name, short_name, color) VALUES ('mother', 'Mãe', 'Mãe', '#FFE66D');
INSERT INTO family_members (id, name, short_name, color) VALUES ('sister', 'Irmã', 'Irmã', '#A78BFA');

-- trip_config
INSERT INTO trip_config (id, destination, base_address, start_date, end_date, mock_today) VALUES ('default', 'Miami', '3024 Aviation Avenue, Miami, FL 33133', '2026-05-23', '2026-05-27', '2026-05-24');

-- trip_days
INSERT INTO trip_days (id, date, title, theme, weather, is_travel_day, is_return_day) VALUES ('day-23', '2026-05-23', 'Dia de chegada', 'Viagem GRU → MIA e chegada em Miami', '28°C · Parcialmente nublado', TRUE, FALSE);
INSERT INTO trip_days (id, date, title, theme, weather, is_travel_day, is_return_day) VALUES ('day-24', '2026-05-24', 'Primeiro dia em Miami', 'Coconut Grove, descanso e jazz', '29°C · Ensolarado', FALSE, FALSE);
INSERT INTO trip_days (id, date, title, theme, weather, is_travel_day, is_return_day) VALUES ('day-25', '2026-05-25', 'Arte, design e música', 'Design District, ICA Miami e jazz', '30°C · Ensolarado', FALSE, FALSE);
INSERT INTO trip_days (id, date, title, theme, weather, is_travel_day, is_return_day) VALUES ('day-26', '2026-05-26', 'Noite dividida', 'Compras, jantar em família e festa', '31°C · Quente', FALSE, FALSE);
INSERT INTO trip_days (id, date, title, theme, weather, is_travel_day, is_return_day) VALUES ('day-27', '2026-05-27', 'Último dia e volta', 'Compras finais e retorno MIA → GRU', '28°C · Parcialmente nublado', TRUE, TRUE);

-- itinerary_events
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-arrival', 'Chegada em Miami', 'Desembarque e Uber até a casa', '2026-05-23', '22:30', NULL, 'night', 'Miami International Airport', '2100 NW 42nd Ave, Miami, FL 33142', NULL, 'travel', ARRAY['caio', 'father', 'mother', 'sister']::TEXT[], 'booked', NULL, NULL, 'https://maps.google.com/?q=Miami+International+Airport', NULL, NULL, NULL, NULL, 'https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=3024+Aviation+Avenue+Miami', NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-24-brunch', 'Brunch no GreenStreet', 'Café da manhã tardio em Coconut Grove', '2026-05-24', '10:30', '12:00', 'morning', 'GreenStreet Cafe', '3468 Main Hwy, Coconut Grove, FL 33133', 'Coconut Grove', 'food', ARRAY['caio', 'father', 'mother', 'sister']::TEXT[], 'reserved', NULL, NULL, 'https://maps.google.com/?q=GreenStreet+Cafe+Coconut+Grove', NULL, NULL, NULL, 'https://www.greenstreetcafe.com', NULL, NULL, '10:00');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-24-walk', 'Caminhada no Coconut Grove', 'Passeio leve pela orla e lojas', '2026-05-24', '12:30', NULL, 'afternoon', 'Coconut Grove Waterfront', NULL, 'Coconut Grove', 'walk', ARRAY['caio', 'father', 'mother', 'sister']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Coconut+Grove+Waterfront', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-24-jazz', 'Show de jazz no Ball & Chain', 'Jazz ao vivo em Little Havana', '2026-05-24', '21:00', NULL, 'night', 'Ball & Chain', '1513 SW 8th St, Miami, FL 33135', 'Little Havana', 'music', ARRAY['caio', 'father', 'mother', 'sister']::TEXT[], 'booked', NULL, NULL, 'https://maps.google.com/?q=Ball+and+Chain+Little+Havana', NULL, 'https://www.ballandchainmiami.com', 'https://www.ballandchainmiami.com', NULL, NULL, NULL, '19:30');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-25-design', 'Design District', 'Galerias, lojas de design e arte de rua', '2026-05-25', '11:00', '14:00', 'morning', 'Miami Design District', '3841 NE 2nd Ave, Miami, FL 33137', 'Design District', 'shopping', ARRAY['caio', 'father', 'mother', 'sister']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Miami+Design+District', NULL, NULL, NULL, NULL, NULL, NULL, '10:30');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-25-ica', 'ICA Miami', 'Instituto de arte contemporânea', '2026-05-25', '15:00', '17:30', 'afternoon', 'ICA Miami', '61 NE 41st St, Miami, FL 33137', 'Design District', 'museum', ARRAY['caio', 'father', 'mother', 'sister']::TEXT[], 'reserved', NULL, NULL, 'https://maps.google.com/?q=ICA+Miami', NULL, 'https://icamiami.org', 'https://icamiami.org/visit', NULL, NULL, NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-25-dinner', 'Jantar no Mandolin Aegean Bistro', 'Grego mediterrâneo no Design District', '2026-05-25', '20:00', NULL, 'night', 'Mandolin Aegean Bistro', '4312 NE 2nd Ave, Miami, FL 33137', 'Design District', 'food', ARRAY['caio', 'father', 'mother', 'sister']::TEXT[], 'reserved', NULL, NULL, 'https://maps.google.com/?q=Mandolin+Aegean+Bistro', NULL, NULL, NULL, 'https://www.mandolinmiami.com', NULL, NULL, '19:10');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-25-jazz-caio', 'Jazz no Lagniappe', 'Wine garden com jazz ao vivo', '2026-05-25', '21:30', NULL, 'night', 'Lagniappe', '3420 NE 2nd Ave, Miami, FL 33137', 'Midtown', 'music', ARRAY['caio']::TEXT[], 'planned', 'grp-25-night', 'Caio — jazz solo', 'https://maps.google.com/?q=Lagniappe+Miami', NULL, NULL, NULL, NULL, NULL, NULL, '20:45');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-25-rest-parents', 'Descanso em casa', 'Pais voltam cedo para descansar', '2026-05-25', '21:00', NULL, 'night', '3024 Aviation Avenue', '3024 Aviation Avenue, Miami, FL 33133', NULL, 'rest', ARRAY['father', 'mother']::TEXT[], 'planned', 'grp-25-night', 'Pais — descanso', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-26-shopping-sister', 'Compras no Aventura Mall', 'Caio e irmã no shopping', '2026-05-26', '14:00', '18:00', 'afternoon', 'Aventura Mall', '19501 Biscayne Blvd, Aventura, FL 33180', 'Aventura', 'shopping', ARRAY['caio', 'sister']::TEXT[], 'planned', 'grp-26-afternoon', 'Caio + Irmã', 'https://maps.google.com/?q=Aventura+Mall', NULL, NULL, NULL, NULL, NULL, NULL, '13:30');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-26-parents-grove', 'Café e leitura no Grove', 'Pais relaxam perto de casa', '2026-05-26', '15:00', NULL, 'afternoon', 'Panther Coffee', '3400 Pan American Dr, Miami, FL 33133', 'Coconut Grove', 'food', ARRAY['father', 'mother']::TEXT[], 'planned', 'grp-26-afternoon', 'Pais — café', 'https://maps.google.com/?q=Panther+Coffee+Coconut+Grove', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-26-family-dinner', 'Jantar em família no Jaguar', 'Cena latina no Coconut Grove', '2026-05-26', '20:00', NULL, 'night', 'Jaguar Ceviche Spoon', '3067 Grand Ave, Coconut Grove, FL 33133', 'Coconut Grove', 'food', ARRAY['caio', 'father', 'mother', 'sister']::TEXT[], 'reserved', NULL, NULL, 'https://maps.google.com/?q=Jaguar+Ceviche+Coconut+Grove', NULL, NULL, NULL, 'https://www.jaguarmiami.com', NULL, NULL, '19:30');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-26-club', 'Festa eletrônica no Club Space', 'Techno/house até de manhã', '2026-05-26', '23:30', NULL, 'late_night', 'Club Space', '34 NE 11th St, Miami, FL 33132', 'Downtown', 'music', ARRAY['caio', 'sister']::TEXT[], 'booked', 'grp-26-late', 'Caio + Irmã — festa', 'https://maps.google.com/?q=Club+Space+Miami', NULL, 'https://www.clubspace.com', 'https://www.clubspace.com', NULL, NULL, NULL, '22:45');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-26-parents-home', 'Volta para casa', 'Pais descansam em casa', '2026-05-26', '22:00', NULL, 'night', '3024 Aviation Avenue', '3024 Aviation Avenue, Miami, FL 33133', NULL, 'rest', ARRAY['father', 'mother']::TEXT[], 'planned', 'grp-26-late', 'Pais — casa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-27-shopping', 'Últimas compras no Lincoln Road', 'Souvenirs e últimas compras antes do voo', '2026-05-27', '09:00', '11:30', 'morning', 'Lincoln Road Mall', 'Lincoln Rd, Miami Beach, FL 33139', 'South Beach', 'shopping', ARRAY['caio', 'father', 'mother', 'sister']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Lincoln+Road+Mall', NULL, NULL, NULL, NULL, NULL, NULL, '08:30');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-27-departure', 'Partida MIA → GRU', 'Check-in e embarque de volta', '2026-05-27', '18:00', NULL, 'afternoon', 'Miami International Airport', '2100 NW 42nd Ave, Miami, FL 33142', NULL, 'travel', ARRAY['caio', 'father', 'mother', 'sister']::TEXT[], 'booked', NULL, NULL, 'https://maps.google.com/?q=Miami+International+Airport', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- possible_plans
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-1', 'Mandolin Aegean Bistro', 'Grego mediterrâneo', 'Restaurante grego charmoso no pátio, perfeito para jantar em família.', 'Ambiente lindo, comida excelente e reservas fáceis.', 'restaurant', ARRAY['night']::event_period[], 'Design District', '4312 NE 2nd Ave, Miami, FL 33137', 120, 3, 'moderate', ARRAY['family', 'parents']::best_for[], 'https://maps.google.com/?q=Mandolin+Aegean+Bistro', NULL, 'https://www.mandolinmiami.com', NULL, 'https://www.mandolinmiami.com', NULL, NULL, ARRAY['jantar', 'reserva', 'grego']::TEXT[], 'added_to_itinerary', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-2', 'Ball & Chain', 'Jazz em Little Havana', 'Bar histórico com jazz ao vivo, salsa e ambiente cubano autêntico.', 'Experiência icônica de Miami, música ao vivo toda noite.', 'jazz', ARRAY['night']::event_period[], 'Little Havana', '1513 SW 8th St, Miami, FL 33135', 180, 2, 'moderate', ARRAY['family', 'everyone']::best_for[], 'https://maps.google.com/?q=Ball+and+Chain', NULL, 'https://www.ballandchainmiami.com', 'https://www.ballandchainmiami.com', NULL, NULL, NULL, ARRAY['jazz', 'live music', 'cubano']::TEXT[], 'added_to_itinerary', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-3', 'Club Space', 'Techno até o amanhecer', 'Um dos clubes de eletrônica mais famosos do mundo.', 'Line-up internacional, experiência única de Miami nightlife.', 'electronic_music', ARRAY['late_night']::event_period[], 'Downtown', '34 NE 11th St, Miami, FL 33132', 300, 3, 'intense', ARRAY['caio', 'caio_sister']::best_for[], 'https://maps.google.com/?q=Club+Space+Miami', NULL, NULL, 'https://www.clubspace.com', NULL, NULL, NULL, ARRAY['techno', 'festa', 'madrugada']::TEXT[], 'added_to_itinerary', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-4', 'ICA Miami', 'Arte contemporânea', 'Museu gratuito com exposições de arte contemporânea de classe mundial.', 'Entrada gratuita, arquitetura incrível, perto do Design District.', 'museum', ARRAY['morning', 'afternoon']::event_period[], 'Design District', '61 NE 41st St, Miami, FL 33137', 120, 1, 'light', ARRAY['family', 'everyone']::best_for[], 'https://maps.google.com/?q=ICA+Miami', NULL, 'https://icamiami.org', NULL, NULL, NULL, NULL, ARRAY['arte', 'museu', 'gratuito']::TEXT[], 'added_to_itinerary', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-5', 'Pérez Art Museum (PAMM)', 'Museu à beira da baía', 'Museu de arte moderna com vista para Biscayne Bay.', 'Perfeito para dia de chuva, jardim lindo e café bom.', 'museum', ARRAY['morning', 'afternoon']::event_period[], 'Downtown', '1103 Biscayne Blvd, Miami, FL 33132', 150, 2, 'light', ARRAY['family', 'parents']::best_for[], 'https://maps.google.com/?q=Perez+Art+Museum+Miami', NULL, NULL, 'https://www.pamm.org/en/visit', NULL, NULL, NULL, ARRAY['museu', 'chuva', 'arte']::TEXT[], 'shortlisted', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-6', 'Wynwood Walls', 'Arte de rua ao ar livre', 'Mural de arte urbana ao ar livre, cafés e galerias.', 'Fotos incríveis, vibe jovem, perto de bares.', 'gallery', ARRAY['morning', 'afternoon', 'night']::event_period[], 'Wynwood', '2520 NW 2nd Ave, Miami, FL 33127', 90, 1, 'moderate', ARRAY['caio', 'caio_sister', 'family']::best_for[], 'https://maps.google.com/?q=Wynwood+Walls', NULL, 'https://thewynwoodwalls.com', NULL, NULL, NULL, NULL, ARRAY['arte', 'fotos', 'graffiti']::TEXT[], 'candidate', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-7', 'GreenStreet Cafe', 'Brunch clássico do Grove', 'Brunch favorito dos moradores de Coconut Grove.', 'Perto de casa, fila vale a pena, ambiente ao ar livre.', 'cafe', ARRAY['morning']::event_period[], 'Coconut Grove', '3468 Main Hwy, Coconut Grove, FL 33133', 90, 2, 'light', ARRAY['family']::best_for[], 'https://maps.google.com/?q=GreenStreet+Cafe', NULL, NULL, NULL, NULL, NULL, NULL, ARRAY['brunch', 'perto de casa']::TEXT[], 'added_to_itinerary', NULL, NULL, TRUE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-8', 'Panther Coffee', 'Café especial de origem', 'Torrefação artesanal, um dos melhores cafés de Miami.', 'Café excelente, 5 min de carro da casa.', 'cafe', ARRAY['morning', 'afternoon']::event_period[], 'Coconut Grove', '3400 Pan American Dr, Miami, FL 33133', 45, 2, 'light', ARRAY['parents', 'caio']::best_for[], 'https://maps.google.com/?q=Panther+Coffee+Coconut+Grove', NULL, NULL, NULL, NULL, NULL, NULL, ARRAY['café', 'perto de casa']::TEXT[], 'candidate', NULL, NULL, TRUE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-9', 'Lagniappe', 'Wine garden com jazz', 'Pátio com vinhos, queijos e jazz ao vivo nas quintas.', 'Ambiente descontraído, sem reserva, jazz intimista.', 'jazz', ARRAY['night']::event_period[], 'Midtown', '3420 NE 2nd Ave, Miami, FL 33137', 150, 2, 'moderate', ARRAY['caio', 'caio_sister']::best_for[], 'https://maps.google.com/?q=Lagniappe+Miami', NULL, NULL, NULL, NULL, NULL, NULL, ARRAY['jazz', 'vinho', 'pátio']::TEXT[], 'shortlisted', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-10', 'Basement Miami', 'Bowling + karaoke + bar', 'Bar subterrâneo com boliche, karaokê e pista de dança.', 'Experiência diferente, bom para grupo.', 'bar', ARRAY['night', 'late_night']::event_period[], 'Brickell', '1227 Brickell Ave, Miami, FL 33131', 180, 3, 'moderate', ARRAY['caio_sister', 'family']::best_for[], 'https://maps.google.com/?q=Basement+Miami', NULL, NULL, NULL, NULL, NULL, NULL, ARRAY['bar', 'diversão', 'grupo']::TEXT[], 'candidate', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-11', 'Aventura Mall', 'Shopping premium', 'Um dos maiores shoppings de Miami com marcas internacionais.', 'Ar-condicionado, muitas opções, bom para dia quente.', 'shopping', ARRAY['morning', 'afternoon']::event_period[], 'Aventura', '19501 Biscayne Blvd, Aventura, FL 33180', 240, 3, 'moderate', ARRAY['caio_sister', 'family']::best_for[], 'https://maps.google.com/?q=Aventura+Mall', NULL, 'https://aventuramall.com', NULL, NULL, NULL, NULL, ARRAY['compras', 'shopping']::TEXT[], 'shortlisted', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-12', 'Lincoln Road Mall', 'Compras em South Beach', 'Rua de pedestres com lojas, restaurantes e galerias.', 'Ótimo para último dia, perto da praia.', 'shopping', ARRAY['morning', 'afternoon']::event_period[], 'South Beach', 'Lincoln Rd, Miami Beach, FL 33139', 180, 2, 'moderate', ARRAY['family']::best_for[], 'https://maps.google.com/?q=Lincoln+Road+Mall', NULL, NULL, NULL, NULL, NULL, NULL, ARRAY['compras', 'south beach']::TEXT[], 'candidate', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-13', 'Key Biscayne Beach', 'Praia tranquila', 'Praia calma com água cristalina, ideal para relaxar.', 'Menos movimentada que South Beach, ótima para família.', 'walk', ARRAY['morning', 'afternoon']::event_period[], 'Key Biscayne', '6747 Crandon Blvd, Key Biscayne, FL 33149', 180, 1, 'light', ARRAY['family', 'parents']::best_for[], 'https://maps.google.com/?q=Crandon+Park+Beach', NULL, NULL, NULL, NULL, NULL, NULL, ARRAY['praia', 'natureza', 'relaxar']::TEXT[], 'candidate', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-14', 'Joe''s Stone Crab', 'Caranguejo icônico', 'Restaurante histórico de South Beach, famoso pelos caranguejos.', 'Experiência clássica de Miami, imperdível se estiver aberto.', 'restaurant', ARRAY['night']::event_period[], 'South Beach', '11 Washington Ave, Miami Beach, FL 33139', 120, 4, 'moderate', ARRAY['family', 'parents']::best_for[], 'https://maps.google.com/?q=Joes+Stone+Crab', NULL, NULL, NULL, 'https://www.joesstonecrab.com', NULL, NULL, ARRAY['frutos do mar', 'icônico']::TEXT[], 'candidate', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-15', 'Versailles Restaurant', 'Cafeteria cubana', 'Instituição cubana de Little Havana, café e pastelitos.', 'Cultura cubana autêntica, preço justo, aberto 24h.', 'restaurant', ARRAY['morning', 'afternoon', 'night']::event_period[], 'Little Havana', '3555 SW 8th St, Miami, FL 33135', 60, 1, 'light', ARRAY['family', 'everyone']::best_for[], 'https://maps.google.com/?q=Versailles+Restaurant+Miami', NULL, NULL, NULL, NULL, NULL, NULL, ARRAY['cubano', 'café', 'barato']::TEXT[], 'candidate', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-16', 'Fritz & Franz', 'Cervejaria alemã no Grove', 'Cervejaria ao ar livre com comida alemã e ambiente descontraído.', 'Perto de casa, bom para almoço ou happy hour.', 'restaurant', ARRAY['afternoon', 'night']::event_period[], 'Coconut Grove', '60 Merrick Way, Coral Gables, FL 33134', 90, 2, 'light', ARRAY['family', 'parents']::best_for[], 'https://maps.google.com/?q=Fritz+Franz+Coral+Gables', NULL, NULL, NULL, NULL, NULL, NULL, ARRAY['cerveja', 'perto de casa']::TEXT[], 'candidate', NULL, NULL, TRUE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-17', 'Bayside Marketplace', 'Shopping à beira-mar', 'Centro comercial com lojas, restaurantes e passeios de barco.', 'Plano B para chuva, vista para a baía.', 'rainy_day', ARRAY['morning', 'afternoon']::event_period[], 'Downtown', '401 Biscayne Blvd, Miami, FL 33132', 120, 2, 'light', ARRAY['family']::best_for[], 'https://maps.google.com/?q=Bayside+Marketplace', NULL, NULL, NULL, NULL, NULL, NULL, ARRAY['chuva', 'indoor', 'shopping']::TEXT[], 'candidate', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-18', 'Komodo', 'Fine dining asiático', 'Restaurante sofisticado com culinária asiática fusion.', 'Ambiente premium, ideal para ocasião especial.', 'restaurant', ARRAY['night']::event_period[], 'Brickell', '801 Brickell Ave, Miami, FL 33131', 120, 4, 'moderate', ARRAY['family', 'parents']::best_for[], 'https://maps.google.com/?q=Komodo+Miami', NULL, NULL, NULL, 'https://komodomiami.com', NULL, NULL, ARRAY['fine dining', 'asiático']::TEXT[], 'candidate', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-19', 'E11EVEN', 'Club 24h', 'Club noturno 24 horas com performances e DJs internacionais.', 'Alternativa ao Club Space, experiência única.', 'electronic_music', ARRAY['late_night']::event_period[], 'Downtown', '29 NE 11th St, Miami, FL 33132', 240, 4, 'intense', ARRAY['caio', 'caio_sister']::best_for[], 'https://maps.google.com/?q=E11EVEN+Miami', NULL, NULL, 'https://11miami.com', NULL, NULL, NULL, ARRAY['festa', '24h', 'eletrônica']::TEXT[], 'candidate', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-20', 'Books & Books', 'Livraria com café', 'Livraria independente com café e eventos culturais.', 'Ambiente calmo, perto do Grove, ótimo para chuva.', 'cafe', ARRAY['morning', 'afternoon']::event_period[], 'Coconut Grove', '265 Aragon Ave, Coral Gables, FL 33134', 60, 1, 'light', ARRAY['parents', 'family']::best_for[], 'https://maps.google.com/?q=Books+and+Books+Coral+Gables', NULL, NULL, NULL, NULL, NULL, NULL, ARRAY['livros', 'chuva', 'calmo']::TEXT[], 'candidate', NULL, NULL, TRUE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-21', 'Coyo Taco', 'Tacos + bar secreto', 'Tacos autênticos com bar escondido atrás (Wynwood).', 'Comida boa e bar secreto para depois.', 'restaurant', ARRAY['night', 'late_night']::event_period[], 'Wynwood', '2320 NW 2nd Ave, Miami, FL 33127', 90, 2, 'moderate', ARRAY['caio', 'caio_sister']::best_for[], 'https://maps.google.com/?q=Coyo+Taco+Wynwood', NULL, NULL, NULL, NULL, NULL, NULL, ARRAY['tacos', 'bar', 'wynwood']::TEXT[], 'candidate', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-22', 'Trader Joe''s Coconut Grove', 'Mercado perto de casa', 'Mercado com produtos únicos, snacks e bebidas.', 'Abastecer a casa, 3 min de carro.', 'nearby', ARRAY['morning', 'afternoon']::event_period[], 'Coconut Grove', '2990 McFarlane Rd, Miami, FL 33133', 45, 1, 'light', ARRAY['family', 'parents']::best_for[], 'https://maps.google.com/?q=Trader+Joes+Coconut+Grove', NULL, NULL, NULL, NULL, NULL, NULL, ARRAY['mercado', 'perto de casa', 'essencial']::TEXT[], 'candidate', NULL, NULL, TRUE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-23', 'Salty Donut', 'Donuts artesanais', 'Donuts gourmet com sabores sazonais incríveis.', 'Café da manhã especial, fila rápida.', 'cafe', ARRAY['morning']::event_period[], 'Wynwood', '29 NW 24th St, Miami, FL 33127', 30, 2, 'light', ARRAY['caio_sister', 'family']::best_for[], 'https://maps.google.com/?q=Salty+Donut+Wynwood', NULL, NULL, NULL, NULL, 'https://www.instagram.com/saltydonut', NULL, ARRAY['donuts', 'café', 'instagram']::TEXT[], 'candidate', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-24', 'Zak the Baker', 'Padaria artesanal', 'Padaria com pães artesanais e café excelente no Wynwood.', 'Um dos melhores cafés da cidade.', 'cafe', ARRAY['morning']::event_period[], 'Wynwood', '295 NW 26th St, Miami, FL 33127', 45, 2, 'light', ARRAY['family', 'caio']::best_for[], 'https://maps.google.com/?q=Zak+the+Baker', NULL, NULL, NULL, NULL, NULL, NULL, ARRAY['padaria', 'café']::TEXT[], 'candidate', NULL, NULL, FALSE);

-- day_alternative_plans
INSERT INTO day_alternative_plans (id, day_id, trigger, title, description, plan_item_ids) VALUES ('alt-24-rain', 'day-24', 'rain', 'Dia indoor em Coconut Grove', 'Books & Books, café coberto e jantar no Peacock Garden', ARRAY[]::TEXT[]);
INSERT INTO day_alternative_plans (id, day_id, trigger, title, description, plan_item_ids) VALUES ('alt-24-tired', 'day-24', 'tired', 'Dia leve perto de casa', 'Mercado local, almoço no Grove e descanso à tarde', ARRAY[]::TEXT[]);
INSERT INTO day_alternative_plans (id, day_id, trigger, title, description, plan_item_ids) VALUES ('alt-25-rain', 'day-25', 'rain', 'PAMM + shopping indoor', 'Pérez Art Museum, Bayside Marketplace e jantar coberto', ARRAY[]::TEXT[]);
INSERT INTO day_alternative_plans (id, day_id, trigger, title, description, plan_item_ids) VALUES ('alt-25-energy', 'day-25', 'extra_energy', 'Noite extra', 'Wynwood Walls de noite + bar no Wynwood', ARRAY[]::TEXT[]);
INSERT INTO day_alternative_plans (id, day_id, trigger, title, description, plan_item_ids) VALUES ('alt-26-tired', 'day-26', 'tired', 'Sábado tranquilo', 'Praia em Key Biscayne + jantar cedo em família', ARRAY[]::TEXT[]);

-- essential_places
INSERT INTO essential_places (id, name, type, address, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-lodging', 'Nossa casa — Coconut Grove', 'lodging', '3024 Aviation Avenue, Miami, FL 33133', 'Base da viagem. Check-in após 16h no dia 23.', 'https://maps.google.com/?q=3024+Aviation+Avenue+Miami+FL+33133', 'https://maps.apple.com/?address=3024+Aviation+Avenue,Miami,FL+33133', 'https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=3024+Aviation+Avenue+Miami');
INSERT INTO essential_places (id, name, type, address, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-airport', 'Miami International Airport (MIA)', 'airport', '2100 NW 42nd Ave, Miami, FL 33142', 'Chegada dia 23 ~22h. Partida dia 27 ~18h.', 'https://maps.google.com/?q=Miami+International+Airport', NULL, 'https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=Miami+International+Airport');
INSERT INTO essential_places (id, name, type, address, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-pharmacy', 'CVS Pharmacy', 'pharmacy', '3101 Grand Ave, Coconut Grove, FL 33133', 'Remédios, protetor solar, itens de farmácia.', 'https://maps.google.com/?q=CVS+Coconut+Grove+3101+Grand+Ave', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-market', 'Trader Joe''s', 'market', '2990 McFarlane Rd, Miami, FL 33133', 'Mercado principal perto de casa.', 'https://maps.google.com/?q=Trader+Joes+Coconut+Grove', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-hospital', 'Baptist Hospital', 'hospital', '8900 N Kendall Dr, Miami, FL 33176', 'Emergência — ligar 911 nos EUA.', 'https://maps.google.com/?q=Baptist+Hospital+Miami', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-shopping', 'CocoWalk', 'shopping', '3015 Grand Ave, Coconut Grove, FL 33133', 'Shopping pequeno a pé do Grove.', 'https://maps.google.com/?q=CocoWalk+Coconut+Grove', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-consulate', 'Consulado Geral do Brasil', 'consulate', '80 SW 8th St, Miami, FL 33130', 'Emergências consulares.', 'https://maps.google.com/?q=Brazilian+Consulate+Miami', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-meeting', 'Ponto de encontro — CocoWalk', 'meeting_point', '3015 Grand Ave, Coconut Grove, FL 33133', 'Combinado da família se alguém se perder.', 'https://maps.google.com/?q=CocoWalk+Coconut+Grove', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-apple', 'Apple Store — Lincoln Road', 'shopping', '1021 Lincoln Rd, Miami Beach, FL 33139', 'Suporte Apple se precisar.', 'https://maps.google.com/?q=Apple+Store+Lincoln+Road', NULL, NULL);

-- travel_documents
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-flights', 'Confirmações de voo — American Airlines', 'flight', 'https://www.aa.com/reservation/view/find-your-reservation', 'Código de confirmação: XK7M2P (fictício para demo)');
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-lodging', 'Reserva Airbnb — Coconut Grove', 'lodging', 'https://www.airbnb.com/trips', 'Check-in 23/05 após 16h. Endereço: 3024 Aviation Avenue.');
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-jazz-ticket', 'Ingressos Ball & Chain — Jazz', 'ticket', 'https://www.ballandchainmiami.com/events', '4 ingressos para sábado 24/05');
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-club-ticket', 'Ingressos Club Space', 'ticket', 'https://www.clubspace.com/events', 'Caio + Irmã — sábado 26/05');
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-mandolin', 'Reserva Mandolin — 25/05 20h', 'reservation', 'https://www.mandolinmiami.com', 'Mesa para 4 pessoas');
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-jaguar', 'Reserva Jaguar — 26/05 20h', 'reservation', 'https://www.jaguarmiami.com', 'Mesa para 4 pessoas');
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-insurance', 'Seguro viagem', 'insurance', NULL, 'Apólice no e-mail — cobertura médica internacional');
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-ica', 'ICA Miami — visita', 'ticket', 'https://icamiami.org/visit', 'Entrada gratuita, sem reserva necessária');

-- trip_tasks
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-1', 'Comprar ingresso do jazz no Ball & Chain', '2026-05-24', 'evt-24-jazz', 'caio', 'done', 'high');
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-2', 'Confirmar reserva do Mandolin (25/05)', '2026-05-25', 'evt-25-dinner', 'mother', 'done', 'medium');
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-3', 'Comprar ingressos Club Space', '2026-05-26', 'evt-26-club', 'caio', 'done', 'high');
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-4', 'Escolher restaurante do domingo (se sobrar tempo)', '2026-05-26', NULL, NULL, 'open', 'low');
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-5', 'Definir quem vai na festa do Club Space', '2026-05-25', 'evt-26-club', NULL, 'done', 'medium');
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-6', 'Confirmar horário de check-out Airbnb', '2026-05-27', NULL, NULL, 'open', 'medium');
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-7', 'Fazer check-in online do voo de volta', '2026-05-27', 'evt-27-departure', 'father', 'open', 'high');
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-8', 'Comprar eSIM / chip de dados EUA', '2026-05-22', NULL, NULL, 'open', 'high');

-- checklists
INSERT INTO checklists (id, title, type, items) VALUES ('cl-before', 'Antes da viagem', 'before_trip', '[{"id":"cl-b1","label":"Passaporte válido (6+ meses)"},{"id":"cl-b2","label":"ESTA / visto aprovado"},{"id":"cl-b3","label":"Seguro viagem contratado"},{"id":"cl-b4","label":"Cartões internacionais avisados"},{"id":"cl-b5","label":"eSIM / chip de dados"},{"id":"cl-b6","label":"Adaptador de tomada EUA"},{"id":"cl-b7","label":"Confirmação Airbnb impressa/salva"},{"id":"cl-b8","label":"Ingressos e reservas salvas offline"}]'::JSONB);
INSERT INTO checklists (id, title, type, items) VALUES ('cl-travel', 'Dia de viagem — antes de sair', 'travel_day', '[{"id":"cl-t1","label":"Passaporte"},{"id":"cl-t2","label":"Cartão de embarque (digital)"},{"id":"cl-t3","label":"Celular carregado + carregador"},{"id":"cl-t4","label":"Remédios de uso contínuo"},{"id":"cl-t5","label":"Casaco leve (avião gelado)"},{"id":"cl-t6","label":"Documento da reserva Airbnb"},{"id":"cl-t7","label":"Dinheiro / cartão internacional"},{"id":"cl-t8","label":"Fones de ouvido"}]'::JSONB);
INSERT INTO checklists (id, title, type, items) VALUES ('cl-daily', 'Antes de sair de casa (diário)', 'daily', '[{"id":"cl-d1","label":"Celular carregado"},{"id":"cl-d2","label":"Protetor solar"},{"id":"cl-d3","label":"Garrafa de água"},{"id":"cl-d4","label":"Carteira e documentos"},{"id":"cl-d5","label":"Avisar no grupo do WhatsApp"}]'::JSONB);
INSERT INTO checklists (id, title, type, items) VALUES ('cl-return', 'Dia de volta', 'return', '[{"id":"cl-r1","label":"Check-out Airbnb feito"},{"id":"cl-r2","label":"Conferir pertences no quarto"},{"id":"cl-r3","label":"Check-in online do voo"},{"id":"cl-r4","label":"Líquidos na mala despachada"},{"id":"cl-r5","label":"Souvenirs na mala certa"},{"id":"cl-r6","label":"Uber para o aeroporto com folga"}]'::JSONB);

-- night_events
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-1', '2026-05-24', 'jazz', 'Live Jazz — Ball & Chain', 'Ball & Chain', 'Little Havana', '21:00', '01:00', '$15–25 entrada', 'Casual elegante', 'moderate', TRUE, 'https://maps.google.com/?q=Ball+and+Chain+Little+Havana', NULL, 'https://www.ballandchainmiami.com', 'https://www.ballandchainmiami.com', NULL, 'added_to_itinerary', NULL);
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-2', '2026-05-24', 'bar', 'Happy Hour — Taurus', 'Taurus Whiskey Bar', 'Coconut Grove', '18:00', NULL, 'Happy hour até 20h', NULL, 'light', FALSE, 'https://maps.google.com/?q=Taurus+Whiskey+Bar+Coconut+Grove', NULL, NULL, NULL, NULL, 'candidate', NULL);
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-3', '2026-05-25', 'jazz', 'Jazz ao vivo — Lagniappe', 'Lagniappe', 'Midtown', '21:30', NULL, 'Entrada gratuita', 'Casual', 'moderate', FALSE, 'https://maps.google.com/?q=Lagniappe+Miami', NULL, NULL, NULL, NULL, 'shortlisted', NULL);
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-4', '2026-05-25', 'jazz', 'Jazz Night — Blackbird Ordinary', 'Blackbird Ordinary', 'Brickell', '20:00', NULL, 'Sem cover', NULL, 'light', FALSE, 'https://maps.google.com/?q=Blackbird+Ordinary+Miami', NULL, NULL, NULL, NULL, 'candidate', NULL);
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-5', '2026-05-26', 'electronic', 'Techno Night — Club Space', 'Club Space', 'Downtown', '23:30', '06:00', '$40–60', 'Casual / clubwear', 'intense', TRUE, 'https://maps.google.com/?q=Club+Space+Miami', NULL, NULL, 'https://www.clubspace.com', NULL, 'added_to_itinerary', NULL);
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-6', '2026-05-26', 'electronic', 'House Night — E11EVEN', 'E11EVEN', 'Downtown', '23:00', NULL, '$50–80', 'Clubwear', 'intense', TRUE, 'https://maps.google.com/?q=E11EVEN+Miami', NULL, NULL, 'https://11miami.com', NULL, 'candidate', NULL);
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-7', '2026-05-26', 'bar', 'Rooftop Drinks — Area 31', 'Area 31 Rooftop', 'Downtown', '19:00', NULL, 'Cocktails $18–25', NULL, 'light', FALSE, 'https://maps.google.com/?q=Area+31+Rooftop+Miami', NULL, NULL, NULL, NULL, 'candidate', NULL);
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-8', '2026-05-24', 'late_food', 'Late Night Tacos — Coyo Taco', 'Coyo Taco', 'Wynwood', '23:00', NULL, '$10–15', NULL, 'light', FALSE, 'https://maps.google.com/?q=Coyo+Taco+Wynwood', NULL, NULL, NULL, NULL, 'candidate', NULL);
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-9', '2026-05-25', 'bar', 'Cocktails — Sweet Liberty', 'Sweet Liberty Drinks & Supply', 'Miami Beach', '20:00', NULL, 'Cocktails premiados', NULL, 'moderate', FALSE, 'https://maps.google.com/?q=Sweet+Liberty+Miami+Beach', NULL, NULL, NULL, NULL, 'candidate', NULL);
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-10', '2026-05-26', 'late_food', 'Arepas 24h — Versailles', 'Versailles Restaurant', 'Little Havana', '00:00', NULL, 'Barato, aberto 24h', NULL, 'light', FALSE, 'https://maps.google.com/?q=Versailles+Restaurant+Miami', NULL, NULL, NULL, NULL, 'candidate', NULL);

-- flights
INSERT INTO flights (id, passenger_id, passenger_name, route, "from", "to", flight_number, seat, terminal, gate, boarding_time, departure_time, arrival_time, date, status, confirmation_code) VALUES ('flt-caio-out', 'caio', 'CAIO ROCHA', 'GRU → MIA', 'GRU', 'MIA', 'AA 930', '22A', '3', '—', '20:45', '21:30', '05:15+1', '2026-05-23', 'confirmed', 'XK7M2P');
INSERT INTO flights (id, passenger_id, passenger_name, route, "from", "to", flight_number, seat, terminal, gate, boarding_time, departure_time, arrival_time, date, status, confirmation_code) VALUES ('flt-father-out', 'father', 'PAI ROCHA', 'GRU → MIA', 'GRU', 'MIA', 'AA 930', '22B', '3', '—', '20:45', '21:30', '05:15+1', '2026-05-23', 'confirmed', 'XK7M2P');
INSERT INTO flights (id, passenger_id, passenger_name, route, "from", "to", flight_number, seat, terminal, gate, boarding_time, departure_time, arrival_time, date, status, confirmation_code) VALUES ('flt-mother-out', 'mother', 'MAE ROCHA', 'GRU → MIA', 'GRU', 'MIA', 'AA 930', '22C', '3', '—', '20:45', '21:30', '05:15+1', '2026-05-23', 'confirmed', 'XK7M2P');
INSERT INTO flights (id, passenger_id, passenger_name, route, "from", "to", flight_number, seat, terminal, gate, boarding_time, departure_time, arrival_time, date, status, confirmation_code) VALUES ('flt-sister-out', 'sister', 'IRMA ROCHA', 'GRU → MIA', 'GRU', 'MIA', 'AA 930', '22D', '3', '—', '20:45', '21:30', '05:15+1', '2026-05-23', 'confirmed', 'XK7M2P');
INSERT INTO flights (id, passenger_id, passenger_name, route, "from", "to", flight_number, seat, terminal, gate, boarding_time, departure_time, arrival_time, date, status, confirmation_code) VALUES ('flt-caio-ret', 'caio', 'CAIO ROCHA', 'MIA → GRU', 'MIA', 'GRU', 'AA 931', '18A', 'D', '—', '17:15', '18:00', '05:30+1', '2026-05-27', 'pending', 'XK7M2P');
INSERT INTO flights (id, passenger_id, passenger_name, route, "from", "to", flight_number, seat, terminal, gate, boarding_time, departure_time, arrival_time, date, status, confirmation_code) VALUES ('flt-father-ret', 'father', 'PAI ROCHA', 'MIA → GRU', 'MIA', 'GRU', 'AA 931', '18B', 'D', '—', '17:15', '18:00', '05:30+1', '2026-05-27', 'pending', 'XK7M2P');
INSERT INTO flights (id, passenger_id, passenger_name, route, "from", "to", flight_number, seat, terminal, gate, boarding_time, departure_time, arrival_time, date, status, confirmation_code) VALUES ('flt-mother-ret', 'mother', 'MAE ROCHA', 'MIA → GRU', 'MIA', 'GRU', 'AA 931', '18C', 'D', '—', '17:15', '18:00', '05:30+1', '2026-05-27', 'pending', 'XK7M2P');
INSERT INTO flights (id, passenger_id, passenger_name, route, "from", "to", flight_number, seat, terminal, gate, boarding_time, departure_time, arrival_time, date, status, confirmation_code) VALUES ('flt-sister-ret', 'sister', 'IRMA ROCHA', 'MIA → GRU', 'MIA', 'GRU', 'AA 931', '18D', 'D', '—', '17:15', '18:00', '05:30+1', '2026-05-27', 'pending', 'XK7M2P');

-- memories
INSERT INTO memories (id, day_id, date, best_moment, best_food, favorite_place, rating, notes, photo_url) VALUES ('mem-1', 'day-24', '2026-05-24', '', '', '', 0, '', NULL);

-- agreements
INSERT INTO agreements (id, text, "order") VALUES ('agr-1', 'Sempre avisar no grupo do WhatsApp antes de sair sozinho.', 1);
INSERT INTO agreements (id, text, "order") VALUES ('agr-2', 'Todo mundo mantém o celular carregado e com dados.', 2);
INSERT INTO agreements (id, text, "order") VALUES ('agr-3', 'Se separar, combinar ponto de encontro antes de sair.', 3);
INSERT INTO agreements (id, text, "order") VALUES ('agr-4', 'Horário de saída de casa vale mais que horário do compromisso.', 4);
INSERT INTO agreements (id, text, "order") VALUES ('agr-5', 'Em restaurante reservado, sair com pelo menos 25 min de folga.', 5);
INSERT INTO agreements (id, text, "order") VALUES ('agr-6', 'Caio e irmã: combinar horário de retorno antes de ir à festa.', 6);

-- travel_timeline_items
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-dep-1', '15:30', 'Sair de casa para o aeroporto', '2026-05-23', TRUE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-dep-2', '16:15', 'Chegar ao aeroporto GRU', '2026-05-23', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-dep-3', '17:00', 'Check-in e despacho de bagagem', '2026-05-23', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-dep-4', '18:00', 'Segurança e imigração', '2026-05-23', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-dep-5', '19:00', 'Jantar no aeroporto', '2026-05-23', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-dep-6', '20:45', 'Embarque', '2026-05-23', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-dep-7', '21:30', 'Decolagem GRU → MIA', '2026-05-23', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-ret-1', '10:00', 'Check-out do Airbnb', '2026-05-27', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-ret-2', '14:00', 'Sair para o aeroporto MIA', '2026-05-27', TRUE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-ret-3', '15:00', 'Chegar ao aeroporto', '2026-05-27', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-ret-4', '15:30', 'Check-in e bagagem', '2026-05-27', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-ret-5', '16:30', 'Segurança e imigração', '2026-05-27', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-ret-6', '17:15', 'Embarque', '2026-05-27', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-ret-7', '18:00', 'Decolagem MIA → GRU', '2026-05-27', FALSE);
