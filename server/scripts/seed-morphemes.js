const { pool } = require('../services/database');

async function seedMorphemes() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Word list to process
    const wordList = [
      'abase', 'abate', 'aberrant', 'abeyance', 'abhor', 'abject', 'abjure', 'abnegate', 
      'abrasive', 'abrogate', 'abstemious', 'abstruse', 'acerbic', 'acme', 'acquiesce', 
      'acumen', 'adamant', 'admonish', 'adroit', 'adulation', 'ambiguous', 'benevolent', 
      'diligent', 'eloquent', 'ephemeral', 'ineffable', 'loquacious', 'mellifluous', 
      'meticulous', 'obfuscate', 'pernicious', 'pragmatic', 'quintessential', 'resilient', 
      'serendipity', 'sonder', 'sycophant', 'tranquil', 'ubiquitous', 'verbose'
    ];

    // Define morphemes for all words
    const morphemes = [
      // Prefixes
      {
        value: 'a',
        type: 'prefix',
        meaning: 'to, toward, on, at, from',
        language_origin: 'Latin/Greek',
        examples: ['abase', 'abate', 'aberrant']
      },
      {
        value: 'ab',
        type: 'prefix',
        meaning: 'away from, off',
        language_origin: 'Latin',
        examples: ['aberrant', 'abhor', 'abject', 'abjure', 'abnegate']
      },
      {
        value: 'ad',
        type: 'prefix',
        meaning: 'to, toward',
        language_origin: 'Latin',
        examples: ['adamant', 'admonish', 'adroit', 'adulation']
      },
      {
        value: 'ambi',
        type: 'prefix',
        meaning: 'both, around',
        language_origin: 'Latin',
        examples: ['ambiguous']
      },
      {
        value: 'bene',
        type: 'prefix',
        meaning: 'good, well',
        language_origin: 'Latin',
        examples: ['benevolent']
      },
      {
        value: 'di',
        type: 'prefix',
        meaning: 'two, double, apart',
        language_origin: 'Latin',
        examples: ['diligent']
      },
      {
        value: 'e',
        type: 'prefix',
        meaning: 'out, from',
        language_origin: 'Latin',
        examples: ['eloquent', 'ephemeral']
      },
      {
        value: 'in',
        type: 'prefix',
        meaning: 'not, without',
        language_origin: 'Latin',
        examples: ['ineffable']
      },
      {
        value: 'loqu',
        type: 'root',
        meaning: 'talk, speak',
        language_origin: 'Latin',
        examples: ['loquacious', 'eloquent']
      },
      {
        value: 'ob',
        type: 'prefix',
        meaning: 'against, toward, in the way',
        language_origin: 'Latin',
        examples: ['obfuscate']
      },
      {
        value: 'per',
        type: 'prefix',
        meaning: 'through, thoroughly, entirely',
        language_origin: 'Latin',
        examples: ['pernicious']
      },
      {
        value: 'pragma',
        type: 'root',
        meaning: 'deed, action',
        language_origin: 'Greek',
        examples: ['pragmatic']
      },
      {
        value: 'quint',
        type: 'prefix',
        meaning: 'five, fifth',
        language_origin: 'Latin',
        examples: ['quintessential']
      },
      {
        value: 're',
        type: 'prefix',
        meaning: 'again, back',
        language_origin: 'Latin',
        examples: ['resilient']
      },
      {
        value: 'seren',
        type: 'root',
        meaning: 'clear, tranquil',
        language_origin: 'Latin',
        examples: ['serendipity']
      },
      {
        value: 'trans',
        type: 'prefix',
        meaning: 'across, beyond, through',
        language_origin: 'Latin',
        examples: ['tranquil']
      },
      {
        value: 'ubi',
        type: 'prefix',
        meaning: 'where, everywhere',
        language_origin: 'Latin',
        examples: ['ubiquitous']
      },
      {
        value: 'verb',
        type: 'root',
        meaning: 'word',
        language_origin: 'Latin',
        examples: ['verbose']
      },

      // Roots
      {
        value: 'bas',
        type: 'root',
        meaning: 'low, base',
        language_origin: 'Latin',
        examples: ['abase']
      },
      {
        value: 'bat',
        type: 'root',
        meaning: 'beat, strike',
        language_origin: 'Latin',
        examples: ['abate']
      },
      {
        value: 'err',
        type: 'root',
        meaning: 'wander, stray',
        language_origin: 'Latin',
        examples: ['aberrant']
      },
      {
        value: 'bey',
        type: 'root',
        meaning: 'wait, hold',
        language_origin: 'Old French',
        examples: ['abeyance']
      },
      {
        value: 'hor',
        type: 'root',
        meaning: 'shudder, dread',
        language_origin: 'Latin',
        examples: ['abhor']
      },
      {
        value: 'ject',
        type: 'root',
        meaning: 'throw',
        language_origin: 'Latin',
        examples: ['abject']
      },
      {
        value: 'jur',
        type: 'root',
        meaning: 'swear, oath',
        language_origin: 'Latin',
        examples: ['abjure']
      },
      {
        value: 'neg',
        type: 'root',
        meaning: 'deny',
        language_origin: 'Latin',
        examples: ['abnegate']
      },
      {
        value: 'ras',
        type: 'root',
        meaning: 'scrape, scratch',
        language_origin: 'Latin',
        examples: ['abrasive']
      },
      {
        value: 'rog',
        type: 'root',
        meaning: 'ask',
        language_origin: 'Latin',
        examples: ['abrogate']
      },
      {
        value: 'stem',
        type: 'root',
        meaning: 'hold back',
        language_origin: 'Latin',
        examples: ['abstemious']
      },
      {
        value: 'trus',
        type: 'root',
        meaning: 'push, thrust',
        language_origin: 'Latin',
        examples: ['abstruse']
      },
      {
        value: 'acerb',
        type: 'root',
        meaning: 'bitter, harsh',
        language_origin: 'Latin',
        examples: ['acerbic']
      },
      {
        value: 'ac',
        type: 'root',
        meaning: 'sharp, pointed',
        language_origin: 'Greek',
        examples: ['acme']
      },
      {
        value: 'men',
        type: 'suffix',
        meaning: 'result, means',
        language_origin: 'Latin',
        examples: ['acumen']
      },
      {
        value: 'ation',
        type: 'suffix',
        meaning: 'action or process',
        language_origin: 'Latin',
        examples: ['adulation']
      },
      {
        value: 'gu',
        type: 'root',
        meaning: 'drive, lead',
        language_origin: 'Latin',
        examples: ['ambiguous']
      },
      {
        value: 'emer',
        type: 'root',
        meaning: 'day',
        language_origin: 'Greek',
        examples: ['ephemeral']
      },
      {
        value: 'flu',
        type: 'root',
        meaning: 'flow',
        language_origin: 'Latin',
        examples: ['mellifluous']
      },
      {
        value: 'ul',
        type: 'suffix',
        meaning: 'small, diminutive',
        language_origin: 'Latin',
        examples: ['meticulous']
      },
      {
        value: 'phant',
        type: 'root',
        meaning: 'to show, reveal',
        language_origin: 'Greek',
        examples: ['sycophant']
      },
      {
        value: 'quit',
        type: 'root',
        meaning: 'where, place',
        language_origin: 'Latin',
        examples: ['ubiquitous']
      },
      {
        value: 'quie',
        type: 'root',
        meaning: 'rest, quiet',
        language_origin: 'Latin',
        examples: ['acquiesce']
      },
      {
        value: 'acu',
        type: 'root',
        meaning: 'sharp',
        language_origin: 'Latin',
        examples: ['acumen']
      },
      {
        value: 'adam',
        type: 'root',
        meaning: 'invincible, untameable',
        language_origin: 'Greek',
        examples: ['adamant']
      },
      {
        value: 'mon',
        type: 'root',
        meaning: 'warn, advise',
        language_origin: 'Latin',
        examples: ['admonish']
      },
      {
        value: 'droit',
        type: 'root',
        meaning: 'right, straight',
        language_origin: 'Latin via French',
        examples: ['adroit']
      },
      {
        value: 'adul',
        type: 'root',
        meaning: 'flatter',
        language_origin: 'Latin',
        examples: ['adulation']
      },
      {
        value: 'ambi',
        type: 'root',
        meaning: 'both sides',
        language_origin: 'Latin',
        examples: ['ambiguous']
      },
      {
        value: 'vol',
        type: 'root',
        meaning: 'wish, will',
        language_origin: 'Latin',
        examples: ['benevolent']
      },
      {
        value: 'dilig',
        type: 'root',
        meaning: 'choose, select, love',
        language_origin: 'Latin',
        examples: ['diligent']
      },
      {
        value: 'loqu',
        type: 'root',
        meaning: 'speak',
        language_origin: 'Latin',
        examples: ['eloquent', 'loquacious']
      },
      {
        value: 'eph',
        type: 'root',
        meaning: 'upon, over',
        language_origin: 'Greek',
        examples: ['ephemeral']
      },
      {
        value: 'eff',
        type: 'root',
        meaning: 'speak out',
        language_origin: 'Latin',
        examples: ['ineffable']
      },
      {
        value: 'melli',
        type: 'root',
        meaning: 'honey',
        language_origin: 'Latin',
        examples: ['mellifluous']
      },
      {
        value: 'metic',
        type: 'root',
        meaning: 'fear, apprehension',
        language_origin: 'Greek',
        examples: ['meticulous']
      },
      {
        value: 'fusc',
        type: 'root',
        meaning: 'dark',
        language_origin: 'Latin',
        examples: ['obfuscate']
      },
      {
        value: 'nic',
        type: 'root',
        meaning: 'harm, death',
        language_origin: 'Latin',
        examples: ['pernicious']
      },
      {
        value: 'essent',
        type: 'root',
        meaning: 'being, essence',
        language_origin: 'Latin',
        examples: ['quintessential']
      },
      {
        value: 'sil',
        type: 'root',
        meaning: 'jump, leap',
        language_origin: 'Latin',
        examples: ['resilient']
      },
      {
        value: 'dipity',
        type: 'suffix',
        meaning: 'state, quality',
        language_origin: 'English',
        examples: ['serendipity']
      },
      {
        value: 'sond',
        type: 'root',
        meaning: 'question, probe',
        language_origin: 'French',
        examples: ['sonder']
      },
      {
        value: 'syco',
        type: 'root',
        meaning: 'fig',
        language_origin: 'Greek',
        examples: ['sycophant']
      },
      {
        value: 'quil',
        type: 'root',
        meaning: 'calm',
        language_origin: 'Latin',
        examples: ['tranquil']
      },
      {
        value: 'quis',
        type: 'root',
        meaning: 'who, which',
        language_origin: 'Latin',
        examples: ['ubiquitous']
      },
      {
        value: 'os',
        type: 'root',
        meaning: 'mouth',
        language_origin: 'Latin',
        examples: ['verbose']
      },

      // Suffixes
      {
        value: 'ant',
        type: 'suffix',
        meaning: 'performing, causing',
        language_origin: 'Latin',
        examples: ['aberrant', 'adamant']
      },
      {
        value: 'ance',
        type: 'suffix',
        meaning: 'state, quality, or process',
        language_origin: 'Latin',
        examples: ['abeyance']
      },
      {
        value: 'ive',
        type: 'suffix',
        meaning: 'relating to, tending to',
        language_origin: 'Latin',
        examples: ['abrasive']
      },
      {
        value: 'ate',
        type: 'suffix',
        meaning: 'cause to be, make into',
        language_origin: 'Latin',
        examples: ['abate', 'abrogate']
      },
      {
        value: 'ious',
        type: 'suffix',
        meaning: 'characterized by, full of',
        language_origin: 'Latin',
        examples: ['abstemious']
      },
      {
        value: 'use',
        type: 'suffix',
        meaning: 'state, quality',
        language_origin: 'Latin',
        examples: ['abstruse']
      },
      {
        value: 'ic',
        type: 'suffix',
        meaning: 'pertaining to, of the nature of',
        language_origin: 'Greek/Latin',
        examples: ['acerbic']
      },
      {
        value: 'esce',
        type: 'suffix',
        meaning: 'begin to be, become',
        language_origin: 'Latin',
        examples: ['acquiesce']
      },
      {
        value: 'en',
        type: 'suffix',
        meaning: 'made of, characterized by',
        language_origin: 'Latin',
        examples: ['acumen']
      },
      {
        value: 'ish',
        type: 'suffix',
        meaning: 'cause to, make',
        language_origin: 'Old English',
        examples: ['admonish']
      },
      {
        value: 'ous',
        type: 'suffix',
        meaning: 'full of, having',
        language_origin: 'Latin',
        examples: ['ambiguous']
      },
      {
        value: 'ent',
        type: 'suffix',
        meaning: 'characterized by, being in a state of',
        language_origin: 'Latin',
        examples: ['benevolent', 'diligent', 'eloquent']
      },
      {
        value: 'al',
        type: 'suffix',
        meaning: 'relating to, pertaining to',
        language_origin: 'Latin',
        examples: ['ephemeral']
      },
      {
        value: 'able',
        type: 'suffix',
        meaning: 'capable of, suitable for',
        language_origin: 'Latin',
        examples: ['ineffable']
      },
      {
        value: 'ious',
        type: 'suffix',
        meaning: 'characterized by, full of',
        language_origin: 'Latin',
        examples: ['loquacious', 'pernicious']
      },
      {
        value: 'uous',
        type: 'suffix',
        meaning: 'characterized by, full of',
        language_origin: 'Latin',
        examples: ['mellifluous']
      },
      {
        value: 'ulous',
        type: 'suffix',
        meaning: 'tending to, inclined to',
        language_origin: 'Latin',
        examples: ['meticulous']
      },
      {
        value: 'tic',
        type: 'suffix',
        meaning: 'relating to, characterized by',
        language_origin: 'Greek',
        examples: ['pragmatic']
      },
      {
        value: 'ial',
        type: 'suffix',
        meaning: 'relating to, having the character of',
        language_origin: 'Latin',
        examples: ['quintessential']
      },
      {
        value: 'ient',
        type: 'suffix',
        meaning: 'characterized by, being in a state of',
        language_origin: 'Latin',
        examples: ['resilient']
      },
      {
        value: 'ity',
        type: 'suffix',
        meaning: 'state, quality',
        language_origin: 'Latin',
        examples: ['serendipity']
      },
      {
        value: 'er',
        type: 'suffix',
        meaning: 'person or thing that does',
        language_origin: 'Old English',
        examples: ['sonder']
      },
      {
        value: 'ant',
        type: 'suffix',
        meaning: 'one who performs',
        language_origin: 'Latin/Greek',
        examples: ['sycophant']
      },
      {
        value: 'il',
        type: 'suffix',
        meaning: 'pertaining to',
        language_origin: 'Latin',
        examples: ['tranquil']
      },
      {
        value: 'ous',
        type: 'suffix',
        meaning: 'full of, having',
        language_origin: 'Latin',
        examples: ['ubiquitous', 'verbose']
      }
    ];

    // Word morpheme relationships
    const wordMorphemeMap = {
      'abase': [
        { value: 'a', position: 0 },
        { value: 'bas', position: 1 },
        { value: 'e', position: 2 }
      ],
      'abate': [
        { value: 'a', position: 0 },
        { value: 'bat', position: 1 },
        { value: 'e', position: 2 }
      ],
      'aberrant': [
        { value: 'ab', position: 0 },
        { value: 'err', position: 1 },
        { value: 'ant', position: 2 }
      ],
      'abeyance': [
        { value: 'a', position: 0 },
        { value: 'bey', position: 1 },
        { value: 'ance', position: 2 }
      ],
      'abhor': [
        { value: 'ab', position: 0 },
        { value: 'hor', position: 1 }
      ],
      'abject': [
        { value: 'ab', position: 0 },
        { value: 'ject', position: 1 }
      ],
      'abjure': [
        { value: 'ab', position: 0 },
        { value: 'jur', position: 1 },
        { value: 'e', position: 2 }
      ],
      'abnegate': [
        { value: 'ab', position: 0 },
        { value: 'neg', position: 1 },
        { value: 'ate', position: 2 }
      ],
      'abrasive': [
        { value: 'ab', position: 0 },
        { value: 'ras', position: 1 },
        { value: 'ive', position: 2 }
      ],
      'abrogate': [
        { value: 'ab', position: 0 },
        { value: 'rog', position: 1 },
        { value: 'ate', position: 2 }
      ],
      'abstemious': [
        { value: 'ab', position: 0 },
        { value: 'stem', position: 1 },
        { value: 'ious', position: 2 }
      ],
      'abstruse': [
        { value: 'ab', position: 0 },
        { value: 'trus', position: 1 },
        { value: 'e', position: 2 }
      ],
      'acerbic': [
        { value: 'acerb', position: 0 },
        { value: 'ic', position: 1 }
      ],
      'acme': [
        { value: 'ac', position: 0 },
        { value: 'me', position: 1 }
      ],
      'acquiesce': [
        { value: 'ac', position: 0 },
        { value: 'quie', position: 1 },
        { value: 'esce', position: 2 }
      ],
      'acumen': [
        { value: 'acu', position: 0 },
        { value: 'men', position: 1 }
      ],
      'adamant': [
        { value: 'adam', position: 0 },
        { value: 'ant', position: 1 }
      ],
      'admonish': [
        { value: 'ad', position: 0 },
        { value: 'mon', position: 1 },
        { value: 'ish', position: 2 }
      ],
      'adroit': [
        { value: 'ad', position: 0 },
        { value: 'droit', position: 1 }
      ],
      'adulation': [
        { value: 'adul', position: 0 },
        { value: 'ation', position: 1 }
      ],
      'ambiguous': [
        { value: 'ambi', position: 0 },
        { value: 'gu', position: 1 },
        { value: 'ous', position: 2 }
      ],
      'benevolent': [
        { value: 'bene', position: 0 },
        { value: 'vol', position: 1 },
        { value: 'ent', position: 2 }
      ],
      'diligent': [
        { value: 'dilig', position: 0 },
        { value: 'ent', position: 1 }
      ],
      'eloquent': [
        { value: 'e', position: 0 },
        { value: 'loqu', position: 1 },
        { value: 'ent', position: 2 }
      ],
      'ephemeral': [
        { value: 'eph', position: 0 },
        { value: 'emer', position: 1 },
        { value: 'al', position: 2 }
      ],
      'ineffable': [
        { value: 'in', position: 0 },
        { value: 'eff', position: 1 },
        { value: 'able', position: 2 }
      ],
      'loquacious': [
        { value: 'loqu', position: 0 },
        { value: 'ac', position: 1 },
        { value: 'ious', position: 2 }
      ],
      'mellifluous': [
        { value: 'melli', position: 0 },
        { value: 'flu', position: 1 },
        { value: 'ous', position: 2 }
      ],
      'meticulous': [
        { value: 'metic', position: 0 },
        { value: 'ul', position: 1 },
        { value: 'ous', position: 2 }
      ],
      'obfuscate': [
        { value: 'ob', position: 0 },
        { value: 'fusc', position: 1 },
        { value: 'ate', position: 2 }
      ],
      'pernicious': [
        { value: 'per', position: 0 },
        { value: 'nic', position: 1 },
        { value: 'ious', position: 2 }
      ],
      'pragmatic': [
        { value: 'pragma', position: 0 },
        { value: 'tic', position: 1 }
      ],
      'quintessential': [
        { value: 'quint', position: 0 },
        { value: 'essent', position: 1 },
        { value: 'ial', position: 2 }
      ],
      'resilient': [
        { value: 're', position: 0 },
        { value: 'sil', position: 1 },
        { value: 'ient', position: 2 }
      ],
      'serendipity': [
        { value: 'seren', position: 0 },
        { value: 'dipity', position: 1 }
      ],
      'sonder': [
        { value: 'sond', position: 0 },
        { value: 'er', position: 1 }
      ],
      'sycophant': [
        { value: 'syco', position: 0 },
        { value: 'phant', position: 1 }
      ],
      'tranquil': [
        { value: 'trans', position: 0 },
        { value: 'quil', position: 1 }
      ],
      'ubiquitous': [
        { value: 'ubi', position: 0 },
        { value: 'quit', position: 1 },
        { value: 'ous', position: 2 }
      ],
      'verbose': [
        { value: 'verb', position: 0 },
        { value: 'os', position: 1 },
        { value: 'e', position: 2 }
      ]
    };

    // Word etymologies
    const wordEtymologies = {
      'abase': {
        origin: 'Old French',
        period: 'Middle English',
        development: [
          'From Old French "abaissier" (to lower, diminish)',
          'Formed from a- (to) + baissier (to lower)',
          'Entered English in the 14th century'
        ]
      },
      'abate': {
        origin: 'Old French',
        period: 'Middle English',
        development: [
          'From Old French "abattre" (to beat down)',
          'Formed from a- (to) + battre (to beat)',
          'Entered English in the 14th century'
        ]
      },
      'aberrant': {
        origin: 'Latin',
        period: 'Early Modern English',
        development: [
          'From Latin "aberrantem" (wandering away)',
          'Formed from ab- (away) + errare (to wander)',
          'Entered English in the 16th century'
        ]
      },
      'abeyance': {
        origin: 'Old French',
        period: 'Middle English',
        development: [
          'From Old French "abeance" (expectation, aspiration)',
          'From a- (to) + béer (to gape, aspire to)',
          'Entered English in the 16th century'
        ]
      },
      'abhor': {
        origin: 'Latin',
        period: 'Middle English',
        development: [
          'From Latin "abhorrere" (to shrink back from in terror)',
          'Formed from ab- (away) + horrere (to bristle with fear)',
          'Entered English in the 14th century'
        ]
      },
      'abject': {
        origin: 'Latin',
        period: 'Middle English',
        development: [
          'From Latin "abjectus" (thrown down)',
          'Past participle of abicere (to cast away)',
          'From ab- (away) + jacere (to throw)',
          'Entered English in the 15th century'
        ]
      },
      'abjure': {
        origin: 'Latin',
        period: 'Middle English',
        development: [
          'From Latin "abjurare" (to deny under oath)',
          'Formed from ab- (away) + jurare (to swear)',
          'Entered English in the 15th century'
        ]
      },
      'abnegate': {
        origin: 'Latin',
        period: 'Early Modern English',
        development: [
          'From Latin "abnegare" (to refuse, deny)',
          'Formed from ab- (away) + negare (to deny)',
          'Entered English in the 16th century'
        ]
      },
      'abrasive': {
        origin: 'Latin',
        period: 'Modern English',
        development: [
          'From Latin "abradere" (to scrape off)',
          'Formed from ab- (away) + radere (to scrape)',
          'Entered English in the 19th century'
        ]
      },
      'abrogate': {
        origin: 'Latin',
        period: 'Early Modern English',
        development: [
          'From Latin "abrogare" (to repeal, annul)',
          'Formed from ab- (away) + rogare (to ask, propose)',
          'Entered English in the 16th century'
        ]
      },
      'abstemious': {
        origin: 'Latin',
        period: 'Early Modern English',
        development: [
          'From Latin "abstemius" (moderate, sober)',
          'Possibly from abs- (from) + temetum (intoxicating drink)',
          'Entered English in the early 17th century'
        ]
      },
      'abstruse': {
        origin: 'Latin',
        period: 'Early Modern English',
        development: [
          'From Latin "abstrusus" (hidden, concealed)',
          'Past participle of abstrudere (to push away)',
          'From abs- (away) + trudere (to push, thrust)',
          'Entered English in the 16th century'
        ]
      },
      'acerbic': {
        origin: 'Latin',
        period: 'Modern English',
        development: [
          'From Latin "acerbus" (harsh, bitter)',
          'Related to acer (sharp)',
          'Entered English in the 19th century'
        ]
      },
      'acme': {
        origin: 'Greek',
        period: 'Early Modern English',
        development: [
          'From Greek "akme" (peak, highest point)',
          'Related to akis (point)',
          'Entered English in the 17th century'
        ]
      },
      'acquiesce': {
        origin: 'Latin',
        period: 'Early Modern English',
        development: [
          'From Latin "acquiescere" (to rest, find rest in)',
          'Formed from ad- (to) + quiescere (to rest)',
          'Entered English in the 17th century'
        ]
      },
      'acumen': {
        origin: 'Latin',
        period: 'Early Modern English',
        development: [
          'From Latin "acumen" (sharpness, point)',
          'From acuere (to sharpen)',
          'Entered English in the 16th century'
        ]
      },
      'adamant': {
        origin: 'Greek',
        period: 'Old English',
        development: [
          'From Greek "adamas" (unbreakable, invincible)',
          'Formed from a- (not) + daman (to tame, subdue)',
          'Entered English before the 12th century'
        ]
      },
      'admonish': {
        origin: 'Latin',
        period: 'Middle English',
        development: [
          'From Latin "admonere" (to warn, advise)',
          'Formed from ad- (to) + monere (to warn)',
          'Entered English in the 14th century'
        ]
      },
      'adroit': {
        origin: 'French',
        period: 'Early Modern English',
        development: [
          'From French "adroit" (skillful, clever)',
          'From à droit (according to right)',
          'Entered English in the 17th century'
        ]
      },
      'adulation': {
        origin: 'Latin',
        period: 'Middle English',
        development: [
          'From Latin "adulatio" (flattery)',
          'From adulari (to flatter)',
          'Entered English in the 15th century'
        ]
      },
      'ambiguous': {
        origin: 'Latin',
        period: 'Early Modern English',
        development: [
          'From Latin "ambiguus" (doubtful, uncertain)',
          'From ambigere (to wander about, dispute)',
          'From ambi- (around) + agere (to drive)',
          'Entered English in the 16th century'
        ]
      },
      'benevolent': {
        origin: 'Latin',
        period: 'Middle English',
        development: [
          'From Latin "benevolens" (wishing well)',
          'Formed from bene- (well) + volens (wishing)',
          'Entered English in the 15th century'
        ]
      },
      'diligent': {
        origin: 'Latin',
        period: 'Middle English',
        development: [
          'From Latin "diligens" (attentive, careful)',
          'Present participle of diligere (to value, esteem)',
          'From dis- (apart) + legere (to choose, pick out)',
          'Entered English in the 14th century'
        ]
      },
      'eloquent': {
        origin: 'Latin',
        period: 'Middle English',
        development: [
          'From Latin "eloquens" (speaking, fluent)',
          'Present participle of eloqui (to speak out)',
          'From e- (out) + loqui (to speak)',
          'Entered English in the 14th century'
        ]
      },
      'ephemeral': {
        origin: 'Greek',
        period: 'Early Modern English',
        development: [
          'From Greek "ephemeros" (lasting only a day)',
          'Formed from epi- (on) + hemera (day)',
          'Entered English in the 16th century'
        ]
      },
      'ineffable': {
        origin: 'Latin',
        period: 'Middle English',
        development: [
          'From Latin "ineffabilis" (unutterable)',
          'Formed from in- (not) + effabilis (utterable)',
          'From ex- (out) + fari (to speak)',
          'Entered English in the 15th century'
        ]
      },
      'loquacious': {
        origin: 'Latin',
        period: 'Early Modern English',
        development: [
          'From Latin "loquax" (talkative)',
          'From loqui (to speak)',
          'Entered English in the 17th century'
        ]
      },
      'mellifluous': {
        origin: 'Latin',
        period: 'Middle English',
        development: [
          'From Latin "mellifluus" (flowing with honey)',
          'Formed from mel (honey) + fluere (to flow)',
          'Entered English in the 15th century'
        ]
      },
      'meticulous': {
        origin: 'Latin',
        period: 'Early Modern English',
        development: [
          'From Latin "meticulosus" (fearful, timid)',
          'From metus (fear) + -culus (diminutive suffix)',
          'Entered English in the 16th century, with meaning shifting to "careful, precise"'
        ]
      },
      'obfuscate': {
        origin: 'Latin',
        period: 'Early Modern English',
        development: [
          'From Latin "obfuscare" (to darken)',
          'Formed from ob- (over) + fuscare (to darken)',
          'From fuscus (dark)',
          'Entered English in the 16th century'
        ]
      },
      'pernicious': {
        origin: 'Latin',
        period: 'Middle English',
        development: [
          'From Latin "perniciosus" (destructive)',
          'From pernicies (destruction)',
          'From per- (thoroughly) + nex (death)',
          'Entered English in the 15th century'
        ]
      },
      'pragmatic': {
        origin: 'Greek',
        period: 'Early Modern English',
        development: [
          'From Greek "pragmatikos" (relating to affairs)',
          'From pragma (deed, act)',
          'From prassein (to do)',
          'Entered English in the 16th century'
        ]
      },
      'quintessential': {
        origin: 'Latin',
        period: 'Early Modern English',
        development: [
          'From Medieval Latin "quinta essentia" (fifth essence)',
          'Referring to the fifth element in ancient and medieval philosophy',
          'Entered English in the 16th century'
        ]
      },
      'resilient': {
        origin: 'Latin',
        period: 'Classical Latin',
        development: [
          'From Latin "resilire" (to leap back, rebound)',
          'Formed from re- (back) + salire (to leap)',
          'Entered English in the 17th century'
        ]
      },
      'serendipity': {
        origin: 'English',
        period: 'Modern English',
        development: [
          'Coined by Horace Walpole in 1754',
          'Based on the Persian fairy tale "The Three Princes of Serendip"',
          'From Serendip (old name for Sri Lanka) + -ity (state or quality)'
        ]
      },
      'sonder': {
        origin: 'English',
        period: 'Contemporary English',
        development: [
          'Neologism coined by John Koenig for The Dictionary of Obscure Sorrows',
          'Possibly influenced by French "sonder" (to probe, explore)',
          'Created in the early 21st century'
        ]
      },
      'sycophant': {
        origin: 'Greek',
        period: 'Early Modern English',
        development: [
          'From Greek "sykophantes" (false accuser)',
          'Literally "fig-revealer" from sykon (fig) + phainein (to show)',
          'Originally referred to informers against illegal exportation of figs',
          'Entered English in the 16th century'
        ]
      },
      'tranquil': {
        origin: 'Latin',
        period: 'Early Modern English',
        development: [
          'From Latin "tranquillus" (calm, still)',
          'Possibly from trans- (across, beyond) + quies (rest)',
          'Entered English in the 16th century'
        ]
      },
      'ubiquitous': {
        origin: 'Latin',
        period: 'Modern English',
        development: [
          'From Latin "ubique" (everywhere)',
          'From ubi (where) + -que (and, also)',
          'Entered English in the 19th century'
        ]
      },
      'verbose': {
        origin: 'Latin',
        period: 'Early Modern English',
        development: [
          'From Latin "verbosus" (wordy)',
          'From verbum (word)',
          'Entered English in the 17th century'
        ]
      }
    };

    // Insert all morphemes
    console.log('Inserting morphemes...');
    for (const morpheme of morphemes) {
      await client.query(
        `INSERT INTO morphemes (value, type, meaning, language_origin, examples)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (value) DO UPDATE SET
           type = EXCLUDED.type,
           meaning = EXCLUDED.meaning,
           language_origin = EXCLUDED.language_origin,
           examples = EXCLUDED.examples
         RETURNING id, value`,
        [morpheme.value, morpheme.type, morpheme.meaning, morpheme.language_origin, morpheme.examples]
      );
    }
    console.log('Morphemes inserted successfully');

    // Get all words from the database
    console.log('Retrieving words from database...');
    const words = await client.query(
      `SELECT id, value FROM words WHERE value = ANY($1)`,
      [wordList]
    );

    // Create a map of word values to their IDs
    const wordMap = {};
    for (const word of words.rows) {
      wordMap[word.value] = word.id;
    }

    // Process each word in our list
    console.log('Processing words and creating relationships...');
    for (const wordValue of wordList) {
      const wordId = wordMap[wordValue];
      
      // Skip if word is not in the database
      if (!wordId) {
        console.log(`Word "${wordValue}" not found in database, skipping...`);
        continue;
      }

      // Get morpheme relationships for this word
      const wordMorphemes = wordMorphemeMap[wordValue] || [];
      
      // Delete existing word-morpheme relationships for this word
      await client.query(
        `DELETE FROM word_morphemes WHERE word_id = $1`,
        [wordId]
      );

      // Add morpheme relationships for this word
      for (const morphemeData of wordMorphemes) {
        // Get morpheme ID
        const morphemeResult = await client.query(
          'SELECT id FROM morphemes WHERE value = $1',
          [morphemeData.value]
        );
        
        if (morphemeResult.rows.length === 0) {
          console.log(`Morpheme "${morphemeData.value}" not found, skipping...`);
          continue;
        }
        
        const morphemeId = morphemeResult.rows[0].id;
        
        // Insert word-morpheme relationship
        await client.query(
          `INSERT INTO word_morphemes (word_id, morpheme_id, position)
           VALUES ($1, $2, $3)
           ON CONFLICT (word_id, morpheme_id) DO UPDATE SET position = EXCLUDED.position`,
          [wordId, morphemeId, morphemeData.position]
        );
      }

      // Update word etymology if available
      const etymology = wordEtymologies[wordValue];
      if (etymology) {
        await client.query(
          `UPDATE words 
           SET etymology_origin = $1,
               etymology_period = $2,
               etymology_development = $3
           WHERE id = $4`,
          [
            etymology.origin,
            etymology.period,
            etymology.development,
            wordId
          ]
        );
      }
    }

    // Create word family relationships
    console.log('Creating word family relationships...');
    
    // Define valid relationship types
    const validRelationshipTypes = ['derivative', 'compound', 'variant'];
    console.log('Available relationship types:', validRelationshipTypes.join(', '));
    
    // Group words by shared morphemes
    const morphemeGroups = {};
    
    // Group by prefixes
    const prefixes = morphemes.filter(m => m.type === 'prefix').map(m => m.value);
    for (const prefix of prefixes) {
      const wordsWithPrefix = [];
      for (const [word, morphemes] of Object.entries(wordMorphemeMap)) {
        if (morphemes.some(m => m.value === prefix)) {
          wordsWithPrefix.push(word);
        }
      }
      
      if (wordsWithPrefix.length > 1) {
        morphemeGroups[`prefix-${prefix}`] = wordsWithPrefix;
      }
    }
    
    // Group by roots
    const roots = morphemes.filter(m => m.type === 'root').map(m => m.value);
    for (const root of roots) {
      const wordsWithRoot = [];
      for (const [word, morphemes] of Object.entries(wordMorphemeMap)) {
        if (morphemes.some(m => m.value === root)) {
          wordsWithRoot.push(word);
        }
      }
      
      if (wordsWithRoot.length > 1) {
        morphemeGroups[`root-${root}`] = wordsWithRoot;
      }
    }
    
    // Group by suffixes
    const suffixes = morphemes.filter(m => m.type === 'suffix').map(m => m.value);
    for (const suffix of suffixes) {
      const wordsWithSuffix = [];
      for (const [word, morphemes] of Object.entries(wordMorphemeMap)) {
        if (morphemes.some(m => m.value === suffix)) {
          wordsWithSuffix.push(word);
        }
      }
      
      if (wordsWithSuffix.length > 1) {
        morphemeGroups[`suffix-${suffix}`] = wordsWithSuffix;
      }
    }
    
    // Create word family relationships
    for (const [groupKey, groupWords] of Object.entries(morphemeGroups)) {
      const wordIds = groupWords
        .filter(word => wordMap[word]) // Only include words that exist in the database
        .map(word => wordMap[word]);
      
      // Add relationships between all words in each group
      for (let i = 0; i < wordIds.length; i++) {
        for (let j = i + 1; j < wordIds.length; j++) {
          // Determine relationship type based on the group key
          // Only use the valid relationship types
          let relationshipType = 'variant';
          
          // Words sharing same prefix or suffix are usually variants
          if (groupKey.startsWith('prefix-') || groupKey.startsWith('suffix-')) {
            relationshipType = 'variant';
          } 
          // Words sharing the same root but with different affixes are often derivatives
          else if (groupKey.startsWith('root-')) {
            relationshipType = 'derivative';
          }
          
          // Compound is for words formed by combining multiple roots/words
          // This would need more complex logic to identify true compounds
          
          await client.query(
            `INSERT INTO word_families (base_word_id, related_word_id, relationship_type)
             VALUES ($1, $2, $3)
             ON CONFLICT (base_word_id, related_word_id) DO UPDATE SET relationship_type = EXCLUDED.relationship_type`,
            [wordIds[i], wordIds[j], relationshipType]
          );
          
          // Add the reverse relationship too for completeness
          await client.query(
            `INSERT INTO word_families (base_word_id, related_word_id, relationship_type)
             VALUES ($1, $2, $3)
             ON CONFLICT (base_word_id, related_word_id) DO UPDATE SET relationship_type = EXCLUDED.relationship_type`,
            [wordIds[j], wordIds[i], relationshipType]
          );
        }
      }
    }
    
    await client.query('COMMIT');
    console.log('Successfully seeded morpheme data for all words');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding morpheme data:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the seeder
seedMorphemes().then(() => {
  console.log('Completed morpheme seeding');
  process.exit(0);
}).catch((error) => {
  console.error('Failed to seed morphemes:', error);
  process.exit(1);
});
