-- Complete morpheme coverage for all vocabulary words
-- This file adds missing morphemes and creates associations for all words

-- ============================================
-- PART 1: Add missing morphemes
-- ============================================

-- Additional prefixes
INSERT INTO morphemes (morpheme, type, meaning, origin) VALUES
('com-', 'prefix', 'together, with', 'Latin'),
('con-', 'prefix', 'together, with', 'Latin'),
('e-', 'prefix', 'out of', 'Latin'),
('ec-', 'prefix', 'out of', 'Greek'),
('em-', 'prefix', 'in, into', 'Latin'),
('en-', 'prefix', 'in, into', 'Latin'),
('apo-', 'prefix', 'away from', 'Greek'),
('cata-', 'prefix', 'down', 'Greek'),
('para-', 'prefix', 'beside, beyond', 'Greek'),
('eso-', 'prefix', 'within', 'Greek'),
('ne-', 'prefix', 'not', 'Latin'),
('se-', 'prefix', 'apart', 'Latin')
ON CONFLICT (morpheme, COALESCE(origin, '')) DO NOTHING;

-- Additional roots
INSERT INTO morphemes (morpheme, type, meaning, origin) VALUES
('strus', 'root', 'push, build', 'Latin'),
('acu', 'root', 'sharp', 'Latin'),
('mon', 'root', 'warn, advise', 'Latin'),
('alacr', 'root', 'eager, lively', 'Latin'),
('them', 'root', 'place, set', 'Greek'),
('cryph', 'root', 'hide, secret', 'Greek'),
('arch', 'root', 'ancient, chief', 'Greek'),
('ardu', 'root', 'steep, difficult', 'Latin'),
('spers', 'root', 'scatter, sprinkle', 'Latin'),
('sid', 'root', 'sit, settle', 'Latin'),
('spic', 'root', 'look, see', 'Latin'),
('aust', 'root', 'harsh, severe', 'Greek'),
('avar', 'root', 'greedy', 'Latin'),
('cand', 'root', 'white, bright, sincere', 'Latin'),
('capr', 'root', 'goat, whim', 'Latin'),
('lys', 'root', 'loosen, break down', 'Greek'),
('caust', 'root', 'burn', 'Greek'),
('cland', 'root', 'secret, hidden', 'Latin'),
('ag', 'root', 'drive, do, act', 'Latin'),
('comit', 'root', 'accompany', 'Latin'),
('flagr', 'root', 'burn, blaze', 'Latin'),
('nigr', 'root', 'black', 'Latin'),
('rid', 'root', 'laugh', 'Latin'),
('sult', 'root', 'leap, jump', 'Latin'),
('doc', 'root', 'teach', 'Latin'),
('lat', 'root', 'carry, bear', 'Latin'),
('par', 'root', 'equal', 'Latin'),
('simul', 'root', 'like, pretend', 'Latin'),
('aemul', 'root', 'rival, strive', 'Latin'),
('nerv', 'root', 'nerve, sinew', 'Latin'),
('enigm', 'root', 'riddle, puzzle', 'Greek'),
('rud', 'root', 'rough, raw', 'Latin'),
('phem', 'root', 'speak, voice', 'Greek'),
('tenu', 'root', 'thin, slight', 'Latin'),
('facet', 'root', 'jest, wit', 'Latin'),
('fec', 'root', 'produce, fruitful', 'Latin'),
('garr', 'root', 'chatter, talk', 'Latin'),
('hegemon', 'root', 'leader, guide', 'Greek'),
('pecun', 'root', 'money', 'Latin'),
('cho', 'root', 'begin', 'Latin'),
('genu', 'root', 'birth, kind', 'Latin'),
('und', 'root', 'wave, flow', 'Latin'),
('lacon', 'root', 'Spartan, brief', 'Greek'),
('metic', 'root', 'fear, careful', 'Latin'),
('fas', 'root', 'divine law, right', 'Latin'),
('digm', 'root', 'show, example', 'Greek'),
('parsim', 'root', 'spare, frugal', 'Latin'),
('pauc', 'root', 'few, little', 'Latin'),
('funct', 'root', 'perform', 'Latin'),
('phlegm', 'root', 'inflammation, calm', 'Greek'),
('cipit', 'root', 'head', 'Latin'),
('coc', 'root', 'cook, ripen', 'Latin'),
('sumpt', 'root', 'take', 'Latin'),
('prob', 'root', 'good, honest', 'Latin'),
('flig', 'root', 'strike', 'Latin'),
('pros', 'root', 'prose, straightforward', 'Latin'),
('cond', 'root', 'hide, store', 'Latin'),
('fract', 'root', 'break', 'Latin'),
('sangu', 'root', 'blood', 'Latin'),
('sardon', 'root', 'bitter, scornful', 'Greek'),
('dul', 'root', 'diligent', 'Latin'),
('spur', 'root', 'false, illegitimate', 'Latin'),
('phant', 'root', 'show, appear', 'Greek'),
('temer', 'root', 'rash, reckless', 'Latin'),
('trepid', 'root', 'tremble', 'Latin'),
('truc', 'root', 'fierce, savage', 'Latin'),
('unct', 'root', 'oil, anoint', 'Latin'),
('venal', 'root', 'for sale', 'Latin'),
('vicar', 'root', 'substitute, deputy', 'Latin'),
('vitriol', 'root', 'glass, caustic', 'Latin'),
('zeal', 'root', 'eager, fervent', 'Greek'),
('crypt', 'root', 'hide, secret', 'Greek'),
('scet', 'root', 'exercise, practice', 'Greek'),
('brusqu', 'root', 'rough, abrupt', 'French'),
('quixot', 'root', 'idealistic, impractical', 'Spanish'),
('hackney', 'root', 'overused', 'English'),
('conund', 'root', 'puzzle, riddle', 'Latin')
ON CONFLICT (morpheme, COALESCE(origin, '')) DO NOTHING;

