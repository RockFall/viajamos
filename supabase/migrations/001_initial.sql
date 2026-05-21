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


-- ---------------------------------------------------------------------------
-- Static seed data
-- ---------------------------------------------------------------------------
-- family_members
INSERT INTO family_members (id, name, short_name, color) VALUES ('caio', 'Caio', 'Caio', '#FF6B6B');
INSERT INTO family_members (id, name, short_name, color) VALUES ('geovanin', 'Geovanin', 'Geovanin', '#4ECDC4');
INSERT INTO family_members (id, name, short_name, color) VALUES ('adelaide', 'Adelaide', 'Adelaide', '#FFE66D');
INSERT INTO family_members (id, name, short_name, color) VALUES ('sofia', 'Sofia', 'Sofia', '#A78BFA');

-- trip_config
INSERT INTO trip_config (id, destination, base_address, start_date, end_date, mock_today) VALUES ('default', 'Miami + Islamorada', 'Miami: 3024 Aviation Avenue, Miami, FL 33133 · Islamorada: 82100 Overseas Highway, Islamorada, FL 33036', '2026-05-22', '2026-05-30', '2026-05-24');

-- checklists
INSERT INTO checklists (id, title, type, items) VALUES ('cl-before', 'Antes da viagem', 'before_trip', '[{"id":"cl-b1","label":"Passaporte válido (6+ meses)"},{"id":"cl-b2","label":"ESTA / visto aprovado"},{"id":"cl-b3","label":"Seguro viagem contratado"},{"id":"cl-b4","label":"Cartões internacionais avisados"},{"id":"cl-b5","label":"eSIM / chip de dados"},{"id":"cl-b6","label":"Adaptador de tomada EUA"},{"id":"cl-b7","label":"Confirmações das bases Miami e Islamorada salvas offline"},{"id":"cl-b8","label":"Ingressos, reservas e mapas salvos offline"},{"id":"cl-b9","label":"Protetor solar, boné e roupa de água para as Keys"}]'::JSONB);
INSERT INTO checklists (id, title, type, items) VALUES ('cl-travel', 'Dia de viagem — antes de sair', 'travel_day', '[{"id":"cl-t1","label":"Passaporte"},{"id":"cl-t2","label":"Cartão de embarque (digital)"},{"id":"cl-t3","label":"Celular carregado + carregador"},{"id":"cl-t4","label":"Remédios de uso contínuo"},{"id":"cl-t5","label":"Casaco leve (avião gelado)"},{"id":"cl-t6","label":"Documento da hospedagem Miami"},{"id":"cl-t7","label":"Dinheiro / cartão internacional"},{"id":"cl-t8","label":"Fones de ouvido"}]'::JSONB);
INSERT INTO checklists (id, title, type, items) VALUES ('cl-daily', 'Antes de sair de casa (diário)', 'daily', '[{"id":"cl-d1","label":"Celular carregado"},{"id":"cl-d2","label":"Protetor solar"},{"id":"cl-d3","label":"Garrafa de água"},{"id":"cl-d4","label":"Carteira e documentos"},{"id":"cl-d5","label":"Avisar no grupo do WhatsApp"}]'::JSONB);
INSERT INTO checklists (id, title, type, items) VALUES ('cl-return', 'Dia de volta', 'return', '[{"id":"cl-r1","label":"Check-out da base Islamorada feito"},{"id":"cl-r2","label":"Conferir pertences no quarto"},{"id":"cl-r3","label":"Check-in online do voo"},{"id":"cl-r4","label":"Líquidos na mala despachada"},{"id":"cl-r5","label":"Souvenirs na mala certa"},{"id":"cl-r6","label":"Transporte para o aeroporto/retorno com folga"}]'::JSONB);

-- agreements
INSERT INTO agreements (id, text, "order") VALUES ('agr-1', 'Sempre avisar no grupo do WhatsApp antes de sair sozinho.', 1);
INSERT INTO agreements (id, text, "order") VALUES ('agr-2', 'Todo mundo mantém o celular carregado e com dados.', 2);
INSERT INTO agreements (id, text, "order") VALUES ('agr-3', 'Se separar, combinar ponto de encontro antes de sair.', 3);
INSERT INTO agreements (id, text, "order") VALUES ('agr-4', 'Horário de saída de casa vale mais que horário do compromisso.', 4);
INSERT INTO agreements (id, text, "order") VALUES ('agr-5', 'Em restaurante reservado, sair com pelo menos 25 min de folga.', 5);
INSERT INTO agreements (id, text, "order") VALUES ('agr-6', 'Caio e Sofia: combinar horário de retorno antes de qualquer noite separada.', 6);
INSERT INTO agreements (id, text, "order") VALUES ('agr-7', 'Nas Keys, confirmar clima, vento e horários antes de reservar atividade de água.', 7);
INSERT INTO agreements (id, text, "order") VALUES ('agr-8', 'Em dias de troca de base, sair com água, snacks e mapas offline.', 8);

-- ---------------------------------------------------------------------------
-- Trip data
-- ---------------------------------------------------------------------------
-- trip_days
INSERT INTO trip_days (id, date, title, theme, area, base_name, base_address, weather, is_travel_day, is_return_day) VALUES ('day-22', '2026-05-22', 'Saída de Belo Horizonte', 'Voo BH → Miami e chegada com calma', 'Travel', 'Base Miami', '3024 Aviation Avenue, Miami, FL 33133', 'Noite de viagem · detalhes do voo a definir', TRUE, FALSE);
INSERT INTO trip_days (id, date, title, theme, area, base_name, base_address, weather, is_travel_day, is_return_day) VALUES ('day-23', '2026-05-23', 'Primeiro dia em Miami', 'Coconut Grove, Vizcaya e pôr do sol na baía', 'Miami', 'Base Miami', '3024 Aviation Avenue, Miami, FL 33133', '29°C · Úmido e parcialmente nublado', FALSE, FALSE);
INSERT INTO trip_days (id, date, title, theme, area, base_name, base_address, weather, is_travel_day, is_return_day) VALUES ('day-24', '2026-05-24', 'Little Havana + jazz', 'Calle Ocho, comida cubana e música ao vivo', 'Miami', 'Base Miami', '3024 Aviation Avenue, Miami, FL 33133', '30°C · Quente', FALSE, FALSE);
INSERT INTO trip_days (id, date, title, theme, area, base_name, base_address, weather, is_travel_day, is_return_day) VALUES ('day-25', '2026-05-25', 'Arte, design e música', 'Design District, ICA Miami e Lagniappe', 'Miami', 'Base Miami', '3024 Aviation Avenue, Miami, FL 33133', '30°C · Ensolarado', FALSE, FALSE);
INSERT INTO trip_days (id, date, title, theme, area, base_name, base_address, weather, is_travel_day, is_return_day) VALUES ('day-26', '2026-05-26', 'Wynwood + noite dividida', 'Murais, compras leves, jantar e eletrônica opcional', 'Miami', 'Base Miami', '3024 Aviation Avenue, Miami, FL 33133', '31°C · Quente', FALSE, FALSE);
INSERT INTO trip_days (id, date, title, theme, area, base_name, base_address, weather, is_travel_day, is_return_day) VALUES ('day-27', '2026-05-27', 'Rumo às Keys', 'Manhã em Miami, estrada cênica e chegada em Islamorada', 'Islamorada', 'Base Islamorada', '82100 Overseas Highway, Islamorada, FL 33036, Estados Unidos', '29°C · Sol com chance de chuva rápida', TRUE, FALSE);
INSERT INTO trip_days (id, date, title, theme, area, base_name, base_address, weather, is_travel_day, is_return_day) VALUES ('day-28', '2026-05-28', 'Água e vida marinha', 'Robbie''s, tarpons, barco com fundo de vidro e sunset', 'Islamorada', 'Base Islamorada', '82100 Overseas Highway, Islamorada, FL 33036, Estados Unidos', '30°C · Brisa de mar', FALSE, FALSE);
INSERT INTO trip_days (id, date, title, theme, area, base_name, base_address, weather, is_travel_day, is_return_day) VALUES ('day-29', '2026-05-29', 'Museu, arte local e jantar na areia', 'Plano flexível entre History of Diving, Rain Barrel e Morada Bay', 'Islamorada', 'Base Islamorada', '82100 Overseas Highway, Islamorada, FL 33036, Estados Unidos', '30°C · Possível pancada à tarde', FALSE, FALSE);
INSERT INTO trip_days (id, date, title, theme, area, base_name, base_address, weather, is_travel_day, is_return_day) VALUES ('day-30', '2026-05-30', 'Fechamento da viagem', 'Manhã leve nas Keys e retorno com horários a definir', 'Travel', 'Base Islamorada', '82100 Overseas Highway, Islamorada, FL 33036, Estados Unidos', '29°C · Dia de saída', TRUE, TRUE);

