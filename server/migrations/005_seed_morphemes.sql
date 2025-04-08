-- Migration: 005_seed_morphemes.sql
-- Created: 2025-04-07
-- Description: Seeds the morphemes table and creates word-morpheme relationships

-- Start transaction
BEGIN;

-- Insert morphemes
INSERT INTO morphemes (value, type, meaning, language_origin, examples)
VALUES
  -- Prefixes
  ('a', 'prefix', 'to, toward, on, at, from', 'Latin/Greek', ARRAY['abase', 'abate', 'aberrant']),
  ('ab', 'prefix', 'away from, off', 'Latin', ARRAY['aberrant', 'abhor', 'abject', 'abjure', 'abnegate']),
  ('ad', 'prefix', 'to, toward', 'Latin', ARRAY['adamant', 'admonish', 'adroit', 'adulation']),
  ('ambi', 'prefix', 'both, around', 'Latin', ARRAY['ambiguous']),
  ('bene', 'prefix', 'good, well', 'Latin', ARRAY['benevolent']),
  ('di', 'prefix', 'two, double, apart', 'Latin', ARRAY['diligent']),
  ('e', 'prefix', 'out, from', 'Latin', ARRAY['eloquent', 'ephemeral']),
  ('in', 'prefix', 'not, without', 'Latin', ARRAY['ineffable']),
  ('loqu', 'root', 'talk, speak', 'Latin', ARRAY['loquacious', 'eloquent']),
  ('ob', 'prefix', 'against, toward, in the way', 'Latin', ARRAY['obfuscate']),
  ('per', 'prefix', 'through, thoroughly, entirely', 'Latin', ARRAY['pernicious']),
  ('pragma', 'root', 'deed, action', 'Greek', ARRAY['pragmatic']),
  ('quint', 'prefix', 'five, fifth', 'Latin', ARRAY['quintessential']),
  ('re', 'prefix', 'again, back', 'Latin', ARRAY['resilient']),
  ('seren', 'root', 'clear, tranquil', 'Latin', ARRAY['serendipity']),
  ('trans', 'prefix', 'across, beyond, through', 'Latin', ARRAY['tranquil']),
  ('ubi', 'prefix', 'where, everywhere', 'Latin', ARRAY['ubiquitous']),
  ('verb', 'root', 'word', 'Latin', ARRAY['verbose']),

  -- Roots
  ('bas', 'root', 'low, base', 'Latin', ARRAY['abase']),
  ('bat', 'root', 'beat, strike', 'Latin', ARRAY['abate']),
  ('err', 'root', 'wander, stray', 'Latin', ARRAY['aberrant']),
  ('bey', 'root', 'wait, hold', 'Old French', ARRAY['abeyance']),
  ('hor', 'root', 'shudder, dread', 'Latin', ARRAY['abhor']),
  ('ject', 'root', 'throw', 'Latin', ARRAY['abject']),
  ('jur', 'root', 'swear, oath', 'Latin', ARRAY['abjure']),
  ('neg', 'root', 'deny', 'Latin', ARRAY['abnegate']),
  ('ras', 'root', 'scrape, scratch', 'Latin', ARRAY['abrasive']),
  ('rog', 'root', 'ask', 'Latin', ARRAY['abrogate']),
  ('stem', 'root', 'hold back', 'Latin', ARRAY['abstemious']),
  ('trus', 'root', 'push, thrust', 'Latin', ARRAY['abstruse']),
  ('acerb', 'root', 'bitter, harsh', 'Latin', ARRAY['acerbic']),
  ('ac', 'root', 'sharp, pointed', 'Greek', ARRAY['acme']),
  ('men', 'suffix', 'result, means', 'Latin', ARRAY['acumen']),
  ('ation', 'suffix', 'action or process', 'Latin', ARRAY['adulation']),
  ('gu', 'root', 'drive, lead', 'Latin', ARRAY['ambiguous']),
  ('emer', 'root', 'day', 'Greek', ARRAY['ephemeral']),
  ('flu', 'root', 'flow', 'Latin', ARRAY['mellifluous']),
  ('ul', 'suffix', 'small, diminutive', 'Latin', ARRAY['meticulous']),
  ('phant', 'root', 'to show, reveal', 'Greek', ARRAY['sycophant']),
  ('quit', 'root', 'where, place', 'Latin', ARRAY['ubiquitous']),
  ('quie', 'root', 'rest, quiet', 'Latin', ARRAY['acquiesce']),
  ('acu', 'root', 'sharp', 'Latin', ARRAY['acumen']),
  ('adam', 'root', 'invincible, untameable', 'Greek', ARRAY['adamant']),
  ('mon', 'root', 'warn, advise', 'Latin', ARRAY['admonish']),
  ('droit', 'root', 'right, straight', 'Latin via French', ARRAY['adroit']),
  ('adul', 'root', 'flatter', 'Latin', ARRAY['adulation']),
  ('vol', 'root', 'wish, will', 'Latin', ARRAY['benevolent']),
  ('dilig', 'root', 'choose, select, love', 'Latin', ARRAY['diligent']),
  ('eph', 'root', 'upon, over', 'Greek', ARRAY['ephemeral']),
  ('eff', 'root', 'speak out', 'Latin', ARRAY['ineffable']),
  ('melli', 'root', 'honey', 'Latin', ARRAY['mellifluous']),
  ('metic', 'root', 'fear, apprehension', 'Greek', ARRAY['meticulous']),
  ('fusc', 'root', 'dark', 'Latin', ARRAY['obfuscate']),
  ('nic', 'root', 'harm, death', 'Latin', ARRAY['pernicious']),
  ('essent', 'root', 'being, essence', 'Latin', ARRAY['quintessential']),
  ('sil', 'root', 'jump, leap', 'Latin', ARRAY['resilient']),
  ('dipity', 'suffix', 'state, quality', 'English', ARRAY['serendipity']),
  ('sond', 'root', 'question, probe', 'French', ARRAY['sonder']),
  ('syco', 'root', 'fig', 'Greek', ARRAY['sycophant']),
  ('quil', 'root', 'calm', 'Latin', ARRAY['tranquil']),
  ('quis', 'root', 'who, which', 'Latin', ARRAY['ubiquitous']),
  ('os', 'root', 'mouth', 'Latin', ARRAY['verbose']),

  -- Suffixes
  ('ant', 'suffix', 'performing, causing', 'Latin', ARRAY['aberrant', 'adamant']),
  ('ance', 'suffix', 'state, quality, or process', 'Latin', ARRAY['abeyance']),
  ('ive', 'suffix', 'relating to, tending to', 'Latin', ARRAY['abrasive']),
  ('ate', 'suffix', 'cause to be, make into', 'Latin', ARRAY['abate', 'abrogate']),
  ('ious', 'suffix', 'characterized by, full of', 'Latin', ARRAY['abstemious']),
  ('use', 'suffix', 'state, quality', 'Latin', ARRAY['abstruse']),
  ('ic', 'suffix', 'pertaining to, of the nature of', 'Greek/Latin', ARRAY['acerbic']),
  ('esce', 'suffix', 'begin to be, become', 'Latin', ARRAY['acquiesce']),
  ('en', 'suffix', 'made of, characterized by', 'Latin', ARRAY['acumen']),
  ('ish', 'suffix', 'cause to, make', 'Old English', ARRAY['admonish']),
  ('ous', 'suffix', 'full of, having', 'Latin', ARRAY['ambiguous']),
  ('ent', 'suffix', 'characterized by, being in a state of', 'Latin', ARRAY['benevolent', 'diligent', 'eloquent']),
  ('al', 'suffix', 'relating to, pertaining to', 'Latin', ARRAY['ephemeral']),
  ('able', 'suffix', 'capable of, suitable for', 'Latin', ARRAY['ineffable']),
  ('uous', 'suffix', 'characterized by, full of', 'Latin', ARRAY['mellifluous']),
  ('ulous', 'suffix', 'tending to, inclined to', 'Latin', ARRAY['meticulous']),
  ('tic', 'suffix', 'relating to, characterized by', 'Greek', ARRAY['pragmatic']),
  ('ial', 'suffix', 'relating to, having the character of', 'Latin', ARRAY['quintessential']),
  ('ient', 'suffix', 'characterized by, being in a state of', 'Latin', ARRAY['resilient']),
  ('ity', 'suffix', 'state, quality', 'Latin', ARRAY['serendipity']),
  ('er', 'suffix', 'person or thing that does', 'Old English', ARRAY['sonder']),
  ('il', 'suffix', 'pertaining to', 'Latin', ARRAY['tranquil'])