-- Additional suffixes
INSERT INTO morphemes (morpheme, type, meaning, origin) VALUES
('-or', 'suffix', 'state of, one who', 'Latin'),
('-ulent', 'suffix', 'full of, tending to', 'Latin'),
('-ine', 'suffix', 'relating to, like', 'Latin'),
('-ory', 'suffix', 'relating to, place of', 'Latin'),
('-age', 'suffix', 'action, state', 'Latin'),
('-ulous', 'suffix', 'tending to', 'Latin'),
('-ite', 'suffix', 'one who, quality', 'Latin'),
('-id', 'suffix', 'state of', 'Latin'),
('-ish', 'suffix', 'somewhat, inclined to', 'Old English'),
('-escent', 'suffix', 'becoming', 'Latin'),
('-uous', 'suffix', 'full of', 'Latin'),
('-ile', 'suffix', 'capable of', 'Latin')
ON CONFLICT (morpheme, COALESCE(origin, '')) DO NOTHING;

-- ============================================
-- PART 2: Word-morpheme associations for ALL remaining words
-- ============================================

-- abstruse: ab- (away) + strus (push) = "pushed away" (hidden)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'abstruse' AND m.morpheme = 'ab-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'abstruse' AND m.morpheme = 'strus'
ON CONFLICT DO NOTHING;

-- acumen: acu (sharp) + -men = "sharpness" (mental sharpness)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'acumen' AND m.morpheme = 'acu'
ON CONFLICT DO NOTHING;

-- admonish: ad- (to) + mon (warn) + -ish = "to warn toward"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'admonish' AND m.morpheme = 'ad-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'admonish' AND m.morpheme = 'mon'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'admonish' AND m.morpheme = '-ish'
ON CONFLICT DO NOTHING;

-- aesthetic: a- (relating to) + sens (feel) + -ic = "relating to feeling/perception"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'aesthetic' AND m.morpheme = 'sens'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'aesthetic' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- alacrity: alacr (eager) + -ity = "state of eagerness"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'alacrity' AND m.morpheme = 'alacr'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'alacrity' AND m.morpheme = '-ity'
ON CONFLICT DO NOTHING;