-- itinerary_events
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-22-flight-placeholder', 'Saída de Belo Horizonte', 'Voo para Miami com número, horários e assentos a preencher no app.', '2026-05-22', NULL, NULL, 'night', 'Belo Horizonte / CNF', 'Belo Horizonte, MG', NULL, 'travel', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Não inserir dados sensíveis. Usar este evento como placeholder até os detalhes reais do voo.', NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-22-arrival-miami', 'Chegada em Miami e ida para a base', 'Desembarque, imigração, bagagens e Uber/carro até Coconut Grove.', '2026-05-22', '23:30', NULL, 'late_night', 'Miami International Airport', '2100 NW 42nd Ave, Miami, FL 33142', 'Miami', 'travel', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Miami+International+Airport', NULL, NULL, NULL, NULL, 'https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=3024+Aviation+Avenue+Miami+FL+33133', 'Horário estimado até o voo ser preenchido.', NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-23-brunch-greenstreet', 'Brunch no GreenStreet', 'Primeira manhã leve em Coconut Grove, perto da base.', '2026-05-23', '10:30', '12:00', 'morning', 'GreenStreet Cafe', '3468 Main Hwy, Coconut Grove, FL 33133', 'Coconut Grove', 'food', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=GreenStreet+Cafe+Coconut+Grove', NULL, 'https://www.greenstreetcafe.com', NULL, NULL, NULL, NULL, '10:00');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-23-vizcaya', 'Vizcaya Museum & Gardens', 'Casa histórica, jardins e fotos com vista para Biscayne Bay.', '2026-05-23', '13:30', '16:30', 'afternoon', 'Vizcaya Museum & Gardens', '3251 S Miami Ave, Miami, FL 33129', 'Coconut Grove', 'museum', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Vizcaya+Museum+and+Gardens', NULL, 'https://vizcaya.org/', NULL, NULL, NULL, 'Bom plano de tarde perto da base; confirmar horários antes de sair.', NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-23-regatta', 'Pôr do sol no Regatta Grove', 'Drinks, comida e música em espaço aberto na beira da baía.', '2026-05-23', '18:00', '20:00', 'night', 'Regatta Grove', '3415 Pan American Dr, Miami, FL 33133', 'Coconut Grove', 'food', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Regatta+Grove', NULL, 'https://regattagrove.com/', NULL, NULL, NULL, NULL, '17:35');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-24-little-havana', 'Passeio por Little Havana', 'Calle Ocho, Domino Park, sorvete/café cubano e murais.', '2026-05-24', '11:00', '14:00', 'morning', 'Calle Ocho', 'SW 8th St, Miami, FL 33135', 'Little Havana', 'walk', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Calle+Ocho+Little+Havana', NULL, NULL, NULL, NULL, NULL, NULL, '10:30');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-24-versailles', 'Almoço/café no Versailles', 'Clássico cubano para sanduíches, pastelitos e café.', '2026-05-24', '14:15', NULL, 'afternoon', 'Versailles Restaurant', '3555 SW 8th St, Miami, FL 33135', 'Little Havana', 'food', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Versailles+Restaurant+Miami', NULL, 'https://www.versaillesrestaurant.com/', NULL, NULL, NULL, NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-24-ball-chain', 'Música ao vivo no Ball & Chain', 'Calle Ocho à noite com música latina/jazz e ambiente histórico.', '2026-05-24', '20:30', NULL, 'night', 'Ball & Chain', '1513 SW 8th St, Miami, FL 33135', 'Little Havana', 'music', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Ball+and+Chain+Little+Havana', NULL, 'https://ballandchainmiami.com/', NULL, NULL, NULL, 'Página oficial lista eventos de música ao vivo e horários noturnos.', '19:45');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-25-design-district', 'Miami Design District', 'Lojas, arquitetura, galerias e almoço leve na região.', '2026-05-25', '11:00', '14:00', 'morning', 'Miami Design District', '3841 NE 2nd Ave, Miami, FL 33137', 'Design District', 'shopping', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Miami+Design+District', NULL, NULL, NULL, NULL, NULL, NULL, '10:30');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-25-ica', 'ICA Miami', 'Museu compacto de arte contemporânea no Design District.', '2026-05-25', '15:00', '17:00', 'afternoon', 'ICA Miami', '61 NE 41st St, Miami, FL 33137', 'Design District', 'museum', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=ICA+Miami', NULL, 'https://icamiami.org', 'https://icamiami.org/visit', NULL, NULL, NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-25-mandolin', 'Jantar no Mandolin Aegean Bistro', 'Grego mediterrâneo em pátio charmoso no Design District.', '2026-05-25', '19:30', NULL, 'night', 'Mandolin Aegean Bistro', '4312 NE 2nd Ave, Miami, FL 33137', 'Design District', 'food', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Mandolin+Aegean+Bistro', NULL, NULL, NULL, 'https://www.mandolinmiami.com', NULL, NULL, '18:50');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-25-lagniappe-caio-sofia', 'Jazz no Lagniappe', 'Wine garden com música ao vivo das 21h à meia-noite.', '2026-05-25', '21:30', NULL, 'night', 'Lagniappe', '3425 NE 2nd Ave, Miami, FL 33137', 'Midtown', 'music', ARRAY['caio', 'sofia']::TEXT[], 'planned', 'grp-25-night', 'Caio + Sofia — jazz', 'https://maps.google.com/?q=Lagniappe+Miami', NULL, 'http://www.lagniappehouse.com/music-schedule.html', NULL, NULL, NULL, NULL, '20:55');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-25-rest-geovanin-adelaide', 'Descanso na base Miami', 'Noite leve em Coconut Grove para Geovanin e Adelaide.', '2026-05-25', '21:00', NULL, 'night', 'Base Miami', '3024 Aviation Avenue, Miami, FL 33133', NULL, 'rest', ARRAY['geovanin', 'adelaide']::TEXT[], 'planned', 'grp-25-night', 'Geovanin + Adelaide — descanso', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-26-wynwood', 'Wynwood Walls + café', 'Murais, galerias e pausa no Zak the Baker ou Salty Donut.', '2026-05-26', '10:30', '13:30', 'morning', 'Wynwood Walls', '2516 NW 2nd Ave, Miami, FL 33127', 'Wynwood', 'walk', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Wynwood+Walls', NULL, 'https://thewynwoodwalls.com/', NULL, NULL, NULL, NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-26-aventura-caio-sofia', 'Compras no Aventura Mall', 'Caio e Sofia fazem compras em shopping grande com ar-condicionado.', '2026-05-26', '15:00', '18:30', 'afternoon', 'Aventura Mall', '19501 Biscayne Blvd, Aventura, FL 33180', 'Aventura', 'shopping', ARRAY['caio', 'sofia']::TEXT[], 'planned', 'grp-26-afternoon', 'Caio + Sofia — compras', 'https://maps.google.com/?q=Aventura+Mall', NULL, 'https://aventuramall.com/', NULL, NULL, NULL, NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-26-grove-geovanin-adelaide', 'Café e leitura no Grove', 'Geovanin e Adelaide ficam perto da base para um plano leve.', '2026-05-26', '15:30', NULL, 'afternoon', 'Panther Coffee', '3400 Pan American Dr, Miami, FL 33133', 'Coconut Grove', 'food', ARRAY['geovanin', 'adelaide']::TEXT[], 'planned', 'grp-26-afternoon', 'Geovanin + Adelaide — café', 'https://maps.google.com/?q=Panther+Coffee+Coconut+Grove', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-26-family-dinner', 'Jantar em família no Jaguar', 'Jantar latino em Coconut Grove antes da noite opcional.', '2026-05-26', '20:00', NULL, 'night', 'Jaguar Ceviche Spoon', '3067 Grand Ave, Coconut Grove, FL 33133', 'Coconut Grove', 'food', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Jaguar+Ceviche+Coconut+Grove', NULL, NULL, NULL, 'https://www.jaguarmiami.com', NULL, NULL, '19:30');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-26-club-space', 'Club Space opcional', 'Eletrônica na Terrace, se houver energia e line-up interessante.', '2026-05-26', '23:30', NULL, 'late_night', 'Club Space', '34 NE 11th St, Miami, FL 33132', 'Downtown', 'music', ARRAY['caio', 'sofia']::TEXT[], 'idea', 'grp-26-late', 'Caio + Sofia — eletrônica', 'https://maps.google.com/?q=Club+Space+Miami', NULL, 'https://www.clubspace.com/', NULL, NULL, NULL, 'Comprar ingresso somente depois de confirmar line-up e disposição.', '22:45');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-27-road-to-keys', 'Estrada para Islamorada', 'Check-out em Miami, US-1/Overseas Highway e chegada à base nas Keys.', '2026-05-27', '10:00', '14:00', 'morning', 'Miami → Islamorada', '82100 Overseas Highway, Islamorada, FL 33036, Estados Unidos', 'Florida Keys', 'travel', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=82100+Overseas+Highway+Islamorada+FL+33036', NULL, NULL, NULL, NULL, NULL, NULL, '10:00');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-27-lorelei-sunset', 'Sunset no Lorelei', 'Jantar casual, happy hour e música ao vivo ao pôr do sol.', '2026-05-27', '18:00', NULL, 'night', 'Lorelei Restaurant & Cabana Bar', '96 Madeira Rd, Islamorada, FL 33036', 'Islamorada', 'food', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Lorelei+Restaurant+Islamorada', NULL, 'https://www.loreleicabanabar.com/', NULL, NULL, NULL, NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-28-robbies', 'Robbie''s: tarpons + barco', 'Alimentar tarpons e escolher glass bottom boat, kayak ou passeio ecológico.', '2026-05-28', '09:30', '13:30', 'morning', 'Robbie''s of Islamorada', '77522 Overseas Hwy, Islamorada, FL 33036', 'Islamorada', 'experience', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Robbies+of+Islamorada', NULL, 'https://robbies.com/activities.htm', NULL, NULL, NULL, NULL, '09:00');
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-28-theater-sea', 'Theater of the Sea', 'Shows contínuos de golfinhos, leões-marinhos, tartarugas e aves.', '2026-05-28', '14:30', '17:00', 'afternoon', 'Theater of the Sea', '84721 Overseas Hwy, Islamorada, FL 33036', 'Islamorada', 'experience', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Theater+of+the+Sea+Islamorada', NULL, 'https://theaterofthesea.com/attractions/hours-show-schedule/', NULL, NULL, NULL, 'Aberto 9:15-17:00; último bloco forte de shows começa às 14:00.', NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-28-square-grouper', 'Jantar no Square Grouper', 'Frutos do mar locais no Islamorada Marina.', '2026-05-28', '19:30', NULL, 'night', 'Square Grouper Islamorada', '80460 Overseas Highway, Islamorada, FL 33036', 'Islamorada', 'food', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Square+Grouper+Islamorada', NULL, 'https://www.squaregrouperislamorada.com/', NULL, NULL, NULL, NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-29-diving-museum', 'History of Diving Museum', 'Plano indoor para chuva/calor, com história do mergulho nas Keys.', '2026-05-29', '10:30', '12:00', 'morning', 'History of Diving Museum', '82990 Overseas Hwy, Islamorada, FL 33036', 'Islamorada', 'museum', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=History+of+Diving+Museum', NULL, 'https://divingmuseum.org/plan-your-visit/location-hours/', NULL, NULL, NULL, NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-29-rain-barrel', 'Rain Barrel Village', 'Arte local, lojas, jardins e foto com Betsy the Lobster.', '2026-05-29', '13:00', '15:00', 'afternoon', 'Rain Barrel Village', '86700 Overseas Hwy, Islamorada, FL 33036', 'Islamorada', 'shopping', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Rain+Barrel+Village', NULL, 'https://rainbarrelvillage.com/', NULL, NULL, NULL, NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-29-morada-bay', 'Jantar na areia no Morada Bay', 'Bistrô mediterrâneo na praia, pôr do sol e noite leve.', '2026-05-29', '18:30', NULL, 'night', 'Morada Bay Beach Cafe', '81801 Overseas Highway, Islamorada, FL 33036', 'Islamorada', 'food', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, 'https://maps.google.com/?q=Morada+Bay+Beach+Cafe', NULL, 'https://www.moradabaykeys.com/ada/dining/beach-cafe/', NULL, NULL, NULL, NULL, NULL);
INSERT INTO itinerary_events (id, title, description, date, start_time, end_time, period, location_name, address, neighborhood, category, people, status, group_id, group_label, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, uber_url, notes, leave_by) VALUES ('evt-30-checkout', 'Check-out e manhã leve nas Keys', 'Café, malas, fotos finais e horários de retorno a definir.', '2026-05-30', '09:30', NULL, 'morning', 'Base Islamorada', '82100 Overseas Highway, Islamorada, FL 33036, Estados Unidos', 'Islamorada', 'travel', ARRAY['caio', 'geovanin', 'adelaide', 'sofia']::TEXT[], 'planned', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Preencher detalhes de saída/voo quando confirmados.', NULL);

-- possible_plans
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-1', 'GreenStreet Cafe', 'Brunch clássico perto da base Miami', 'Café/brunch em Coconut Grove para começar o primeiro dia com pouco deslocamento.', 'Perto da hospedagem e fácil para ajustar o ritmo depois do voo.', 'cafe', ARRAY['morning']::event_period[], 'Miami · Coconut Grove', '3468 Main Hwy, Coconut Grove, FL 33133', 90, 2, 'light', ARRAY['family', 'everyone']::best_for[], 'https://maps.google.com/?q=GreenStreet+Cafe+Coconut+Grove', NULL, 'https://www.greenstreetcafe.com', NULL, NULL, NULL, NULL, ARRAY['miami', 'coconut grove', 'brunch', 'perto da base']::TEXT[], 'added_to_itinerary', NULL, NULL, TRUE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-2', 'Vizcaya Museum & Gardens', 'Casa histórica e jardins', 'Museu e jardins à beira da baía, ótimo para fotos, história e um passeio bonito sem ir longe.', 'A página oficial lista horário diurno e eventos especiais de fim de maio, incluindo programações ao entardecer.', 'museum', ARRAY['morning', 'afternoon']::event_period[], 'Miami · Coconut Grove', '3251 S Miami Ave, Miami, FL 33129', 150, 2, 'moderate', ARRAY['family', 'adelaide', 'geovanin']::best_for[], 'https://maps.google.com/?q=Vizcaya+Museum+and+Gardens', NULL, 'https://vizcaya.org/', 'https://vizcaya.org/', NULL, NULL, NULL, ARRAY['miami', 'museu', 'jardins', 'fotos', 'chuva leve']::TEXT[], 'added_to_itinerary', NULL, NULL, TRUE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-3', 'Regatta Grove', 'Drinks e comida na beira da baía', 'Espaço aberto em Coconut Grove com vista para Biscayne Bay, coquetéis, bites e música.', 'Plano fácil para pôr do sol perto da base, bom para família e para uma primeira noite sem excesso.', 'bar', ARRAY['afternoon', 'night']::event_period[], 'Miami · Coconut Grove', '3415 Pan American Dr, Miami, FL 33133', 120, 3, 'light', ARRAY['family', 'everyone']::best_for[], 'https://maps.google.com/?q=Regatta+Grove', NULL, 'https://regattagrove.com/', NULL, NULL, NULL, NULL, ARRAY['miami', 'coconut grove', 'sunset', 'bar', 'perto da base']::TEXT[], 'added_to_itinerary', NULL, NULL, TRUE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-4', 'Ball & Chain', 'Música ao vivo em Little Havana', 'Casa histórica na Calle Ocho com comida cubana, coquetéis e programação frequente de música ao vivo.', 'Une jantar, bar e música em um só lugar, com identidade forte de Miami.', 'jazz', ARRAY['night', 'late_night']::event_period[], 'Miami · Little Havana', '1513 SW 8th St, Miami, FL 33135', 180, 2, 'moderate', ARRAY['family', 'everyone']::best_for[], 'https://maps.google.com/?q=Ball+and+Chain+Little+Havana', NULL, 'https://ballandchainmiami.com/', NULL, NULL, NULL, NULL, ARRAY['miami', 'jazz', 'salsa', 'little havana', 'noite']::TEXT[], 'added_to_itinerary', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-5', 'Versailles Restaurant', 'Cubano clássico', 'Instituição de Little Havana para café cubano, pastelitos, sanduíches e pratos tradicionais.', 'Funciona bem como pausa cultural e gastronômica durante Calle Ocho.', 'restaurant', ARRAY['morning', 'afternoon', 'night', 'late_night']::event_period[], 'Miami · Little Havana', '3555 SW 8th St, Miami, FL 33135', 75, 1, 'light', ARRAY['family', 'everyone']::best_for[], 'https://maps.google.com/?q=Versailles+Restaurant+Miami', NULL, 'https://www.versaillesrestaurant.com/', NULL, NULL, NULL, NULL, ARRAY['miami', 'cubano', 'café', 'late night']::TEXT[], 'added_to_itinerary', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-6', 'ICA Miami', 'Arte contemporânea no Design District', 'Museu compacto, bom para combinar com lojas, arquitetura e restaurantes do Design District.', 'Encaixa em uma tarde quente ou de chuva e deixa o dia cultural sem ficar pesado.', 'museum', ARRAY['morning', 'afternoon']::event_period[], 'Miami · Design District', '61 NE 41st St, Miami, FL 33137', 120, 1, 'light', ARRAY['family', 'everyone']::best_for[], 'https://maps.google.com/?q=ICA+Miami', NULL, 'https://icamiami.org', 'https://icamiami.org/visit', NULL, NULL, NULL, ARRAY['miami', 'museu', 'design district', 'rainy day']::TEXT[], 'added_to_itinerary', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-7', 'Mandolin Aegean Bistro', 'Grego mediterrâneo', 'Jantar charmoso em pátio no Design District, bom para mesa em família.', 'Um dos jantares mais seguros para uma noite bonita sem virar balada.', 'restaurant', ARRAY['night']::event_period[], 'Miami · Design District', '4312 NE 2nd Ave, Miami, FL 33137', 120, 3, 'moderate', ARRAY['family', 'adelaide', 'geovanin']::best_for[], 'https://maps.google.com/?q=Mandolin+Aegean+Bistro', NULL, 'https://www.mandolinmiami.com', NULL, 'https://www.mandolinmiami.com', NULL, NULL, ARRAY['miami', 'jantar', 'reserva', 'grego']::TEXT[], 'added_to_itinerary', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-8', 'Lagniappe', 'Wine garden com música ao vivo', 'Pátio descontraído em Midtown com música ao vivo diariamente das 21h à meia-noite.', 'Boa saída para Caio e Sofia depois do jantar, com vibe musical sem ser club.', 'jazz', ARRAY['night']::event_period[], 'Miami · Midtown', '3425 NE 2nd Ave, Miami, FL 33137', 150, 2, 'moderate', ARRAY['caio', 'sofia', 'caio_sofia']::best_for[], 'https://maps.google.com/?q=Lagniappe+Miami', NULL, 'http://www.lagniappehouse.com/music-schedule.html', NULL, NULL, NULL, NULL, ARRAY['miami', 'jazz', 'vinho', 'música ao vivo']::TEXT[], 'added_to_itinerary', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-9', 'Genuine Jazz Night', 'Jazz no Michael''s Genuine', 'Noite de jazz no Design District com comida e coquetéis em Michael''s Genuine.', 'Opção musical mais confortável e gastronômica para quarta à noite, se a data encaixar.', 'jazz', ARRAY['night']::event_period[], 'Miami · Design District', '130 NE 40th St, Miami, FL 33137', 150, 3, 'light', ARRAY['family', 'adults']::best_for[], 'https://maps.google.com/?q=Michael''s+Genuine+Food+%26+Drink', NULL, 'https://www.miamidesigndistrict.com/event/2889/genuine-jazz-night/', NULL, NULL, NULL, NULL, ARRAY['miami', 'jazz', 'design district', 'quarta']::TEXT[], 'shortlisted', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-10', 'Wynwood Walls', 'Arte urbana e fotos', 'Murais, galerias e caminhada curta com cafés próximos.', 'Bom para Caio e Sofia, mas ainda funciona para todos se for pela manhã.', 'gallery', ARRAY['morning', 'afternoon']::event_period[], 'Miami · Wynwood', '2516 NW 2nd Ave, Miami, FL 33127', 120, 2, 'moderate', ARRAY['family', 'caio', 'sofia', 'caio_sofia']::best_for[], 'https://maps.google.com/?q=Wynwood+Walls', NULL, 'https://thewynwoodwalls.com/', NULL, NULL, NULL, NULL, ARRAY['miami', 'arte urbana', 'fotos', 'wynwood']::TEXT[], 'added_to_itinerary', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-11', 'Zak the Baker', 'Padaria no Wynwood', 'Padaria/café para encaixar antes ou depois de Wynwood Walls.', 'Pausa rápida, boa comida e deslocamento simples dentro de Wynwood.', 'cafe', ARRAY['morning', 'afternoon']::event_period[], 'Miami · Wynwood', '295 NW 26th St, Miami, FL 33127', 45, 2, 'light', ARRAY['family', 'caio']::best_for[], 'https://maps.google.com/?q=Zak+the+Baker', NULL, 'https://zakthebaker.com/', NULL, NULL, NULL, NULL, ARRAY['miami', 'café', 'padaria', 'wynwood']::TEXT[], 'shortlisted', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-12', 'Aventura Mall', 'Shopping premium', 'Shopping grande, com ar-condicionado e muitas marcas internacionais.', 'Plano forte para calor/chuva e compras de Caio + Sofia.', 'shopping', ARRAY['morning', 'afternoon']::event_period[], 'Miami · Aventura', '19501 Biscayne Blvd, Aventura, FL 33180', 240, 3, 'moderate', ARRAY['family', 'sofia', 'caio_sofia']::best_for[], 'https://maps.google.com/?q=Aventura+Mall', NULL, 'https://aventuramall.com/', NULL, NULL, NULL, NULL, ARRAY['miami', 'compras', 'shopping', 'rainy day']::TEXT[], 'added_to_itinerary', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-13', 'Club Space', 'Eletrônica e maratona de pista', 'Club conhecido pela Terrace e por noites/madrugadas longas de eletrônica.', 'Opção principal de eletrônico se Caio e Sofia quiserem uma noite intensa.', 'electronic_music', ARRAY['late_night']::event_period[], 'Miami · Downtown', '34 NE 11th St, Miami, FL 33132', 300, 3, 'intense', ARRAY['caio', 'sofia', 'caio_sofia']::best_for[], 'https://maps.google.com/?q=Club+Space+Miami', NULL, 'https://www.clubspace.com/', 'https://www.clubspace.com/', NULL, NULL, NULL, ARRAY['miami', 'eletrônica', 'late night', 'downtown']::TEXT[], 'shortlisted', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-14', 'PAMM', 'Museu à beira da baía', 'Museu de arte moderna e contemporânea com boa estrutura indoor.', 'Plano B elegante para chuva ou calor forte, com vista para Biscayne Bay.', 'rainy_day', ARRAY['morning', 'afternoon']::event_period[], 'Miami · Downtown', '1103 Biscayne Blvd, Miami, FL 33132', 150, 2, 'light', ARRAY['family', 'adelaide', 'geovanin']::best_for[], 'https://maps.google.com/?q=Perez+Art+Museum+Miami', NULL, 'https://www.pamm.org/en/visit', 'https://www.pamm.org/en/visit', NULL, NULL, NULL, ARRAY['miami', 'museu', 'chuva', 'indoor']::TEXT[], 'candidate', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-15', 'Trader Joe''s Coconut Grove', 'Mercado perto da base', 'Mercado para snacks, café da manhã, água e itens práticos.', 'Resolve a logística da casa em 30-45 minutos.', 'nearby', ARRAY['morning', 'afternoon']::event_period[], 'Miami · Coconut Grove', '2990 McFarlane Rd, Miami, FL 33133', 45, 1, 'light', ARRAY['family', 'adults']::best_for[], 'https://maps.google.com/?q=Trader+Joes+Coconut+Grove', NULL, NULL, NULL, NULL, NULL, NULL, ARRAY['miami', 'mercado', 'perto da base', 'essencial']::TEXT[], 'candidate', NULL, NULL, TRUE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-16', 'Robbie''s of Islamorada', 'Tarpons, passeios de barco e esportes aquáticos', 'Base de atividades nas Keys com tarpon feeding, glass bottom boat, kayak, paddle, snorkeling e eco tours.', 'Concentra várias experiências típicas de Islamorada em um só lugar.', 'experience', ARRAY['morning', 'afternoon']::event_period[], 'Islamorada', '77522 Overseas Hwy, Islamorada, FL 33036', 240, 2, 'moderate', ARRAY['family', 'everyone']::best_for[], 'https://maps.google.com/?q=Robbies+of+Islamorada', NULL, 'https://robbies.com/activities.htm', NULL, NULL, NULL, NULL, ARRAY['islamorada', 'keys', 'tarpon', 'barco', 'água']::TEXT[], 'added_to_itinerary', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-17', 'Theater of the Sea', 'Shows marinhos em Islamorada', 'Parque com shows contínuos de tartarugas, aves, golfinhos, leões-marinhos, peixes, tubarões e raias.', 'Atividade familiar estruturada, boa quando não quiser depender de barco/clima perfeito.', 'experience', ARRAY['morning', 'afternoon']::event_period[], 'Islamorada', '84721 Overseas Hwy, Islamorada, FL 33036', 180, 3, 'moderate', ARRAY['family', 'everyone']::best_for[], 'https://maps.google.com/?q=Theater+of+the+Sea+Islamorada', NULL, 'https://theaterofthesea.com/attractions/hours-show-schedule/', 'https://theaterofthesea.com/', NULL, NULL, NULL, ARRAY['islamorada', 'keys', 'animais', 'família']::TEXT[], 'shortlisted', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-18', 'Square Grouper Islamorada', 'Frutos do mar locais', 'Restaurante no Islamorada Marina com peixe local, coquetéis e ambiente mais arrumado.', 'Jantar de frutos do mar forte para uma noite nas Keys.', 'restaurant', ARRAY['afternoon', 'night']::event_period[], 'Islamorada', '80460 Overseas Highway, Islamorada, FL 33036', 120, 3, 'light', ARRAY['family', 'adults']::best_for[], 'https://maps.google.com/?q=Square+Grouper+Islamorada', NULL, 'https://www.squaregrouperislamorada.com/', NULL, NULL, NULL, NULL, ARRAY['islamorada', 'keys', 'frutos do mar', 'jantar']::TEXT[], 'added_to_itinerary', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-19', 'Lorelei Restaurant & Cabana Bar', 'Sunset e música ao vivo', 'Restaurante/bar na baía, conhecido por pôr do sol, happy hour e música ao vivo.', 'Primeira noite ideal em Islamorada: simples, bonito e com cara de Keys.', 'bar', ARRAY['afternoon', 'night']::event_period[], 'Islamorada', '96 Madeira Rd, Islamorada, FL 33036', 150, 2, 'light', ARRAY['family', 'everyone']::best_for[], 'https://maps.google.com/?q=Lorelei+Restaurant+Islamorada', NULL, 'https://www.loreleicabanabar.com/', NULL, NULL, NULL, NULL, ARRAY['islamorada', 'keys', 'sunset', 'música ao vivo', 'bar']::TEXT[], 'added_to_itinerary', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-20', 'Morada Bay Beach Cafe', 'Jantar na areia', 'Bistrô mediterrâneo/americano em praia com palmeiras, vista para a água e pôr do sol.', 'Jantar mais cênico da parte Islamorada, bom para fechar a viagem.', 'restaurant', ARRAY['afternoon', 'night']::event_period[], 'Islamorada', '81801 Overseas Highway, Islamorada, FL 33036', 150, 3, 'light', ARRAY['family', 'adelaide', 'geovanin']::best_for[], 'https://maps.google.com/?q=Morada+Bay+Beach+Cafe', NULL, 'https://www.moradabaykeys.com/ada/dining/beach-cafe/', NULL, NULL, NULL, NULL, ARRAY['islamorada', 'keys', 'sunset', 'jantar', 'praia']::TEXT[], 'added_to_itinerary', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-21', 'History of Diving Museum', 'Plano indoor nas Keys', 'Museu sobre a história do mergulho, aberto diariamente e útil para chuva ou calor forte.', 'Plano de 60-90 minutos, perto da base Islamorada, sem depender de mar calmo.', 'rainy_day', ARRAY['morning', 'afternoon']::event_period[], 'Islamorada', '82990 Overseas Hwy, Islamorada, FL 33036', 90, 1, 'light', ARRAY['family', 'adults']::best_for[], 'https://maps.google.com/?q=History+of+Diving+Museum', NULL, 'https://divingmuseum.org/plan-your-visit/location-hours/', NULL, NULL, NULL, NULL, ARRAY['islamorada', 'keys', 'museu', 'chuva', 'indoor']::TEXT[], 'added_to_itinerary', NULL, NULL, TRUE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-22', 'Rain Barrel Village', 'Arte local e Betsy the Lobster', 'Complexo aberto com lojas, galerias, jardins e a famosa escultura gigante de lagosta.', 'Pausa leve para compras e fotos, boa para tarde sem pressa.', 'shopping', ARRAY['morning', 'afternoon']::event_period[], 'Islamorada', '86700 Overseas Hwy, Islamorada, FL 33036', 90, 1, 'light', ARRAY['family', 'sofia', 'adelaide']::best_for[], 'https://maps.google.com/?q=Rain+Barrel+Village', NULL, 'https://rainbarrelvillage.com/', NULL, NULL, NULL, NULL, ARRAY['islamorada', 'keys', 'compras', 'arte', 'fotos']::TEXT[], 'added_to_itinerary', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-23', 'Florida Keys Brewing Co.', 'Cervejaria local', 'Cervejaria de Islamorada para fim de tarde casual, antes ou depois do jantar.', 'Boa opção de bar local quando a família quiser algo simples e perto.', 'bar', ARRAY['afternoon', 'night']::event_period[], 'Islamorada', '81611 Old Hwy, Islamorada, FL 33036', 90, 2, 'light', ARRAY['adults', 'caio', 'sofia']::best_for[], 'https://maps.google.com/?q=Florida+Keys+Brewing+Company', NULL, 'https://www.floridakeysbrewingco.com/', NULL, NULL, NULL, NULL, ARRAY['islamorada', 'keys', 'cerveja', 'bar', 'fim de tarde']::TEXT[], 'candidate', NULL, NULL, TRUE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-24', 'Kayak até Indian Key', 'Natureza e manguezais', 'Aluguel/guia de kayak ou paddle para explorar águas rasas e manguezais saindo de Robbie''s.', 'Experiência Keys mais ativa, ótima se o clima e o vento estiverem bons.', 'experience', ARRAY['morning']::event_period[], 'Islamorada', '77522 Overseas Hwy, Islamorada, FL 33036', 180, 2, 'intense', ARRAY['caio', 'sofia', 'caio_sofia']::best_for[], 'https://maps.google.com/?q=Robbies+Kayak+Shack+Islamorada', NULL, 'https://robbies.com/activities.htm', NULL, NULL, NULL, NULL, ARRAY['islamorada', 'keys', 'kayak', 'outdoors', 'ativo']::TEXT[], 'candidate', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-25', 'Glass Bottom Boat', 'Recife sem molhar todo mundo', 'Passeio de barco com fundo de vidro para ver recifes como Cheeca Rocks e Alligator Reef.', 'Alternativa mais confortável ao snorkel para a família inteira.', 'experience', ARRAY['morning', 'afternoon']::event_period[], 'Islamorada', '77522 Overseas Hwy, Islamorada, FL 33036', 120, 2, 'light', ARRAY['family', 'everyone']::best_for[], 'https://maps.google.com/?q=Robbies+Glass+Bottom+Boat+Islamorada', NULL, 'https://robbies.com/activities.htm', NULL, NULL, NULL, NULL, ARRAY['islamorada', 'keys', 'barco', 'recife', 'família']::TEXT[], 'shortlisted', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-26', 'CocoWalk', 'Perto da base Miami', 'Shopping pequeno e área de restaurantes em Coconut Grove para compras leves ou plano rápido.', 'Útil quando alguém quiser sair sem atravessar a cidade.', 'nearby', ARRAY['morning', 'afternoon', 'night']::event_period[], 'Miami · Coconut Grove', '3015 Grand Ave, Coconut Grove, FL 33133', 90, 2, 'light', ARRAY['family', 'everyone']::best_for[], 'https://maps.google.com/?q=CocoWalk+Coconut+Grove', NULL, 'https://cocowalk.com/', NULL, NULL, NULL, NULL, ARRAY['miami', 'nearby', 'coconut grove', 'compras']::TEXT[], 'candidate', NULL, NULL, TRUE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-27', 'Sweet Liberty', 'Coquetelaria em Miami Beach', 'Bar para coquetéis premiados e comida tarde da noite, bom se a noite for para Miami Beach.', 'Alternativa menos intensa que club, mas ainda com energia de noite.', 'late_night', ARRAY['night', 'late_night']::event_period[], 'Miami · Miami Beach', '237 20th St Suite B, Miami Beach, FL 33139', 120, 3, 'moderate', ARRAY['caio', 'sofia', 'caio_sofia']::best_for[], 'https://maps.google.com/?q=Sweet+Liberty+Miami+Beach', NULL, 'https://www.mysweetliberty.com/', NULL, NULL, NULL, NULL, ARRAY['miami', 'bar', 'late night', 'coquetéis']::TEXT[], 'candidate', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-28', 'Bayside Marketplace', 'Shopping e baía', 'Centro comercial com lojas, restaurantes e passeios de barco no Downtown.', 'Plano flexível para chuva, compras rápidas ou espera entre compromissos.', 'rainy_day', ARRAY['morning', 'afternoon']::event_period[], 'Miami · Downtown', '401 Biscayne Blvd, Miami, FL 33132', 120, 2, 'light', ARRAY['family', 'everyone']::best_for[], 'https://maps.google.com/?q=Bayside+Marketplace', NULL, 'https://www.baysidemarketplace.com/', NULL, NULL, NULL, NULL, ARRAY['miami', 'shopping', 'chuva', 'downtown']::TEXT[], 'candidate', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-29', 'Key Biscayne / Crandon Park', 'Praia mais tranquila', 'Praia e passeio leve ao sul de Miami, mais calmo que South Beach.', 'Bom se quiserem natureza sem ir para as Keys ainda.', 'walk', ARRAY['morning', 'afternoon']::event_period[], 'Miami · Key Biscayne', '6747 Crandon Blvd, Key Biscayne, FL 33149', 180, 1, 'light', ARRAY['family', 'adelaide', 'geovanin']::best_for[], 'https://maps.google.com/?q=Crandon+Park+Beach', NULL, NULL, NULL, NULL, NULL, NULL, ARRAY['miami', 'praia', 'outdoors', 'família']::TEXT[], 'candidate', NULL, NULL, FALSE);
INSERT INTO possible_plans (id, title, subtitle, description, why_go, category, periods, neighborhood, address, estimated_duration_minutes, price_level, intensity, best_for, google_maps_url, apple_maps_url, website_url, ticket_url, reservation_url, instagram_url, uber_url, tags, status, source, notes, is_nearby) VALUES ('pp-30', 'Tasting Florida Keys History', 'História + comidas das Keys', 'Experiência em Robbie''s com historiador local, conch chowder, fritters, rumrunner e key lime pie.', 'Opção bem específica de Islamorada para segunda/quinta, combinando cultura e comida.', 'experience', ARRAY['morning', 'afternoon']::event_period[], 'Islamorada', '77522 Overseas Hwy, Islamorada, FL 33036', 60, 2, 'light', ARRAY['family', 'adults']::best_for[], 'https://maps.google.com/?q=Robbies+of+Islamorada', NULL, 'https://robbies.com/activities.htm', 'https://fareharbor.com/embeds/book/hungrytarpon/?full-items=yes', NULL, NULL, NULL, ARRAY['islamorada', 'keys', 'história', 'comida', 'quinta']::TEXT[], 'shortlisted', NULL, NULL, FALSE);

-- day_alternative_plans
INSERT INTO day_alternative_plans (id, day_id, trigger, title, description, plan_item_ids) VALUES ('alt-22-delay', 'day-22', 'late_start', 'Chegada tarde sem compromisso', 'Ir direto para a base Miami, deixar compras e restaurantes para a manhã seguinte', ARRAY[]::TEXT[]);
INSERT INTO day_alternative_plans (id, day_id, trigger, title, description, plan_item_ids) VALUES ('alt-23-rain', 'day-23', 'rain', 'Coconut Grove indoor', 'CocoWalk, Books & Books, mercado e jantar perto da base Miami', ARRAY[]::TEXT[]);
INSERT INTO day_alternative_plans (id, day_id, trigger, title, description, plan_item_ids) VALUES ('alt-24-tired', 'day-24', 'tired', 'Little Havana mais curto', 'Fazer Versailles + Ball & Chain e pular a caminhada longa pela Calle Ocho', ARRAY[]::TEXT[]);
INSERT INTO day_alternative_plans (id, day_id, trigger, title, description, plan_item_ids) VALUES ('alt-25-rain', 'day-25', 'rain', 'PAMM + shopping indoor', 'Pérez Art Museum, Bayside Marketplace e jantar coberto', ARRAY[]::TEXT[]);
INSERT INTO day_alternative_plans (id, day_id, trigger, title, description, plan_item_ids) VALUES ('alt-25-energy', 'day-25', 'extra_energy', 'Noite extra', 'Lagniappe para Caio e Sofia; Geovanin e Adelaide descansam na base', ARRAY[]::TEXT[]);
INSERT INTO day_alternative_plans (id, day_id, trigger, title, description, plan_item_ids) VALUES ('alt-26-hot', 'day-26', 'too_hot', 'Shopping com ar-condicionado', 'Trocar Wynwood por Aventura Mall ou Bayside Marketplace', ARRAY[]::TEXT[]);
INSERT INTO day_alternative_plans (id, day_id, trigger, title, description, plan_item_ids) VALUES ('alt-27-late', 'day-27', 'late_start', 'Chegada direta em Islamorada', 'Pular paradas na estrada e ir direto para a base; Lorelei fica só se houver energia', ARRAY[]::TEXT[]);
INSERT INTO day_alternative_plans (id, day_id, trigger, title, description, plan_item_ids) VALUES ('alt-28-wind', 'day-28', 'too_hot', 'Menos água, mais shows', 'Se vento/mar atrapalhar Robbie''s, priorizar Theater of the Sea e jantar cedo', ARRAY[]::TEXT[]);
INSERT INTO day_alternative_plans (id, day_id, trigger, title, description, plan_item_ids) VALUES ('alt-29-rain', 'day-29', 'rain', 'Islamorada indoor', 'History of Diving Museum, almoço longo e compras cobertas/rápidas no Rain Barrel', ARRAY[]::TEXT[]);
INSERT INTO day_alternative_plans (id, day_id, trigger, title, description, plan_item_ids) VALUES ('alt-30-tired', 'day-30', 'tired', 'Saída sem paradas', 'Café simples, malas e deslocamento direto conforme horário de retorno', ARRAY[]::TEXT[]);

-- essential_places
INSERT INTO essential_places (id, name, type, address, area, base_name, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-lodging-miami', 'Base Miami — Coconut Grove', 'lodging', '3024 Aviation Avenue, Miami, FL 33133', 'Miami', 'Base Miami', 'Base da primeira parte da viagem, de 22/05 a 27/05.', 'https://maps.google.com/?q=3024+Aviation+Avenue+Miami+FL+33133', 'https://maps.apple.com/?address=3024+Aviation+Avenue,Miami,FL+33133', 'https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=3024+Aviation+Avenue+Miami');
INSERT INTO essential_places (id, name, type, address, area, base_name, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-lodging-islamorada', 'Base Islamorada', 'lodging', '82100 Overseas Highway, Islamorada, FL 33036, Estados Unidos', 'Islamorada', 'Base Islamorada', 'Base da segunda parte da viagem, de 27/05 a 30/05.', 'https://maps.google.com/?q=82100+Overseas+Highway+Islamorada+FL+33036', 'https://maps.apple.com/?address=82100+Overseas+Highway,Islamorada,FL+33036', 'https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=82100+Overseas+Highway+Islamorada+FL+33036');
INSERT INTO essential_places (id, name, type, address, area, base_name, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-airport', 'Miami International Airport (MIA)', 'airport', '2100 NW 42nd Ave, Miami, FL 33142', 'Travel', 'Aeroporto', 'Chegada/saída internacional; detalhes de voo serão preenchidos no app.', 'https://maps.google.com/?q=Miami+International+Airport', NULL, 'https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=Miami+International+Airport');
INSERT INTO essential_places (id, name, type, address, area, base_name, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-cnf', 'Aeroporto de Belo Horizonte / Confins (CNF)', 'airport', 'Rodovia LMG 800, Confins, MG', 'Travel', 'Saída BH', 'Ponto de partida em 22/05; preencher terminal/companhia quando confirmado.', 'https://maps.google.com/?q=Aeroporto+Internacional+de+Belo+Horizonte+Confins', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, area, base_name, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-pharmacy', 'CVS Pharmacy', 'pharmacy', '3101 Grand Ave, Coconut Grove, FL 33133', 'Miami', 'Base Miami', 'Remédios, protetor solar, itens de farmácia.', 'https://maps.google.com/?q=CVS+Coconut+Grove+3101+Grand+Ave', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, area, base_name, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-market-miami', 'Trader Joe''s Coconut Grove', 'market', '2990 McFarlane Rd, Miami, FL 33133', 'Miami', 'Base Miami', 'Mercado principal perto de casa.', 'https://maps.google.com/?q=Trader+Joes+Coconut+Grove', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, area, base_name, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-market-islamorada', 'Publix Super Market at Islamorada', 'market', '83268 Overseas Hwy, Islamorada, FL 33036', 'Islamorada', 'Base Islamorada', 'Mercado para água, café da manhã e itens de praia nas Keys.', 'https://maps.google.com/?q=Publix+Islamorada', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, area, base_name, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-hospital', 'Baptist Hospital', 'hospital', '8900 N Kendall Dr, Miami, FL 33176', 'Miami', 'Emergência Miami', 'Emergência — ligar 911 nos EUA.', 'https://maps.google.com/?q=Baptist+Hospital+Miami', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, area, base_name, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-hospital-keys', 'Fishermen''s Community Hospital', 'hospital', '3301 Overseas Hwy, Marathon, FL 33050', 'Islamorada', 'Emergência Keys', 'Referência hospitalar na região das Keys; em emergência, ligar 911.', 'https://maps.google.com/?q=Fishermen%27s+Community+Hospital+Marathon', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, area, base_name, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-shopping', 'CocoWalk', 'shopping', '3015 Grand Ave, Coconut Grove, FL 33133', 'Miami', 'Base Miami', 'Shopping pequeno a pé do Grove.', 'https://maps.google.com/?q=CocoWalk+Coconut+Grove', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, area, base_name, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-consulate', 'Consulado Geral do Brasil', 'consulate', '80 SW 8th St, Miami, FL 33130', 'Miami', 'Documentos', 'Emergências consulares.', 'https://maps.google.com/?q=Brazilian+Consulate+Miami', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, area, base_name, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-meeting-miami', 'Ponto de encontro Miami — CocoWalk', 'meeting_point', '3015 Grand Ave, Coconut Grove, FL 33133', 'Miami', 'Base Miami', 'Combinado da família se alguém se perder.', 'https://maps.google.com/?q=CocoWalk+Coconut+Grove', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, area, base_name, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-meeting-islamorada', 'Ponto de encontro Islamorada — Rain Barrel Village', 'meeting_point', '86700 Overseas Hwy, Islamorada, FL 33036', 'Islamorada', 'Base Islamorada', 'Ponto fácil de reconhecer por causa da Betsy the Lobster.', 'https://maps.google.com/?q=Rain+Barrel+Village', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, area, base_name, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-apple', 'Apple Store — Lincoln Road', 'shopping', '1021 Lincoln Rd, Miami Beach, FL 33139', 'Miami', 'Suporte', 'Suporte Apple se precisar.', 'https://maps.google.com/?q=Apple+Store+Lincoln+Road', NULL, NULL);
INSERT INTO essential_places (id, name, type, address, area, base_name, notes, google_maps_url, apple_maps_url, uber_url) VALUES ('ep-robbies', 'Robbie''s of Islamorada', 'meeting_point', '77522 Overseas Hwy, Islamorada, FL 33036', 'Islamorada', 'Atividades Keys', 'Tarpons, passeios de barco, kayak, snorkeling e alimentação.', 'https://maps.google.com/?q=Robbies+of+Islamorada', NULL, NULL);

-- travel_documents
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-flights', 'Detalhes dos voos — a preencher', 'flight', NULL, 'Não há dados sensíveis salvos. Preencher companhia, número do voo, horários e assentos no app.');
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-lodging-miami', 'Hospedagem Miami — Coconut Grove', 'lodging', NULL, 'Base 22/05-27/05. Endereço: 3024 Aviation Avenue, Miami, FL 33133.');
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-lodging-islamorada', 'Hospedagem Islamorada', 'lodging', NULL, 'Base 27/05-30/05. Endereço: 82100 Overseas Highway, Islamorada, FL 33036, Estados Unidos.');
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-robbies', 'Robbie''s of Islamorada — atividades', 'ticket', 'https://robbies.com/activities.htm', 'Escolher entre tarpon feeding, glass bottom boat, kayak/paddle, snorkeling ou eco tour.');
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-mandolin', 'Reserva Mandolin — 25/05', 'reservation', 'https://www.mandolinmiami.com', 'Mesa para 4 pessoas; confirmar horário.');
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-club-space', 'Club Space — line-up/ingresso opcional', 'ticket', 'https://www.clubspace.com/', 'Comprar somente se Caio e Sofia confirmarem disposição e line-up.');
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-morada-bay', 'Morada Bay Beach Cafe — 29/05', 'reservation', 'https://www.moradabaykeys.com/ada/dining/beach-cafe/', 'Restaurante na areia; confirmar política de reserva.');
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-insurance', 'Seguro viagem', 'insurance', NULL, 'Apólice no e-mail — cobertura médica internacional');
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-ica', 'ICA Miami — visita', 'ticket', 'https://icamiami.org/visit', 'Entrada gratuita, sem reserva necessária');
INSERT INTO travel_documents (id, title, type, url, notes) VALUES ('doc-theater-sea', 'Theater of the Sea — horários', 'ticket', 'https://theaterofthesea.com/attractions/hours-show-schedule/', 'Shows contínuos; chegar antes das 14h para aproveitar melhor.');

-- trip_tasks
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-1', 'Preencher detalhes do voo de ida BH → Miami', '2026-05-22', 'evt-22-flight-placeholder', 'caio', 'open', 'high');
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-2', 'Confirmar check-in e instruções da base Miami', '2026-05-22', 'evt-22-arrival-miami', 'geovanin', 'open', 'high');
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-3', 'Reservar Mandolin ou alternativa no Design District', '2026-05-25', 'evt-25-mandolin', 'adelaide', 'open', 'medium');
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-4', 'Conferir line-up e ingresso do Club Space', '2026-05-26', 'evt-26-club-space', 'caio', 'open', 'medium');
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-5', 'Confirmar transporte Miami → Islamorada', '2026-05-27', 'evt-27-road-to-keys', NULL, 'open', 'high');
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-6', 'Reservar/checar atividade principal em Robbie''s', '2026-05-28', 'evt-28-robbies', 'sofia', 'open', 'medium');
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-7', 'Confirmar jantar no Morada Bay ou Square Grouper', '2026-05-28', 'evt-29-morada-bay', 'adelaide', 'open', 'medium');
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-8', 'Preencher detalhes de retorno/saída em 30/05', '2026-05-30', 'evt-30-checkout', 'caio', 'open', 'high');
INSERT INTO trip_tasks (id, title, due_date, related_plan_id, assigned_to, status, priority) VALUES ('task-9', 'Comprar eSIM / chip de dados EUA', '2026-05-22', NULL, NULL, 'open', 'high');

-- night_events
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-1', '2026-05-24', 'jazz', 'Música ao vivo — Ball & Chain', 'Ball & Chain', 'Little Havana', '20:30', '01:00', 'Confirmar evento/entrada no site', 'Casual elegante', 'moderate', FALSE, 'https://maps.google.com/?q=Ball+and+Chain+Little+Havana', NULL, 'https://ballandchainmiami.com/', NULL, NULL, 'added_to_itinerary', NULL);
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-2', '2026-05-23', 'bar', 'Sunset — Regatta Grove', 'Regatta Grove', 'Coconut Grove', '18:00', NULL, 'Sem entrada; consumo no local', NULL, 'light', FALSE, 'https://maps.google.com/?q=Regatta+Grove', NULL, 'https://regattagrove.com/', NULL, NULL, 'added_to_itinerary', NULL);
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-3', '2026-05-25', 'jazz', 'John Yarling — Lagniappe', 'Lagniappe', 'Midtown', '21:30', '00:00', 'Sem reserva; consumo no local', 'Casual', 'moderate', FALSE, 'https://maps.google.com/?q=Lagniappe+Miami', NULL, 'http://www.lagniappehouse.com/music-schedule.html', NULL, NULL, 'added_to_itinerary', 'Programação oficial lista música ao vivo todas as noites, 21h-0h.');
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-4', '2026-05-26', 'jazz', 'Lemon City Trio — Lagniappe', 'Lagniappe', 'Midtown', '21:00', '00:00', 'Sem reserva; consumo no local', NULL, 'moderate', FALSE, 'https://maps.google.com/?q=Lagniappe+Miami', NULL, 'http://www.lagniappehouse.com/music-schedule.html', NULL, NULL, 'candidate', NULL);
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-5', '2026-05-26', 'electronic', 'Noite opcional — Club Space', 'Club Space', 'Downtown', '23:30', '06:00', 'Comprar só após confirmar line-up', 'Casual / clubwear', 'intense', FALSE, 'https://maps.google.com/?q=Club+Space+Miami', NULL, 'https://www.clubspace.com/', 'https://www.clubspace.com/', NULL, 'shortlisted', NULL);
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-6', '2026-05-27', 'bar', 'Sunset — Lorelei', 'Lorelei Restaurant & Cabana Bar', 'Islamorada', '18:00', NULL, 'Happy hour e consumo no local', NULL, 'light', FALSE, 'https://maps.google.com/?q=Lorelei+Restaurant+Islamorada', NULL, 'https://www.loreleicabanabar.com/', NULL, NULL, 'added_to_itinerary', NULL);
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-7', '2026-05-28', 'bar', 'Cerveja local — Florida Keys Brewing Co.', 'Florida Keys Brewing Co.', 'Islamorada', '17:30', NULL, 'Consumo no local', NULL, 'light', FALSE, 'https://maps.google.com/?q=Florida+Keys+Brewing+Company', NULL, 'https://www.floridakeysbrewingco.com/', NULL, NULL, 'candidate', NULL);
INSERT INTO night_events (id, date, type, title, venue, neighborhood, start_time, end_time, price_info, dress_code, intensity, buy_ahead, google_maps_url, apple_maps_url, website_url, ticket_url, uber_url, status, notes) VALUES ('ne-8', '2026-05-29', 'bar', 'Jantar sunset — Morada Bay', 'Morada Bay Beach Cafe', 'Islamorada', '18:30', NULL, 'Jantar na areia; reservas limitadas', NULL, 'light', FALSE, 'https://maps.google.com/?q=Morada+Bay+Beach+Cafe', NULL, 'https://www.moradabaykeys.com/ada/dining/beach-cafe/', NULL, NULL, 'added_to_itinerary', NULL);

-- flights
INSERT INTO flights (id, passenger_id, passenger_name, route, "from", "to", flight_number, seat, terminal, gate, boarding_time, departure_time, arrival_time, date, status, confirmation_code) VALUES ('flt-caio-out', 'caio', 'CAIO', 'Belo Horizonte → Miami', 'BHZ/CNF', 'MIA', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', '2026-05-22', 'pending', NULL);
INSERT INTO flights (id, passenger_id, passenger_name, route, "from", "to", flight_number, seat, terminal, gate, boarding_time, departure_time, arrival_time, date, status, confirmation_code) VALUES ('flt-geovanin-out', 'geovanin', 'GEOVANIN', 'Belo Horizonte → Miami', 'BHZ/CNF', 'MIA', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', '2026-05-22', 'pending', NULL);
INSERT INTO flights (id, passenger_id, passenger_name, route, "from", "to", flight_number, seat, terminal, gate, boarding_time, departure_time, arrival_time, date, status, confirmation_code) VALUES ('flt-adelaide-out', 'adelaide', 'ADELAIDE', 'Belo Horizonte → Miami', 'BHZ/CNF', 'MIA', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', '2026-05-22', 'pending', NULL);
INSERT INTO flights (id, passenger_id, passenger_name, route, "from", "to", flight_number, seat, terminal, gate, boarding_time, departure_time, arrival_time, date, status, confirmation_code) VALUES ('flt-sofia-out', 'sofia', 'SOFIA', 'Belo Horizonte → Miami', 'BHZ/CNF', 'MIA', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', '2026-05-22', 'pending', NULL);
INSERT INTO flights (id, passenger_id, passenger_name, route, "from", "to", flight_number, seat, terminal, gate, boarding_time, departure_time, arrival_time, date, status, confirmation_code) VALUES ('flt-caio-ret', 'caio', 'CAIO', 'Miami → Belo Horizonte', 'MIA', 'BHZ/CNF', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', '2026-05-30', 'pending', NULL);
INSERT INTO flights (id, passenger_id, passenger_name, route, "from", "to", flight_number, seat, terminal, gate, boarding_time, departure_time, arrival_time, date, status, confirmation_code) VALUES ('flt-geovanin-ret', 'geovanin', 'GEOVANIN', 'Miami → Belo Horizonte', 'MIA', 'BHZ/CNF', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', '2026-05-30', 'pending', NULL);
INSERT INTO flights (id, passenger_id, passenger_name, route, "from", "to", flight_number, seat, terminal, gate, boarding_time, departure_time, arrival_time, date, status, confirmation_code) VALUES ('flt-adelaide-ret', 'adelaide', 'ADELAIDE', 'Miami → Belo Horizonte', 'MIA', 'BHZ/CNF', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', '2026-05-30', 'pending', NULL);
INSERT INTO flights (id, passenger_id, passenger_name, route, "from", "to", flight_number, seat, terminal, gate, boarding_time, departure_time, arrival_time, date, status, confirmation_code) VALUES ('flt-sofia-ret', 'sofia', 'SOFIA', 'Miami → Belo Horizonte', 'MIA', 'BHZ/CNF', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', 'A definir', '2026-05-30', 'pending', NULL);

-- memories
INSERT INTO memories (id, day_id, date, best_moment, best_food, favorite_place, rating, notes, photo_url) VALUES ('mem-1', 'day-23', '2026-05-23', '', '', '', 0, '', NULL);
INSERT INTO memories (id, day_id, date, best_moment, best_food, favorite_place, rating, notes, photo_url) VALUES ('mem-2', 'day-28', '2026-05-28', '', '', '', 0, '', NULL);

-- travel_timeline_items
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-dep-1', 'A definir', 'Sair para o aeroporto em Belo Horizonte', '2026-05-22', TRUE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-dep-2', 'A definir', 'Check-in e despacho de bagagem', '2026-05-22', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-dep-3', 'A definir', 'Embarque para Miami', '2026-05-22', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-dep-4', 'A definir', 'Chegada em Miami, imigração e bagagem', '2026-05-22', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-dep-5', 'A definir', 'Uber/carro até a base Miami', '2026-05-22', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-keys-1', '09:30', 'Organizar malas e check-out da base Miami', '2026-05-27', TRUE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-keys-2', '10:00', 'Sair de Miami rumo a Islamorada', '2026-05-27', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-keys-3', '12:00', 'Parada flexível na Overseas Highway', '2026-05-27', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-keys-4', '14:00', 'Chegada à base Islamorada', '2026-05-27', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-ret-1', '09:30', 'Check-out da base Islamorada', '2026-05-30', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-ret-2', 'A definir', 'Sair de Islamorada conforme voo/retorno', '2026-05-30', TRUE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-ret-3', 'A definir', 'Chegar ao aeroporto ou próximo trecho', '2026-05-30', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-ret-4', 'A definir', 'Check-in e bagagem', '2026-05-30', FALSE);
INSERT INTO travel_timeline_items (id, time, label, date, is_departure) VALUES ('tl-ret-5', 'A definir', 'Embarque/retorno', '2026-05-30', FALSE);
