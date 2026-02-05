-- Complete morpheme coverage for all words
-- This ensures every part of every word has a morpheme association

-- ============================================
-- PART 1: Add missing morphemes
-- ============================================

INSERT INTO morphemes (morpheme, type, meaning, origin) VALUES
-- Roots
('aesth', 'root', 'feeling, perception', 'Greek'),
('thesis', 'root', 'position, proposition', 'Greek'),
('loc', 'root', 'speak', 'Latin'),
('robor', 'root', 'strength', 'Latin'),
('leter', 'root', 'harm, destroy', 'Greek'),
('tom', 'root', 'cut', 'Greek'),
('did', 'root', 'teach', 'Greek'),
('sembl', 'root', 'seem, likeness', 'Latin'),
('bull', 'root', 'boil, bubble', 'Latin'),
('fic', 'root', 'make, do', 'Latin'),
('ephem', 'root', 'day, short-lived', 'Greek'),
('equ', 'root', 'equal', 'Latin'),
('ig', 'root', 'drive, act', 'Latin'),
('fall', 'root', 'deceive', 'Latin'),
('fastid', 'root', 'disgust, disdain', 'Latin'),
('imic', 'root', 'enemy', 'Latin'),
('vect', 'root', 'carry', 'Latin'),
('mendac', 'root', 'lying, false', 'Latin'),
('moll', 'root', 'soft', 'Latin'),
('far', 'root', 'divine law', 'Latin'),
('dur', 'root', 'hard, lasting', 'Latin'),
('vi', 'root', 'way, road', 'Latin'),
('ostent', 'root', 'show, display', 'Latin'),
('ace', 'root', 'remedy, cure', 'Greek'),
('nic', 'root', 'death, harm', 'Latin'),
('pragm', 'root', 'deed, affair', 'Greek'),
('sci', 'root', 'know', 'Latin'),
('cliv', 'root', 'slope, lean', 'Latin'),
('dig', 'root', 'worthy', 'Latin'),
('pit', 'root', 'seek, favorable', 'Latin'),
('calc', 'root', 'heel, kick', 'Latin'),
('pud', 'root', 'shame', 'Latin'),
('tic', 'root', 'silent', 'Latin'),
('sag', 'root', 'perceive keenly', 'Latin'),
('rept', 'root', 'creep, crawl', 'Latin'),
('syco', 'root', 'fig (informer)', 'Greek'),
('ubiqu', 'root', 'everywhere', 'Latin'),
('vacill', 'root', 'waver, sway', 'Latin'),
('verb', 'root', 'word', 'Latin'),
('vindic', 'root', 'claim, avenge', 'Latin'),
('ana', 'root', 'up, against', 'Greek'),

-- Prefixes
('equi-', 'prefix', 'equal', 'Latin'),
('a-', 'prefix', 'not, without', 'Greek'),

-- Suffixes
('-men', 'suffix', 'result of', 'Latin'),
('-ice', 'suffix', 'state, quality', 'Latin'),
('-ify', 'suffix', 'to make', 'Latin'),
('-urn', 'suffix', 'characterized by', 'Latin'),
('-id', 'suffix', 'state of being', 'Latin')
ON CONFLICT (morpheme) DO NOTHING;

-- ============================================
-- PART 2: Fix/Add word-morpheme associations
-- ============================================