-- anathema: ana- + them (place) = "thing placed apart" (cursed thing)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'anathema' AND m.morpheme = 'them'
ON CONFLICT DO NOTHING;

-- apocryphal: apo- (away) + cryph (hide) + -al = "hidden away"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'apocryphal' AND m.morpheme = 'apo-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'apocryphal' AND m.morpheme = 'crypt'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'apocryphal' AND m.morpheme = '-al'
ON CONFLICT DO NOTHING;

-- archaic: arch (ancient) + -ic = "relating to ancient"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'archaic' AND m.morpheme = 'arch'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'archaic' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- arduous: ardu (steep) + -ous = "full of steepness/difficulty"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'arduous' AND m.morpheme = 'ardu'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'arduous' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- ascetic: a- (without) + scet (luxury/exercise) + -ic = "practicing self-denial"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'ascetic' AND m.morpheme = 'scet'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'ascetic' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- aspersion: a- + spers (scatter) + -ion = "scattering upon" (false charges)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'aspersion' AND m.morpheme = 'spers'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'aspersion' AND m.morpheme = '-ion'
ON CONFLICT DO NOTHING;

-- assiduous: ad- (to) + sid (sit) + -ous = "sitting close to" (diligent)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'assiduous' AND m.morpheme = 'ad-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'assiduous' AND m.morpheme = 'sid'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'assiduous' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- auspicious: au- + spic (look) + -ous = "looking at birds" (favorable omens)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'auspicious' AND m.morpheme = 'spic'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'auspicious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- austere: aust (harsh) = "harsh, severe"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'austere' AND m.morpheme = 'aust'
ON CONFLICT DO NOTHING;

-- avarice: avar (greedy) = "greediness"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'avarice' AND m.morpheme = 'avar'
ON CONFLICT DO NOTHING;

-- brusque: brusqu (rough) = "abrupt, rough"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'brusque' AND m.morpheme = 'brusqu'
ON CONFLICT DO NOTHING;

-- candor: cand (white/bright) + -or = "brightness, sincerity"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'candor' AND m.morpheme = 'cand'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'candor' AND m.morpheme = '-or'
ON CONFLICT DO NOTHING;

-- capricious: capr (goat) + -ious = "goat-like" (unpredictable)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'capricious' AND m.morpheme = 'capr'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'capricious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- catalyst: cata- (down) + lys (loosen) + -ist = "one who loosens/breaks down"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'catalyst' AND m.morpheme = 'cata-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'catalyst' AND m.morpheme = 'lys'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'catalyst' AND m.morpheme = '-ist'
ON CONFLICT DO NOTHING;

-- caustic: caust (burn) + -ic = "relating to burning"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'caustic' AND m.morpheme = 'caust'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'caustic' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- clandestine: cland (secret) + -ine = "secret, hidden"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'clandestine' AND m.morpheme = 'cland'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'clandestine' AND m.morpheme = '-ine'
ON CONFLICT DO NOTHING;

-- cogent: co- (together) + ag (drive) + -ent = "driving together" (compelling)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'cogent' AND m.morpheme = 'co-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'cogent' AND m.morpheme = 'ag'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'cogent' AND m.morpheme = '-ent'
ON CONFLICT DO NOTHING;

-- complacent: com- (together) + plac (please) + -ent = "pleasing oneself"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'complacent' AND m.morpheme = 'com-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'complacent' AND m.morpheme = 'plac'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'complacent' AND m.morpheme = '-ent'
ON CONFLICT DO NOTHING;

-- concomitant: con- (together) + comit (accompany) + -ant = "accompanying together"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'concomitant' AND m.morpheme = 'con-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'concomitant' AND m.morpheme = 'comit'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'concomitant' AND m.morpheme = '-ant'
ON CONFLICT DO NOTHING;

-- conflagration: con- (together) + flagr (burn) + -ation = "burning together" (great fire)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'conflagration' AND m.morpheme = 'con-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'conflagration' AND m.morpheme = 'flagr'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'conflagration' AND m.morpheme = '-ation'
ON CONFLICT DO NOTHING;

