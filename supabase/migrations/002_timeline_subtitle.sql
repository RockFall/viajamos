-- Detalhe secundário na linha do dia (ex.: placa Uber, grupo de embarque)
ALTER TABLE travel_timeline_items
  ADD COLUMN IF NOT EXISTS subtitle TEXT;
