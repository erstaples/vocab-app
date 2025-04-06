const { pool } = require('../services/database');

async function addMorphemeExamples() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    
    // Compound is for words formed by combining multiple roots/words
    // This would need more complex logic to identify true compounds
    
    await client.query(`-- Update the morphemes table with examples that contain the exact morpheme value
UPDATE morphemes SET examples = CASE
    -- Prefixes
    WHEN id = 91 AND value = 'a' THEN ARRAY['abase', 'abed', 'afoot', 'ahead', 'ajar', 'akin', 'along', 'aside']
    WHEN id = 92 AND value = 'ab' THEN ARRAY['abduct', 'abnormal', 'absorb', 'abstain', 'abstract', 'abuse', 'abhor', 'abide']
    WHEN id = 93 AND value = 'ad' THEN ARRAY['adapt', 'addict', 'adhere', 'adjoin', 'adjust', 'admit', 'adore', 'advance']
    WHEN id = 2 AND value = 'bene' THEN ARRAY['benefit', 'benefactor', 'benevolent', 'benediction', 'beneficent', 'beneficial']
    WHEN id = 96 AND value = 'di' THEN ARRAY['divide', 'divert', 'digest', 'dilute', 'diminish', 'diverge', 'diverse', 'dilemma']
    WHEN id = 97 AND value = 'e' THEN ARRAY['evolve', 'emit', 'erupt', 'evade', 'eject', 'erode', 'elapse', 'emerge']
    WHEN id = 1 AND value = 'in' THEN ARRAY['inept', 'inert', 'infirm', 'ingest', 'inhale', 'inject', 'inmate', 'innate']
    WHEN id = 3 AND value = 'ob' THEN ARRAY['object', 'obtain', 'oblige', 'obscure', 'observe', 'obstruct', 'obvious', 'oblique']
    WHEN id = 101 AND value = 'per' THEN ARRAY['perform', 'perhaps', 'permeate', 'persist', 'persuade', 'pervert', 'pervade', 'perceive']
    WHEN id = 104 AND value = 're' THEN ARRAY['return', 'reveal', 'reverse', 'revolve', 'reclaim', 'reduce', 'refine', 'refresh']
    WHEN id = 106 AND value = 'trans' THEN ARRAY['translate', 'transfer', 'transform', 'transmit', 'transparent', 'transplant', 'transfix']
    WHEN id = 107 AND value = 'ubi' THEN ARRAY['ubiquitous', 'ubiquity']
    WHEN id = 94 AND value = 'ambi' THEN ARRAY['ambiguous', 'ambidextrous', 'ambient', 'ambivalent', 'ambit', 'ambition', 'ambience']
    WHEN id = 103 AND value = 'quint' THEN ARRAY['quintessential', 'quintessence', 'quintuplet', 'quintuple', 'quintet']
    
    -- Roots
    WHEN id = 4 AND value = 'ef' THEN ARRAY['effect', 'effective', 'efficient', 'efface', 'effigy', 'effusive', 'effluvium', 'effort']
    WHEN id = 102 AND value = 'pragma' THEN ARRAY['pragmatic', 'pragmatism', 'pragmatist']
    WHEN id = 108 AND value = 'verb' THEN ARRAY['verbal', 'verbatim', 'verbiage', 'verbose', 'verbosity', 'verb']
    WHEN id = 109 AND value = 'bas' THEN ARRAY['base', 'basic', 'basement', 'baseline', 'baseless', 'basalt', 'abase', 'debase']
    WHEN id = 110 AND value = 'bat' THEN ARRAY['battle', 'batter', 'battery', 'battalion', 'combat', 'debate', 'abate', 'rebate']
    WHEN id = 111 AND value = 'err' THEN ARRAY['error', 'errant', 'erratic', 'erroneous', 'errorless', 'erring', 'aberrant']
    WHEN id = 112 AND value = 'bey' THEN ARRAY['abeyance'] -- Limited examples exist with this exact root
    WHEN id = 113 AND value = 'hor' THEN ARRAY['horror', 'horrid', 'horrify', 'horrible', 'horrendous', 'abhor', 'abhorrent']
    WHEN id = 114 AND value = 'ject' THEN ARRAY['inject', 'eject', 'project', 'reject', 'subject', 'object', 'abject', 'ejection']
    WHEN id = 115 AND value = 'jur' THEN ARRAY['jury', 'juror', 'juristic', 'abjure', 'conjure', 'adjure', 'juridical', 'jurisdiction']
    WHEN id = 116 AND value = 'neg' THEN ARRAY['negate', 'negative', 'negation', 'abnegate', 'renegade', 'renege', 'negligent']
    WHEN id = 117 AND value = 'ras' THEN ARRAY['erase', 'erasure', 'abrasive', 'abrasion', 'rasp', 'razor', 'raze']
    WHEN id = 118 AND value = 'rog' THEN ARRAY['abrogate', 'arrogate', 'derogatory', 'interrogate', 'prerogative', 'rogation']
    WHEN id = 119 AND value = 'stem' THEN ARRAY['stem', 'system', 'stemware', 'abstemious', 'stemming']
    WHEN id = 120 AND value = 'trus' THEN ARRAY['thrust', 'intrusion', 'abstruse', 'obtrusion', 'protrusion', 'intrusive']
    WHEN id = 121 AND value = 'acerb' THEN ARRAY['acerbic', 'acerbity', 'exacerbate']
    WHEN id = 122 AND value = 'ac' THEN ARRAY['acid', 'acuity', 'acme', 'acne', 'acute', 'acumen', 'acrid']
    WHEN id = 123 AND value = 'men' THEN ARRAY['mental', 'mention', 'mentor', 'menace', 'amenable', 'comment', 'acumen', 'momentum']
    WHEN id = 124 AND value = 'ation' THEN ARRAY['creation', 'vacation', 'relation', 'station', 'adulation', 'starvation', 'donation']
    WHEN id = 125 AND value = 'gu' THEN ARRAY['guide', 'guard', 'guest', 'guild', 'guilty', 'guile', 'disguise', 'ambiguous']
    WHEN id = 126 AND value = 'emer' THEN ARRAY['emerge', 'emergency', 'emeritus', 'emersion', 'ephemeral']
    WHEN id = 127 AND value = 'flu' THEN ARRAY['fluid', 'fluent', 'flume', 'flush', 'flux', 'fluke', 'influence', 'affluent']
    WHEN id = 128 AND value = 'ul' THEN ARRAY['ultimate', 'ultra', 'ulterior', 'ulcer', 'result', 'adult', 'insult', 'occult']
    WHEN id = 129 AND value = 'phant' THEN ARRAY['phantom', 'phantasm', 'phantasmagoria', 'sycophant', 'elephant', 'fantasy']
    WHEN id = 130 AND value = 'quit' THEN ARRAY['quit', 'quite', 'quiet', 'quitter', 'quitclaim', 'acquit', 'acquittal']
    WHEN id = 131 AND value = 'quie' THEN ARRAY['quiet', 'quietus', 'disquiet', 'acquiesce', 'requiem', 'inquietude', 'quietude']
    WHEN id = 132 AND value = 'acu' THEN ARRAY['acumen', 'acute', 'acupuncture', 'acuity', 'acumen', 'acuminate']
    WHEN id = 133 AND value = 'adam' THEN ARRAY['adamant', 'adamantine']
    WHEN id = 134 AND value = 'mon' THEN ARRAY['monitor', 'monologue', 'monotone', 'monopoly', 'admonish', 'summon', 'common']
    WHEN id = 135 AND value = 'droit' THEN ARRAY['adroit', 'maladroit']
    WHEN id = 136 AND value = 'adul' THEN ARRAY['adult', 'adulterate', 'adulation', 'adulatory']
    WHEN id = 139 AND value = 'dilig' THEN ARRAY['diligent', 'diligence']
    WHEN id = 99 AND value = 'loqu' THEN ARRAY['eloquent', 'loquacious', 'colloquial', 'soliloquy', 'grandiloquent', 'elocution']
    WHEN id = 141 AND value = 'eph' THEN ARRAY['ephemeral', 'ephemeris', 'ephemeron']
    WHEN id = 142 AND value = 'eff' THEN ARRAY['effect', 'effective', 'efface', 'effort', 'efficacy', 'efficient', 'effusion']
    WHEN id = 143 AND value = 'melli' THEN ARRAY['mellifluous', 'mellify', 'melliferous', 'mellifluent']
    WHEN id = 144 AND value = 'metic' THEN ARRAY['meticulous', 'meticulosity']
    WHEN id = 5 AND value = 'vol' THEN ARRAY['volume', 'volition', 'volunteer', 'volatile', 'volley', 'benevolent', 'malevolent']
    WHEN id = 6 AND value = 'fusc' THEN ARRAY['obfuscate', 'fuscous', 'infuscate']
    WHEN id = 146 AND value = 'nic' THEN ARRAY['pernicious', 'nicotine', 'internecine']
    WHEN id = 147 AND value = 'essent' THEN ARRAY['essential', 'essentially', 'quintessential', 'essence']
    WHEN id = 148 AND value = 'sil' THEN ARRAY['resilient', 'resilience', 'silicone', 'silhouette', 'missile', 'fossil']
    WHEN id = 149 AND value = 'dipity' THEN ARRAY['serendipity']
    WHEN id = 150 AND value = 'sond' THEN ARRAY['sonder', 'sondage']
    WHEN id = 151 AND value = 'syco' THEN ARRAY['sycophant', 'sycophantic', 'psychosomatic']
    WHEN id = 152 AND value = 'quil' THEN ARRAY['tranquil', 'tranquility', 'tranquilize', 'tranquilizer']
    WHEN id = 153 AND value = 'quis' THEN ARRAY['inquisitive', 'requisite', 'exquisite', 'perquisite', 'acquisition', 'requisition']
    WHEN id = 154 AND value = 'os' THEN ARRAY['osmosis', 'osmotic', 'ostentatious', 'ostrich', 'ostensible', 'ossify', 'osseous']
    WHEN id = 105 AND value = 'seren' THEN ARRAY['serene', 'serenity', 'serendipity', 'serenade', 'serenata']
    
    -- Suffixes
    WHEN id = 7 AND value = 'able' THEN ARRAY['probable', 'capable', 'adorable', 'durable', 'portable', 'lovable', 'favorable']
    WHEN id = 8 AND value = 'ent' THEN ARRAY['dependent', 'confident', 'consistent', 'different', 'excellent', 'benevolent', 'diligent']
    WHEN id = 9 AND value = 'ate' THEN ARRAY['create', 'donate', 'hesitate', 'locate', 'mediate', 'narrate', 'dictate', 'elate']
    WHEN id = 155 AND value = 'ant' THEN ARRAY['elegant', 'dominant', 'important', 'distant', 'tolerant', 'vagrant', 'defiant']
    WHEN id = 156 AND value = 'ance' THEN ARRAY['allowance', 'appearance', 'assistance', 'distance', 'instance', 'performance']
    WHEN id = 157 AND value = 'ive' THEN ARRAY['active', 'massive', 'creative', 'defensive', 'excessive', 'native', 'passive']
    WHEN id = 159 AND value = 'ious' THEN ARRAY['anxious', 'curious', 'delicious', 'furious', 'obvious', 'previous', 'serious']
    WHEN id = 160 AND value = 'use' THEN ARRAY['abuse', 'excuse', 'misuse', 'refuse', 'abstruse', 'accuse', 'amuse', 'confuse']
    WHEN id = 161 AND value = 'ic' THEN ARRAY['basic', 'comic', 'magic', 'music', 'public', 'static', 'toxic', 'acerbic']
    WHEN id = 162 AND value = 'esce' THEN ARRAY['acquiesce', 'coalesce', 'convalesce', 'effervesce', 'adolescence', 'obsolescence']
    WHEN id = 163 AND value = 'en' THEN ARRAY['broken', 'frozen', 'golden', 'hidden', 'harden', 'lighten', 'sharpen', 'weaken']
    WHEN id = 164 AND value = 'ish' THEN ARRAY['childish', 'finish', 'foolish', 'selfish', 'polish', 'publish', 'admonish', 'establish']
    WHEN id = 165 AND value = 'ous' THEN ARRAY['joyous', 'dangerous', 'famous', 'generous', 'nervous', 'previous', 'zealous']
    WHEN id = 167 AND value = 'al' THEN ARRAY['dental', 'final', 'royal', 'social', 'usual', 'normal', 'mental', 'ephemeral']
    WHEN id = 170 AND value = 'uous' THEN ARRAY['arduous', 'tempestuous', 'tumultuous', 'tortuous', 'sumptuous', 'mellifluous']
    WHEN id = 171 AND value = 'ulous' THEN ARRAY['meticulous', 'ridiculous', 'miraculous', 'fabulous', 'nebulous', 'scrupulous']
    WHEN id = 172 AND value = 'tic' THEN ARRAY['artistic', 'domestic', 'elastic', 'fantastic', 'genetic', 'pragmatic', 'romantic']
    WHEN id = 173 AND value = 'ial' THEN ARRAY['facial', 'initial', 'official', 'racial', 'social', 'special', 'quintessential']
    WHEN id = 174 AND value = 'ient' THEN ARRAY['patient', 'ancient', 'efficient', 'proficient', 'sufficient', 'resilient', 'transient']
    WHEN id = 175 AND value = 'ity' THEN ARRAY['ability', 'clarity', 'density', 'fertility', 'humanity', 'reality', 'serendipity']
    WHEN id = 176 AND value = 'er' THEN ARRAY['baker', 'dancer', 'fighter', 'leader', 'teacher', 'speaker', 'writer', 'sonder']
    WHEN id = 178 AND value = 'il' THEN ARRAY['civil', 'fossil', 'pencil', 'pupil', 'tranquil', 'until', 'utensil', 'vigil']
    ELSE examples
END;`
    );
    
    
    await client.query('COMMIT');
    console.log('Successfully added morpheme examples');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding morpheme examples:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the seeder
addMorphemeExamples().then(() => {
  console.log('Completed morpheme example seeding');
  process.exit(0);
}).catch((error) => {
  console.error('Failed to seed morphemes examples:', error);
  process.exit(1);
});
