-- Viajamos — static seed data
-- Run after RUN_IN_SUPABASE_SCHEMA.sql

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
