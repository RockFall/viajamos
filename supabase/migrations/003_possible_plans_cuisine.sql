-- Subtipo de cozinha para planos do tipo restaurante
ALTER TABLE possible_plans
  ADD COLUMN IF NOT EXISTS cuisine TEXT;
