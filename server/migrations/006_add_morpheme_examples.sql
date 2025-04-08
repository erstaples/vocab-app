-- Migration: 006_add_morpheme_examples.sql
-- Created: 2025-04-07
-- Description: Adds detailed examples for each morpheme

-- Start transaction
BEGIN;

-- Update morphemes with more comprehensive examples
UPDATE morphemes SET examples = CASE
    -- Prefixes
    WHEN value = 'a' THEN ARRAY['abase', 'abed', 'afoot', 'ahead', 'ajar', 'akin', 'along', 'aside']
    WHEN value = 'ab' THEN ARRAY['abduct', 'abnormal', 'absorb', 'abstain', 'abstract', 'abuse', 'abhor', 'abide']
    WHEN value = 'ad' THEN ARRAY['adapt', 'addict', 'adhere', 'adjoin', 'adjust', 'admit', 'adore', 'advance']
    WHEN value = 'bene' THEN ARRAY['benefit', 'benefactor', 'benevolent', 'benediction', 'beneficent', 'beneficial']
    WHEN value = 'di' THEN ARRAY['divide', 'divert', 'digest', 'dilute', 'diminish', 'diverge', 'diverse', 'dilemma']
    WHEN value = 'e' THEN ARRAY['evolve', 'emit', 'erupt', 'evade', 'eject', 'erode', 'elapse', 'emerge']
    WHEN value = 'in' THEN ARRAY['inept', 'inert', 'infirm', 'ingest', 'inhale', 'inject', 'inmate', 'innate']
    WHEN value = 'ob' THEN ARRAY['object', 'obtain', 'oblige', 'obscure', 'observe', 'obstruct', 'obvious', 'oblique']
    WHEN value = 'per' THEN ARRAY['perform', 'perhaps', 'permeate', 'persist', 'persuade', 'pervert', 'pervade', 'perceive']
    WHEN value = 're' THEN ARRAY['return', 'reveal', 'reverse', 'revolve', 'reclaim', 'reduce', 'refine', 'refresh']
    WHEN value = 'trans' THEN ARRAY['translate', 'transfer', 'transform', 'transmit', 'transparent', 'transplant', 'transfix']
    WHEN value = 'ubi' THEN ARRAY['ubiquitous', 'ubiquity']
    WHEN value = 'ambi' THEN ARRAY['ambiguous', 'ambidextrous', 'ambient', 'ambivalent', 'ambit', 'ambition', 'ambience']
    WHEN value = 'quint' THEN ARRAY['quintessential', 'quintessence', 'quintuplet', 'quintuple', 'quintet']
    
    -- Roots
    WHEN value = 'eff' THEN ARRAY['effect', 'effective', 'efficient', 'efface', 'effigy', 'effusive', 'effluvium', 'effort']
    WHEN value = 'pragma' THEN ARRAY['pragmatic', 'pragmatism', 'pragmatist']
    WHEN value = 'verb' THEN ARRAY['verbal', 'verbatim', 'verbiage', 'verbose', 'verbosity', 'verb']
    WHEN value = 'bas' THEN ARRAY['base', 'basic', 'basement', 'baseline', 'baseless', 'basalt', 'abase', 'debase']
    WHEN value = 'bat' THEN ARRAY['battle', 'batter', 'battery', 'battalion', 'combat', 'debate', 'abate', 'rebate']
    WHEN value = 'err' THEN ARRAY['error', 'errant', 'erratic', 'erroneous', 'errorless', 'erring', 'aberrant']
    WHEN value = 'bey' THEN ARRAY['abeyance'] -- Limited examples exist with this exact root
    WHEN value = 'hor' THEN ARRAY['horror', 'horrid', 'horrify', 'horrible', 'horrendous', 'abhor', 'abhorrent']
    WHEN value = 'ject' THEN ARRAY['inject', 'eject', 'project', 'reject', 'subject', 'object', 'abject', 'ejection']
    WHEN value = 'jur' THEN ARRAY['jury', 'juror', 'juristic', 'abjure', 'conjure', 'adjure', 'juridical', 'jurisdiction']
    WHEN value = 'neg' THEN ARRAY['negate', 'negative', 'negation', 'abnegate', 'renegade', 'renege', 'negligent']
    WHEN value = 'ras' THEN ARRAY['erase', 'erasure', 'abrasive', 'abrasion', 'rasp', 'razor', 'raze']
    WHEN value = 'rog' THEN ARRAY['abrogate', 'arrogate', 'derogatory', 'interrogate', 'prerogative', 'rogation']
    WHEN value = 'stem' THEN ARRAY['stem', 'system', 'stemware', 'abstemious', 'stemming']
    WHEN value = 'trus' THEN ARRAY['thrust', 'intrusion', 'abstruse', 'obtrusion', 'protrusion', 'intrusive']
    WHEN value = 'acerb' THEN ARRAY['acerbic', 'acerbity', 'exacerbate']
    WHEN value = 'ac' THEN ARRAY['acid', 'acuity', 'acme', 'acne', 'acute', 'acumen', 'acrid']
    WHEN value = 'men' THEN ARRAY['mental', 'mention', 'mentor', 'menace', 'amenable', 'comment', 'acumen', 'momentum']
    WHEN value = 'ation' THEN ARRAY['creation', 'vacation', 'relation', 'station', 'adulation', 'starvation', 'donation']
    WHEN value = 'gu' THEN ARRAY['guide', 'guard', 'guest', 'guild', 'guilty', 'guile', 'disguise', 'ambiguous']
    WHEN value = 'emer' THEN ARRAY['emerge', 'emergency', 'emeritus', 'emersion', 'ephemeral']
    WHEN value = 'flu' THEN ARRAY['fluid', 'fluent', 'flume', 'flush', 'flux', 'fluke', 'influence', 'affluent']
    WHEN value = 'ul' THEN ARRAY['ultimate', 'ultra', 'ulterior', 'ulcer', 'result', 'adult', 'insult', 'occult']
    WHEN value = 'phant' THEN ARRAY['phantom', 'phantasm', 'phantasmagoria', 'sycophant', 'elephant', 'fantasy']
    WHEN value = 'quit' THEN ARRAY['quit', 'quite', 'quiet', 'quitter', 'quitclaim', 'acquit', 'acquittal']
    WHEN value = 'quie' THEN ARRAY['quiet', 'quietus', 'disquiet', 'acquiesce', 'requiem', 'inquietude', 'quietude']
    WHEN value = 'acu' THEN ARRAY['acumen', 'acute', 'acupuncture', 'acuity', 'acumen', 'acuminate']
    WHEN value = 'adam' THEN ARRAY['adamant', 'adamantine']
    WHEN value = 'mon' THEN ARRAY['monitor', 'monologue', 'monotone', 'monopoly', 'admonish', 'summon', 'common']
    WHEN value = 'droit' THEN ARRAY['adroit', 'maladroit']
    WHEN value = 'adul' THEN ARRAY['adult', 'adulterate', 'adulation', 'adulatory']
    WHEN value = 'dilig' THEN ARRAY['diligent', 'diligence']
    WHEN value = 'loqu' THEN ARRAY['eloquent', 'loquacious', 'colloquial', 'soliloquy', 'grandiloquent', 'elocution']
    WHEN value = 'eph' THEN ARRAY['ephemeral', 'ephemeris', 'ephemeron']
    WHEN value = 'eff' THEN ARRAY['effect', 'effective', 'efface', 'effort', 'efficacy', 'efficient', 'effusion']
    WHEN value = 'melli' THEN ARRAY['mellifluous', 'mellify', 'melliferous', 'mellifluent']
    WHEN value = 'metic' THEN ARRAY['meticulous', 'meticulosity']
    WHEN value = 'vol' THEN ARRAY['volume', 'volition', 'volunteer', 'volatile', 'volley', 'benevolent', 'malevolent']
    WHEN value = 'fusc' THEN ARRAY['obfuscate', 'fuscous', 'infuscate']
    WHEN value = 'nic' THEN ARRAY['pernicious', 'nicotine', 'internecine']
    WHEN value = 'essent' THEN ARRAY['essential', 'essentially', 'quintessential', 'essence']
    WHEN value = 'sil' THEN ARRAY['resilient', 'resilience', 'silicone', 'silhouette', 'missile', 'fossil']
    WHEN value = 'dipity' THEN ARRAY['serendipity']
    WHEN value = 'sond' THEN ARRAY['sonder', 'sondage']
    WHEN value = 'syco' THEN ARRAY['sycophant', 'sycophantic', 'psychosomatic']
    WHEN value = 'quil' THEN ARRAY['tranquil', 'tranquility', 'tranquilize', 'tranquilizer']
    WHEN value = 'quis' THEN ARRAY['inquisitive', 'requisite', 'exquisite', 'perquisite', 'acquisition', 'requisition']
    WHEN value = 'os' THEN ARRAY['osmosis', 'osmotic', 'ostentatious', 'ostrich', 'ostensible', 'ossify', 'osseous']
    WHEN value = 'seren' THEN ARRAY['serene', 'serenity', 'serendipity', 'serenade', 'serenata']
    
    -- Suffixes
    WHEN value = 'able' THEN ARRAY['probable', 'capable', 'adorable', 'durable', 'portable', 'lovable', 'favorable']
    WHEN value = 'ent' THEN ARRAY['dependent', 'confident', 'consistent', 'different', 'excellent', 'benevolent', 'diligent']
    WHEN value = 'ate' THEN ARRAY['create', 'donate', 'hesitate', 'locate', 'mediate', 'narrate', 'dictate', 'elate']
    WHEN value = 'ant' THEN ARRAY['elegant', 'dominant', 'important', 'distant', 'tolerant', 'vagrant', 'defiant']
    WHEN value = 'ance' THEN ARRAY['allowance', 'appearance', 'assistance', 'distance', 'instance', 'performance']
    WHEN value = 'ive' THEN ARRAY['active', 'massive', 'creative', 'defensive', 'excessive', 'native', 'passive']
    WHEN value = 'ious' THEN ARRAY['anxious', 'curious', 'delicious', 'furious', 'obvious', 'previous', 'serious']
    WHEN value = 'use' THEN ARRAY['abuse', 'excuse', 'misuse', 'refuse', 'abstruse', 'accuse', 'amuse', 'confuse']
    WHEN value = 'ic' THEN ARRAY['basic', 'comic', 'magic', 'music', 'public', 'static', 'toxic', 'acerbic']
    WHEN value = 'esce' THEN ARRAY['acquiesce', 'coalesce', 'convalesce', 'effervesce', 'adolescence', 'obsolescence']
    WHEN value = 'en' THEN ARRAY['broken', 'frozen', 'golden', 'hidden', 'harden', 'lighten', 'sharpen', 'weaken']
    WHEN value = 'ish' THEN ARRAY['childish', 'finish', 'foolish', 'selfish', 'polish', 'publish', 'admonish', 'establish']
    WHEN value = 'ous' THEN ARRAY['joyous', 'dangerous', 'famous', 'generous', 'nervous', 'previous', 'zealous']
    WHEN value = 'al' THEN ARRAY['dental', 'final', 'royal', 'social', 'usual', 'normal', 'mental', 'ephemeral']
    WHEN value = 'uous' THEN ARRAY['arduous', 'tempestuous', 'tumultuous', 'tortuous', 'sumptuous', 'mellifluous']
    WHEN value = 'ulous' THEN ARRAY['meticulous', 'ridiculous', 'miraculous', 'fabulous', 'nebulous', 'scrupulous']
    WHEN value = 'tic' THEN ARRAY['artistic', 'domestic', 'elastic', 'fantastic', 'genetic', 'pragmatic', 'romantic']
    WHEN value = 'ial' THEN ARRAY['facial', 'initial', 'official', 'racial', 'social', 'special', 'quintessential']
    WHEN value = 'ient' THEN ARRAY['patient', 'ancient', 'efficient', 'proficient', 'sufficient', 'resilient', 'transient']
    WHEN value = 'ity' THEN ARRAY['ability', 'clarity', 'density', 'fertility', 'humanity', 'reality', 'serendipity']
    WHEN value = 'er' THEN ARRAY['baker', 'dancer', 'fighter', 'leader', 'teacher', 'speaker', 'writer', 'sonder']
    WHEN value = 'il' THEN ARRAY['civil', 'fossil', 'pencil', 'pupil', 'tranquil', 'until', 'utensil', 'vigil']
    ELSE examples