-- conundrum: conund (puzzle) = "a puzzle, riddle"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'conundrum' AND m.morpheme = 'conund'
ON CONFLICT DO NOTHING;

-- denigrate: de- (down) + nigr (black) + -ate = "to blacken"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'denigrate' AND m.morpheme = 'de-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'denigrate' AND m.morpheme = 'nigr'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'denigrate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- deride: de- (down) + rid (laugh) = "to laugh down at"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'deride' AND m.morpheme = 'de-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'deride' AND m.morpheme = 'rid'
ON CONFLICT DO NOTHING;

-- desultory: de- (down) + sult (leap) + -ory = "leaping down" (random, unfocused)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'desultory' AND m.morpheme = 'de-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'desultory' AND m.morpheme = 'sult'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'desultory' AND m.morpheme = '-ory'
ON CONFLICT DO NOTHING;

-- didactic: doc (teach) + -ic = "relating to teaching"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'didactic' AND m.morpheme = 'doc'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'didactic' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- dilatory: di- (apart) + lat (carry) + -ory = "carrying apart" (delaying)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'dilatory' AND m.morpheme = 'dis-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'dilatory' AND m.morpheme = 'lat'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'dilatory' AND m.morpheme = '-ory'
ON CONFLICT DO NOTHING;

-- disparage: dis- (apart) + par (equal) + -age = "to make unequal" (belittle)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'disparage' AND m.morpheme = 'dis-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'disparage' AND m.morpheme = 'par'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'disparage' AND m.morpheme = '-age'
ON CONFLICT DO NOTHING;

-- dissemble: dis- (apart) + simul (like) = "to be unlike" (disguise)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'dissemble' AND m.morpheme = 'dis-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'dissemble' AND m.morpheme = 'simul'
ON CONFLICT DO NOTHING;

-- eclectic: ec- (out) + lect (choose) + -ic = "choosing out from" (selective)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'eclectic' AND m.morpheme = 'ec-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'eclectic' AND m.morpheme = 'lect'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'eclectic' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- emulate: aemul (rival) + -ate = "to rival, imitate"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'emulate' AND m.morpheme = 'aemul'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'emulate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- enervate: e- (out) + nerv (nerve) + -ate = "to take out nerve" (weaken)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'enervate' AND m.morpheme = 'e-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'enervate' AND m.morpheme = 'nerv'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'enervate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- enigmatic: enigm (riddle) + -atic = "like a riddle"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'enigmatic' AND m.morpheme = 'enigm'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'enigmatic' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- erudite: e- (out) + rud (rough) + -ite = "polished out of roughness" (learned)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'erudite' AND m.morpheme = 'e-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'erudite' AND m.morpheme = 'rud'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'erudite' AND m.morpheme = '-ite'
ON CONFLICT DO NOTHING;

-- esoteric: eso- (within) + -ic = "relating to inner circle"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'esoteric' AND m.morpheme = 'eso-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'esoteric' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- euphemism: eu- (good) + phem (speak) + -ism = "speaking good" (mild expression)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'euphemism' AND m.morpheme = 'eu-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'euphemism' AND m.morpheme = 'phem'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'euphemism' AND m.morpheme = '-ism'
ON CONFLICT DO NOTHING;

-- exigent: ex- (out) + ag (drive) + -ent = "driving out" (urgent, demanding)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'exigent' AND m.morpheme = 'ex-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'exigent' AND m.morpheme = 'ag'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'exigent' AND m.morpheme = '-ent'
ON CONFLICT DO NOTHING;

-- expedient: ex- (out) + ped (foot) + -ient = "freeing the foot" (practical)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'expedient' AND m.morpheme = 'ex-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'expedient' AND m.morpheme = 'ped'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'expedient' AND m.morpheme = '-ent'
ON CONFLICT DO NOTHING;

-- extenuate: ex- (out) + tenu (thin) + -ate = "to make thin" (lessen)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'extenuate' AND m.morpheme = 'ex-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'extenuate' AND m.morpheme = 'tenu'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'extenuate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- facetious: facet (jest) + -ious = "full of jest"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'facetious' AND m.morpheme = 'facet'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'facetious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- fecund: fec (produce) = "fruitful, productive"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'fecund' AND m.morpheme = 'fec'
ON CONFLICT DO NOTHING;