ON CONFLICT (value) DO UPDATE SET
  type = EXCLUDED.type,
  meaning = EXCLUDED.meaning,
  language_origin = EXCLUDED.language_origin,
  examples = EXCLUDED.examples;

-- Create word-morpheme relationships
-- First, clear existing relationships to avoid duplicates
DELETE FROM word_morphemes;

-- Insert word-morpheme relationships
-- abase
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'abase' AND m.value = 'a';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'abase' AND m.value = 'bas';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'abase' AND m.value = 'e';

-- abate
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'abate' AND m.value = 'a';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'abate' AND m.value = 'bat';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'abate' AND m.value = 'e';

-- aberrant
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'aberrant' AND m.value = 'ab';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'aberrant' AND m.value = 'err';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'aberrant' AND m.value = 'ant';

-- abeyance
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'abeyance' AND m.value = 'a';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'abeyance' AND m.value = 'bey';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'abeyance' AND m.value = 'ance';

-- abhor
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'abhor' AND m.value = 'ab';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'abhor' AND m.value = 'hor';

-- abject
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'abject' AND m.value = 'ab';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'abject' AND m.value = 'ject';

-- abjure
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'abjure' AND m.value = 'ab';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'abjure' AND m.value = 'jur';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'abjure' AND m.value = 'e';