-- First, clear incomplete associations for words we're fixing
-- (We'll re-add them properly)

-- acumen: acu (sharp) + -men (result of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'acumen');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'acumen' AND m.morpheme = 'acu'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'acumen' AND m.morpheme = '-men'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- aesthetic: aesth (feeling) + -ic (relating to)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'aesthetic');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'aesthetic' AND m.morpheme = 'aesth'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'aesthetic' AND m.morpheme = '-ic'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- anathema: ana (up/against) + them (place)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'anathema');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'anathema' AND m.morpheme = 'ana'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'anathema' AND m.morpheme = 'them'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- antithesis: anti- (against) + thesis (position)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'antithesis');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'antithesis' AND m.morpheme = 'anti-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'antithesis' AND m.morpheme = 'thesis'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- avarice: avar (greedy) + -ice (state of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'avarice');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'avarice' AND m.morpheme = 'avar'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'avarice' AND m.morpheme = '-ice'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- benevolent: bene- (good) + vol (wish) + -ent (one who)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'benevolent');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'benevolent' AND m.morpheme = 'bene-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'benevolent' AND m.morpheme = 'vol'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'benevolent' AND m.morpheme = '-ent'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- circumlocution: circum- (around) + loc (speak) + -tion (act of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'circumlocution');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'circumlocution' AND m.morpheme = 'circum-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'circumlocution' AND m.morpheme = 'loc'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'circumlocution' AND m.morpheme = '-tion'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- cogent: co- (together) + ag/og (drive) + -ent - Actually the 'og' in cogent comes from 'agere'
-- Let's use the visible parts: cog (drive together) + -ent
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'cogent');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'cogent' AND m.morpheme = 'co-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'cogent' AND m.morpheme = '-ent'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- corroborate: co- (together) + robor (strength) + -ate (to make)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'corroborate');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'corroborate' AND m.morpheme = 'co-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'corroborate' AND m.morpheme = 'robor'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'corroborate' AND m.morpheme = '-ate'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- deleterious: de- (down) + leter (harm) + -ious (full of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'deleterious');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'deleterious' AND m.morpheme = 'de-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'deleterious' AND m.morpheme = 'leter'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'deleterious' AND m.morpheme = '-ous'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- dichotomy: di- (two) + tom (cut) + -y (state of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'dichotomy');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'dichotomy' AND m.morpheme = 'bi-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'dichotomy' AND m.morpheme = 'tom'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'dichotomy' AND m.morpheme = '-y'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- didactic: did (teach) + -ic (relating to)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'didactic');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'didactic' AND m.morpheme = 'did'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'didactic' AND m.morpheme = '-ic'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- diffident: dis- (not) + fid (faith) + -ent (one who)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'diffident');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'diffident' AND m.morpheme = 'dis-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'diffident' AND m.morpheme = 'fid'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'diffident' AND m.morpheme = '-ent'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- dissemble: dis- (apart) + sembl (seem) + -e
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'dissemble');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'dissemble' AND m.morpheme = 'dis-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'dissemble' AND m.morpheme = 'sembl'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- ebullient: e- (out) + bull (boil) + -ent (state of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'ebullient');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'ebullient' AND m.morpheme = 'e-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'ebullient' AND m.morpheme = 'bull'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'ebullient' AND m.morpheme = '-ent'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- efficacious: ef- (out) + fic (make) + -acious (inclined to)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'efficacious');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'efficacious' AND m.morpheme = 'ex-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'efficacious' AND m.morpheme = 'fic'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'efficacious' AND m.morpheme = '-acious'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- emulate: aemul (rival) + -ate (to make)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'emulate');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'emulate' AND m.morpheme = 'aemul'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'emulate' AND m.morpheme = '-ate'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- ephemeral: ephem (day) + -al (relating to)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'ephemeral');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'ephemeral' AND m.morpheme = 'ephem'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'ephemeral' AND m.morpheme = '-al'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- equanimity: equ (equal) + anim (spirit) + -ity (state of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'equanimity');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'equanimity' AND m.morpheme = 'equ'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'equanimity' AND m.morpheme = 'anim'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'equanimity' AND m.morpheme = '-ity'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- equivocate: equi- (equal) + voc (voice) + -ate (to make)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'equivocate');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'equivocate' AND m.morpheme = 'equi-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'equivocate' AND m.morpheme = 'voc'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'equivocate' AND m.morpheme = '-ate'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- exigent: ex- (out) + ig (drive) + -ent (state of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'exigent');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'exigent' AND m.morpheme = 'ex-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'exigent' AND m.morpheme = 'ig'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'exigent' AND m.morpheme = '-ent'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- expedient: ex- (out) + ped (foot) + -ent (state of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'expedient');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'expedient' AND m.morpheme = 'ex-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'expedient' AND m.morpheme = 'ped'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'expedient' AND m.morpheme = '-ent'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- fallacious: fall (deceive) + -acious (inclined to)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'fallacious');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'fallacious' AND m.morpheme = 'fall'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'fallacious' AND m.morpheme = '-acious'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- fastidious: fastid (disgust) + -ous (full of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'fastidious');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'fastidious' AND m.morpheme = 'fastid'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'fastidious' AND m.morpheme = '-ous'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- inimical: in- (not) + imic (enemy) + -al (relating to)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'inimical');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'inimical' AND m.morpheme = 'in-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'inimical' AND m.morpheme = 'imic'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'inimical' AND m.morpheme = '-al'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- insidious: in- (in) + sid (sit) + -ous (full of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'insidious');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'insidious' AND m.morpheme = 'in-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'insidious' AND m.morpheme = 'sid'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'insidious' AND m.morpheme = '-ous'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- intransigent: in- (not) + trans- (across) + ig (act) + -ent
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'intransigent');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'intransigent' AND m.morpheme = 'in-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'intransigent' AND m.morpheme = 'trans-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'intransigent' AND m.morpheme = 'ig'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 3 FROM words w, morphemes m WHERE w.word = 'intransigent' AND m.morpheme = '-ent'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- invective: in- (against) + vect (carry) + -ive (tending to)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'invective');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'invective' AND m.morpheme = 'in-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'invective' AND m.morpheme = 'vect'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'invective' AND m.morpheme = '-ive'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- lucid: luc (light) + -id (state of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'lucid');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'lucid' AND m.morpheme = 'luc'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'lucid' AND m.morpheme = '-id'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- malevolent: mal- (bad) + vol (wish) + -ent (one who)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'malevolent');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'malevolent' AND m.morpheme = 'mal-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'malevolent' AND m.morpheme = 'vol'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'malevolent' AND m.morpheme = '-ent'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- mendacious: mendac (lying) + -ous (full of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'mendacious');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'mendacious' AND m.morpheme = 'mendac'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'mendacious' AND m.morpheme = '-ous'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- mollify: moll (soft) + -ify (to make)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'mollify');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'mollify' AND m.morpheme = 'moll'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'mollify' AND m.morpheme = '-ify'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- nefarious: ne- (not) + far (divine law) + -ous (full of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'nefarious');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'nefarious' AND m.morpheme = 'ne-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'nefarious' AND m.morpheme = 'far'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'nefarious' AND m.morpheme = '-ous'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- obdurate: ob- (against) + dur (hard) + -ate (characterized by)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'obdurate');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'obdurate' AND m.morpheme = 'ob-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'obdurate' AND m.morpheme = 'dur'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'obdurate' AND m.morpheme = '-ate'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- obviate: ob- (against) + vi (way) + -ate (to make)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'obviate');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'obviate' AND m.morpheme = 'ob-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'obviate' AND m.morpheme = 'vi'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'obviate' AND m.morpheme = '-ate'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- ostentatious: ostent (show) + -ous (full of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'ostentatious');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'ostentatious' AND m.morpheme = 'ostent'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'ostentatious' AND m.morpheme = '-ous'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- panacea: pan- (all) + ace (cure) + -a
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'panacea');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'panacea' AND m.morpheme = 'pan-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'panacea' AND m.morpheme = 'ace'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- pernicious: per- (through) + nic (harm) + -ous (full of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'pernicious');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'pernicious' AND m.morpheme = 'per-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'pernicious' AND m.morpheme = 'nic'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'pernicious' AND m.morpheme = '-ous'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- perspicacious: per- (through) + spic (look) + -acious (inclined to)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'perspicacious');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'perspicacious' AND m.morpheme = 'per-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'perspicacious' AND m.morpheme = 'spic'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'perspicacious' AND m.morpheme = '-acious'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- pragmatic: pragm (deed) + -ic (relating to)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'pragmatic');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'pragmatic' AND m.morpheme = 'pragm'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'pragmatic' AND m.morpheme = '-ic'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- prescient: pre- (before) + sci (know) + -ent (one who)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'prescient');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'prescient' AND m.morpheme = 'pre-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'prescient' AND m.morpheme = 'sci'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'prescient' AND m.morpheme = '-ent'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- proclivity: pro- (forward) + cliv (lean) + -ity (state of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'proclivity');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'proclivity' AND m.morpheme = 'pro-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'proclivity' AND m.morpheme = 'cliv'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'proclivity' AND m.morpheme = '-ity'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- prodigious: pro- (forward) + dig (worthy) + -ous (full of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'prodigious');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'prodigious' AND m.morpheme = 'pro-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'prodigious' AND m.morpheme = 'dig'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'prodigious' AND m.morpheme = '-ous'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- propitious: pro- (forward) + pit (favorable) + -ous (full of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'propitious');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'propitious' AND m.morpheme = 'pro-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'propitious' AND m.morpheme = 'pit'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'propitious' AND m.morpheme = '-ous'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- recalcitrant: re- (back) + calc (kick) + -ant (one who)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'recalcitrant');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'recalcitrant' AND m.morpheme = 're-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'recalcitrant' AND m.morpheme = 'calc'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'recalcitrant' AND m.morpheme = '-ant'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- repudiate: re- (back) + pud (shame) + -ate (to make)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'repudiate');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'repudiate' AND m.morpheme = 're-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'repudiate' AND m.morpheme = 'pud'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'repudiate' AND m.morpheme = '-ate'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- reticent: re- (back) + tic (silent) + -ent (one who)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'reticent');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'reticent' AND m.morpheme = 're-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'reticent' AND m.morpheme = 'tic'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'reticent' AND m.morpheme = '-ent'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- sagacious: sag (perceive) + -acious (inclined to)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'sagacious');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'sagacious' AND m.morpheme = 'sag'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'sagacious' AND m.morpheme = '-acious'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- surreptitious: sub- (under) + rept (creep) + -ous (full of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'surreptitious');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'surreptitious' AND m.morpheme = 'sub-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'surreptitious' AND m.morpheme = 'rept'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'surreptitious' AND m.morpheme = '-ous'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- sycophant: syco (fig) + phant (show) + -ant (one who)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'sycophant');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'sycophant' AND m.morpheme = 'syco'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'sycophant' AND m.morpheme = 'phant'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'sycophant' AND m.morpheme = '-ant'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- taciturn: tacit (silent) + -urn (characterized by)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'taciturn');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'taciturn' AND m.morpheme = 'tacit'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'taciturn' AND m.morpheme = '-urn'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- ubiquitous: ubiqu (everywhere) + -ous (full of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'ubiquitous');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'ubiquitous' AND m.morpheme = 'ubiqu'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'ubiquitous' AND m.morpheme = '-ous'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- vacillate: vacill (waver) + -ate (to make)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'vacillate');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'vacillate' AND m.morpheme = 'vacill'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'vacillate' AND m.morpheme = '-ate'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- verbose: verb (word) + -ous (full of)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'verbose');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'verbose' AND m.morpheme = 'verb'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'verbose' AND m.morpheme = '-ous'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- vindicate: vindic (claim) + -ate (to make)
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'vindicate');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'vindicate' AND m.morpheme = 'vindic'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'vindicate' AND m.morpheme = '-ate'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- exculpate: ex- (out) + culp (blame) + -ate (to make) - need to add culp
INSERT INTO morphemes (morpheme, type, meaning, origin) VALUES
('culp', 'root', 'blame, fault', 'Latin')
ON CONFLICT (morpheme) DO NOTHING;

DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'exculpate');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'exculpate' AND m.morpheme = 'ex-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'exculpate' AND m.morpheme = 'culp'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'exculpate' AND m.morpheme = '-ate'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- ameliorate: needs 'melior' root
INSERT INTO morphemes (morpheme, type, meaning, origin) VALUES
('melior', 'root', 'better', 'Latin')
ON CONFLICT (morpheme) DO NOTHING;

DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'ameliorate');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'ameliorate' AND m.morpheme = 'ad-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'ameliorate' AND m.morpheme = 'melior'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'ameliorate' AND m.morpheme = '-ate'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;

-- apocryphal: apo- + cryph (hide) + -al
DELETE FROM word_morphemes WHERE word_id = (SELECT id FROM words WHERE word = 'apocryphal');
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'apocryphal' AND m.morpheme = 'apo-'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'apocryphal' AND m.morpheme = 'cryph'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'apocryphal' AND m.morpheme = '-al'
ON CONFLICT (word_id, morpheme_id) DO NOTHING;
