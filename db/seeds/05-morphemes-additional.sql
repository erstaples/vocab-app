-- Additional morphemes for word clues methodology

-- Roots (15 new)
INSERT INTO morphemes (morpheme, type, meaning, origin) VALUES
('loqu', 'root', 'speak', 'Latin'),
('err', 'root', 'wander', 'Latin'),
('bell', 'root', 'war', 'Latin'),
('cac', 'root', 'bad', 'Greek'),
('acer', 'root', 'sharp, bitter', 'Latin'),
('magn', 'root', 'great', 'Latin'),
('tacit', 'root', 'silent', 'Latin'),
('tenac', 'root', 'hold tightly', 'Latin'),
('plac', 'root', 'please, calm', 'Latin'),
('pugn', 'root', 'fight', 'Latin'),
('greg', 'root', 'flock, group', 'Latin'),
('icon', 'root', 'image', 'Greek'),
('fatig', 'root', 'tire', 'Latin'),
('clast', 'root', 'break', 'Greek'),
('anthrop', 'root', 'human', 'Greek')
ON CONFLICT (morpheme, COALESCE(origin, '')) DO NOTHING;

-- Prefixes (3 new)
INSERT INTO morphemes (morpheme, type, meaning, origin) VALUES
('ob-', 'prefix', 'against, toward', 'Latin'),
('per-', 'prefix', 'through, thoroughly', 'Latin'),
('caco-', 'prefix', 'bad', 'Greek')
ON CONFLICT (morpheme, COALESCE(origin, '')) DO NOTHING;

-- Suffixes (2 new)
INSERT INTO morphemes (morpheme, type, meaning, origin) VALUES
('-acious', 'suffix', 'inclined to', 'Latin'),
('-ate', 'suffix', 'to make', 'Latin')
ON CONFLICT (morpheme, COALESCE(origin, '')) DO NOTHING;