-- abnegate
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'abnegate' AND m.value = 'ab';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'abnegate' AND m.value = 'neg';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'abnegate' AND m.value = 'ate';

-- abrasive
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'abrasive' AND m.value = 'ab';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'abrasive' AND m.value = 'ras';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'abrasive' AND m.value = 'ive';

-- abrogate
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'abrogate' AND m.value = 'ab';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'abrogate' AND m.value = 'rog';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'abrogate' AND m.value = 'ate';

-- abstemious
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'abstemious' AND m.value = 'ab';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'abstemious' AND m.value = 'stem';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'abstemious' AND m.value = 'ious';

-- abstruse
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'abstruse' AND m.value = 'ab';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'abstruse' AND m.value = 'trus';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'abstruse' AND m.value = 'use';

-- acerbic
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'acerbic' AND m.value = 'acerb';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'acerbic' AND m.value = 'ic';

-- acme
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'acme' AND m.value = 'ac';

-- acquiesce
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'acquiesce' AND m.value = 'ac';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'acquiesce' AND m.value = 'quie';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'acquiesce' AND m.value = 'esce';

-- acumen
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'acumen' AND m.value = 'acu';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'acumen' AND m.value = 'men';

-- adamant
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'adamant' AND m.value = 'adam';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'adamant' AND m.value = 'ant';

-- admonish
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'admonish' AND m.value = 'ad';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'admonish' AND m.value = 'mon';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'admonish' AND m.value = 'ish';

-- adroit
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'adroit' AND m.value = 'ad';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'adroit' AND m.value = 'droit';

-- adulation
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'adulation' AND m.value = 'adul';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'adulation' AND m.value = 'ation';

-- ambiguous
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'ambiguous' AND m.value = 'ambi';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'ambiguous' AND m.value = 'gu';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'ambiguous' AND m.value = 'ous';

-- benevolent
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'benevolent' AND m.value = 'bene';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'benevolent' AND m.value = 'vol';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'benevolent' AND m.value = 'ent';

-- diligent
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'diligent' AND m.value = 'dilig';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'diligent' AND m.value = 'ent';

-- eloquent
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'eloquent' AND m.value = 'e';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'eloquent' AND m.value = 'loqu';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'eloquent' AND m.value = 'ent';

-- ephemeral
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'ephemeral' AND m.value = 'eph';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'ephemeral' AND m.value = 'emer';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'ephemeral' AND m.value = 'al';

-- ineffable
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'ineffable' AND m.value = 'in';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'ineffable' AND m.value = 'eff';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'ineffable' AND m.value = 'able';

-- loquacious
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'loquacious' AND m.value = 'loqu';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'loquacious' AND m.value = 'ious';

-- mellifluous
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'mellifluous' AND m.value = 'melli';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'mellifluous' AND m.value = 'flu';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'mellifluous' AND m.value = 'uous';

-- meticulous
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'meticulous' AND m.value = 'metic';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'meticulous' AND m.value = 'ul';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'meticulous' AND m.value = 'ous';

-- obfuscate
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'obfuscate' AND m.value = 'ob';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'obfuscate' AND m.value = 'fusc';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'obfuscate' AND m.value = 'ate';

-- pernicious
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'pernicious' AND m.value = 'per';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'pernicious' AND m.value = 'nic';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'pernicious' AND m.value = 'ious';

-- pragmatic
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'pragmatic' AND m.value = 'pragma';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'pragmatic' AND m.value = 'tic';

-- quintessential
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'quintessential' AND m.value = 'quint';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'quintessential' AND m.value = 'essent';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'quintessential' AND m.value = 'ial';

-- resilient
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'resilient' AND m.value = 're';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'resilient' AND m.value = 'sil';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'resilient' AND m.value = 'ient';

-- serendipity
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'serendipity' AND m.value = 'seren';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'serendipity' AND m.value = 'dipity';

-- sonder
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'sonder' AND m.value = 'sond';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'sonder' AND m.value = 'er';

-- sycophant
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'sycophant' AND m.value = 'syco';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'sycophant' AND m.value = 'phant';

-- tranquil
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'tranquil' AND m.value = 'trans';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'tranquil' AND m.value = 'quil';

-- ubiquitous
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'ubiquitous' AND m.value = 'ubi';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'ubiquitous' AND m.value = 'quit';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'ubiquitous' AND m.value = 'ous';

-- verbose
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0
FROM words w, morphemes m
WHERE w.value = 'verbose' AND m.value = 'verb';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1
FROM words w, morphemes m
WHERE w.value = 'verbose' AND m.value = 'os';

INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2
FROM words w, morphemes m
WHERE w.value = 'verbose' AND m.value = 'e';