-- garrulous: garr (chatter) + -ulous = "tending to chatter"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'garrulous' AND m.morpheme = 'garr'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'garrulous' AND m.morpheme = '-ulous'
ON CONFLICT DO NOTHING;

-- hackneyed: hackney (overused) = "overused, unoriginal"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'hackneyed' AND m.morpheme = 'hackney'
ON CONFLICT DO NOTHING;

-- hegemony: hegemon (leader) + -y = "leadership, dominance"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'hegemony' AND m.morpheme = 'hegemon'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'hegemony' AND m.morpheme = '-y'
ON CONFLICT DO NOTHING;

-- impecunious: in- (not) + pecun (money) + -ious = "not having money"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'impecunious' AND m.morpheme = 'in-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'impecunious' AND m.morpheme = 'pecun'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'impecunious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- inchoate: in- (in) + cho (begin) + -ate = "just beginning"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'inchoate' AND m.morpheme = 'in-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'inchoate' AND m.morpheme = 'cho'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'inchoate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- ingenuous: in- (in) + genu (birth) + -ous = "inborn" (innocent, naive)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'ingenuous' AND m.morpheme = 'in-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'ingenuous' AND m.morpheme = 'genu'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'ingenuous' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- inundate: in- (in) + und (wave) + -ate = "to send waves into" (flood)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'inundate' AND m.morpheme = 'in-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'inundate' AND m.morpheme = 'und'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'inundate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- laconic: lacon (Spartan) + -ic = "Spartan-like" (brief, terse)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'laconic' AND m.morpheme = 'lacon'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'laconic' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- meticulous: metic (fear) + -ulous = "fearfully careful"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'meticulous' AND m.morpheme = 'metic'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'meticulous' AND m.morpheme = '-ulous'
ON CONFLICT DO NOTHING;

-- nefarious: ne- (not) + fas (divine law) + -ious = "not lawful" (wicked)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'nefarious' AND m.morpheme = 'ne-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'nefarious' AND m.morpheme = 'fas'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'nefarious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- paradigm: para- (beside) + digm (show) = "pattern shown beside"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'paradigm' AND m.morpheme = 'para-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'paradigm' AND m.morpheme = 'digm'
ON CONFLICT DO NOTHING;

-- parsimonious: parsim (spare) + -onious = "very sparing" (stingy)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'parsimonious' AND m.morpheme = 'parsim'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'parsimonious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- paucity: pauc (few) + -ity = "state of having few"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'paucity' AND m.morpheme = 'pauc'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'paucity' AND m.morpheme = '-ity'
ON CONFLICT DO NOTHING;

-- pedantic: ped (teach) + -antic = "overly focused on teaching"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'pedantic' AND m.morpheme = 'ped'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'pedantic' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- perfunctory: per- (through) + funct (perform) + -ory = "performing through" (mechanical)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'perfunctory' AND m.morpheme = 'per-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'perfunctory' AND m.morpheme = 'funct'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'perfunctory' AND m.morpheme = '-ory'
ON CONFLICT DO NOTHING;

-- phlegmatic: phlegm (inflammation/calm) + -atic = "having phlegm" (calm, unemotional)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'phlegmatic' AND m.morpheme = 'phlegm'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'phlegmatic' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- precipitous: pre- (before) + cipit (head) + -ous = "headfirst" (steep, hasty)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'precipitous' AND m.morpheme = 'pre-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'precipitous' AND m.morpheme = 'cipit'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'precipitous' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- precocious: pre- (before) + coc (ripen) + -ious = "ripening before" (advanced)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'precocious' AND m.morpheme = 'pre-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'precocious' AND m.morpheme = 'coc'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'precocious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- presumptuous: pre- (before) + sumpt (take) + -uous = "taking before" (overconfident)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'presumptuous' AND m.morpheme = 'pre-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'presumptuous' AND m.morpheme = 'sumpt'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'presumptuous' AND m.morpheme = '-uous'
ON CONFLICT DO NOTHING;