END;

-- Create word family relationships
-- First, clear existing relationships to avoid duplicates
DELETE FROM word_families;

-- Create word family relationships based on shared morphemes
-- Words sharing the same prefix
INSERT INTO word_families (base_word_id, related_word_id, relationship_type)
SELECT w1.id, w2.id, 'variant'
FROM words w1
JOIN word_morphemes wm1 ON w1.id = wm1.word_id
JOIN morphemes m ON wm1.morpheme_id = m.id
JOIN word_morphemes wm2 ON m.id = wm2.morpheme_id
JOIN words w2 ON wm2.word_id = w2.id
WHERE m.type = 'prefix'
  AND w1.id != w2.id
  AND wm1.position = 0
  AND wm2.position = 0
ON CONFLICT DO NOTHING;

-- Words sharing the same root
INSERT INTO word_families (base_word_id, related_word_id, relationship_type)
SELECT w1.id, w2.id, 'derivative'
FROM words w1
JOIN word_morphemes wm1 ON w1.id = wm1.word_id
JOIN morphemes m ON wm1.morpheme_id = m.id
JOIN word_morphemes wm2 ON m.id = wm2.morpheme_id
JOIN words w2 ON wm2.word_id = w2.id
WHERE m.type = 'root'
  AND w1.id != w2.id
ON CONFLICT DO NOTHING;

-- Words sharing the same suffix
INSERT INTO word_families (base_word_id, related_word_id, relationship_type)
SELECT w1.id, w2.id, 'variant'
FROM words w1
JOIN word_morphemes wm1 ON w1.id = wm1.word_id
JOIN morphemes m ON wm1.morpheme_id = m.id
JOIN word_morphemes wm2 ON m.id = wm2.morpheme_id
JOIN words w2 ON wm2.word_id = w2.id
WHERE m.type = 'suffix'
  AND w1.id != w2.id
  AND wm1.position > 0
  AND wm2.position > 0
ON CONFLICT DO NOTHING;

-- Commit transaction
COMMIT;