-- probity: prob (good) + -ity = "state of being good" (integrity)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'probity' AND m.morpheme = 'prob'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'probity' AND m.morpheme = '-ity'
ON CONFLICT DO NOTHING;

-- profligate: pro- (forward) + flig (strike) + -ate = "struck down" (wasteful)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'profligate' AND m.morpheme = 'pro-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'profligate' AND m.morpheme = 'flig'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'profligate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- prosaic: pros (prose) + -ic = "like prose" (ordinary, unimaginative)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'prosaic' AND m.morpheme = 'pros'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'prosaic' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- querulous: quer (complain) + -ulous = "tending to complain"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'querulous' AND m.morpheme = 'quer'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'querulous' AND m.morpheme = '-ulous'
ON CONFLICT DO NOTHING;

-- quixotic: quixot (Don Quixote) + -ic = "like Don Quixote" (idealistic)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'quixotic' AND m.morpheme = 'quixot'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'quixotic' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- recondite: re- (back) + cond (hide) + -ite = "hidden back" (obscure)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'recondite' AND m.morpheme = 're-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'recondite' AND m.morpheme = 'cond'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'recondite' AND m.morpheme = '-ite'
ON CONFLICT DO NOTHING;

-- refractory: re- (back) + fract (break) + -ory = "breaking back" (stubborn)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'refractory' AND m.morpheme = 're-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'refractory' AND m.morpheme = 'fract'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'refractory' AND m.morpheme = '-ory'
ON CONFLICT DO NOTHING;

-- sanguine: sangu (blood) + -ine = "blood-like" (optimistic, ruddy)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'sanguine' AND m.morpheme = 'sangu'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'sanguine' AND m.morpheme = '-ine'
ON CONFLICT DO NOTHING;

-- sardonic: sardon (bitter) + -ic = "bitterly mocking"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'sardonic' AND m.morpheme = 'sardon'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'sardonic' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- sedulous: se- (apart) + dul (diligent) + -ous = "diligently apart" (persevering)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'sedulous' AND m.morpheme = 'se-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'sedulous' AND m.morpheme = 'dul'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'sedulous' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- spurious: spur (false) + -ious = "full of falseness"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'spurious' AND m.morpheme = 'spur'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'spurious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- sycophant: syco + phant (show) = "fig shower" (flatterer)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'sycophant' AND m.morpheme = 'phant'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'sycophant' AND m.morpheme = '-ant'
ON CONFLICT DO NOTHING;

-- temerity: temer (rash) + -ity = "state of rashness"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'temerity' AND m.morpheme = 'temer'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'temerity' AND m.morpheme = '-ity'
ON CONFLICT DO NOTHING;

-- trepidation: trepid (tremble) + -ation = "state of trembling"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'trepidation' AND m.morpheme = 'trepid'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'trepidation' AND m.morpheme = '-ation'
ON CONFLICT DO NOTHING;

-- truculent: truc (fierce) + -ulent = "full of fierceness"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'truculent' AND m.morpheme = 'truc'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'truculent' AND m.morpheme = '-ulent'
ON CONFLICT DO NOTHING;

-- unctuous: unct (oil) + -uous = "full of oil" (oily, smarmy)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'unctuous' AND m.morpheme = 'unct'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'unctuous' AND m.morpheme = '-uous'
ON CONFLICT DO NOTHING;

-- venal: venal (for sale) + -al = "able to be bought" (corrupt)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'venal' AND m.morpheme = 'venal'
ON CONFLICT DO NOTHING;

-- vicarious: vicar (substitute) + -ious = "through a substitute"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'vicarious' AND m.morpheme = 'vicar'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'vicarious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- vitriolic: vitriol (caustic) + -ic = "like vitriol" (bitterly harsh)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'vitriolic' AND m.morpheme = 'vitriol'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'vitriolic' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- zealous: zeal (eager) + -ous = "full of zeal"
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'zealous' AND m.morpheme = 'zeal'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'zealous' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;
