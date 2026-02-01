-- Word-Morpheme associations for morpheme-based learning
-- Each word is broken down into its component morphemes with position ordering

-- Helper: Get word and morpheme IDs dynamically using subqueries
-- Position 0 = first morpheme (usually prefix), incrementing for each part

-- aberrant: ab- (away from) + err (wander) + -ant (one who)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'aberrant' AND m.morpheme = 'ab-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'aberrant' AND m.morpheme = 'err'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'aberrant' AND m.morpheme = '-ant'
ON CONFLICT DO NOTHING;

-- benevolent: bene- (good) + vol (wish) + -ent (state of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'benevolent' AND m.morpheme = 'bene-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'benevolent' AND m.morpheme = 'vol'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'benevolent' AND m.morpheme = '-ent'
ON CONFLICT DO NOTHING;

-- malevolent: mal- (bad) + vol (wish) + -ent (state of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'malevolent' AND m.morpheme = 'mal-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'malevolent' AND m.morpheme = 'vol'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'malevolent' AND m.morpheme = '-ent'
ON CONFLICT DO NOTHING;

-- circumlocution: circum- (around) + loqu (speak) + -tion (act of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'circumlocution' AND m.morpheme = 'circum-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'circumlocution' AND m.morpheme = 'loqu'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'circumlocution' AND m.morpheme = '-tion'
ON CONFLICT DO NOTHING;

-- loquacious: loqu (speak) + -acious (inclined to)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'loquacious' AND m.morpheme = 'loqu'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'loquacious' AND m.morpheme = '-acious'
ON CONFLICT DO NOTHING;

-- magnanimous: magn (great) + anim (spirit) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'magnanimous' AND m.morpheme = 'magn'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'magnanimous' AND m.morpheme = 'anim'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'magnanimous' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- tenacious: tenac (hold tightly) + -ious (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'tenacious' AND m.morpheme = 'tenac'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'tenacious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- cacophony: caco- (bad) + phon (sound) + -y (characterized by)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'cacophony' AND m.morpheme = 'caco-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'cacophony' AND m.morpheme = 'phon'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'cacophony' AND m.morpheme = '-y'
ON CONFLICT DO NOTHING;

-- philanthropy: phil (love) + anthrop (human) + -y (characterized by)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'philanthropy' AND m.morpheme = 'phil'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'philanthropy' AND m.morpheme = 'anthrop'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'philanthropy' AND m.morpheme = '-y'
ON CONFLICT DO NOTHING;

-- iconoclast: icon (image) + clast (break)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'iconoclast' AND m.morpheme = 'icon'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'iconoclast' AND m.morpheme = 'clast'
ON CONFLICT DO NOTHING;

-- bellicose: bell (war) + -ous (full of) [using -ic as proxy]
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'bellicose' AND m.morpheme = 'bell'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'bellicose' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- acerbic: acer (sharp, bitter) + -ic (relating to)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'acerbic' AND m.morpheme = 'acer'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'acerbic' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- taciturn: tacit (silent) + -urn (one who)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'taciturn' AND m.morpheme = 'tacit'
ON CONFLICT DO NOTHING;

-- placate: plac (please, calm) + -ate (to make)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'placate' AND m.morpheme = 'plac'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'placate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- implacable: in- (not) + plac (please, calm) + -able (capable of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'implacable' AND m.morpheme = 'in-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'implacable' AND m.morpheme = 'plac'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'implacable' AND m.morpheme = '-able'
ON CONFLICT DO NOTHING;

-- pugnacious: pugn (fight) + -acious (inclined to)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'pugnacious' AND m.morpheme = 'pugn'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'pugnacious' AND m.morpheme = '-acious'
ON CONFLICT DO NOTHING;

-- gregarious: greg (flock, group) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'gregarious' AND m.morpheme = 'greg'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'gregarious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- egregious: ex- (out of) + greg (flock) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'egregious' AND m.morpheme = 'ex-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'egregious' AND m.morpheme = 'greg'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'egregious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- indefatigable: in- (not) + de- (down) + fatig (tire) + -able (capable of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'indefatigable' AND m.morpheme = 'in-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'indefatigable' AND m.morpheme = 'de-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'indefatigable' AND m.morpheme = 'fatig'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 3 FROM words w, morphemes m WHERE w.word = 'indefatigable' AND m.morpheme = '-able'
ON CONFLICT DO NOTHING;

-- obdurate: ob- (against) + dur (hard) + -ate (to make)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'obdurate' AND m.morpheme = 'ob-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'obdurate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- obsequious: ob- (toward) + sequ (follow) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'obsequious' AND m.morpheme = 'ob-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'obsequious' AND m.morpheme = 'sequ'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'obsequious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- obviate: ob- (against) + vi (way) + -ate (to make)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'obviate' AND m.morpheme = 'ob-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'obviate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- perfidious: per- (through) + fid (faith) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'perfidious' AND m.morpheme = 'per-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'perfidious' AND m.morpheme = 'fid'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'perfidious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- pernicious: per- (thoroughly) + nec (death/harm) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'pernicious' AND m.morpheme = 'per-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'pernicious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- exacerbate: ex- (out) + acer (sharp, bitter) + -ate (to make)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'exacerbate' AND m.morpheme = 'ex-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'exacerbate' AND m.morpheme = 'acer'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'exacerbate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- elucidate: ex- (out) + luc (light) + -ate (to make)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'elucidate' AND m.morpheme = 'ex-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'elucidate' AND m.morpheme = 'luc'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'elucidate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- ameliorate: ad- (toward) + melior (better) + -ate (to make)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'ameliorate' AND m.morpheme = 'ad-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'ameliorate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- anachronism: ana- (against) + chron (time) + -ism (belief, practice)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'anachronism' AND m.morpheme = 'anti-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'anachronism' AND m.morpheme = 'chron'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'anachronism' AND m.morpheme = '-ism'
ON CONFLICT DO NOTHING;

-- antithesis: anti- (against) + thesis (position)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'antithesis' AND m.morpheme = 'anti-'
ON CONFLICT DO NOTHING;

-- credulous: cred (believe) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'credulous' AND m.morpheme = 'cred'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'credulous' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- deleterious: de- (down) + let (harm) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'deleterious' AND m.morpheme = 'de-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'deleterious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- dichotomy: di- (two) + tom (cut) + -y (characterized by)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'dichotomy' AND m.morpheme = 'bi-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'dichotomy' AND m.morpheme = '-y'
ON CONFLICT DO NOTHING;

-- diffident: dis- (not) + fid (faith) + -ent (state of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'diffident' AND m.morpheme = 'dis-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'diffident' AND m.morpheme = 'fid'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'diffident' AND m.morpheme = '-ent'
ON CONFLICT DO NOTHING;

-- ebullient: ex- (out) + bull (boil) + -ent (state of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'ebullient' AND m.morpheme = 'ex-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'ebullient' AND m.morpheme = '-ent'
ON CONFLICT DO NOTHING;

-- efficacious: ef- (out) + fic (make) + -acious (inclined to)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'efficacious' AND m.morpheme = 'ex-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'efficacious' AND m.morpheme = 'fac'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'efficacious' AND m.morpheme = '-acious'
ON CONFLICT DO NOTHING;

-- ephemeral: epi- (upon) + hemer (day) + -al (relating to)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'ephemeral' AND m.morpheme = '-al'
ON CONFLICT DO NOTHING;

-- equanimity: equ- (equal) + anim (spirit) + -ity (state of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'equanimity' AND m.morpheme = 'anim'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'equanimity' AND m.morpheme = '-ity'
ON CONFLICT DO NOTHING;

-- equivocate: equi- (equal) + voc (voice) + -ate (to make)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'equivocate' AND m.morpheme = 'voc'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'equivocate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- exculpate: ex- (out) + culp (blame) + -ate (to make)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'exculpate' AND m.morpheme = 'ex-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'exculpate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- fallacious: fall (deceive) + -acious (inclined to)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'fallacious' AND m.morpheme = '-acious'
ON CONFLICT DO NOTHING;

-- fastidious: fast (disgust) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'fastidious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- impervious: in- (not) + per- (through) + vi (way) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'impervious' AND m.morpheme = 'in-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'impervious' AND m.morpheme = 'per-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'impervious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- inimical: in- (not) + amic (friend) + -al (relating to)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'inimical' AND m.morpheme = 'in-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'inimical' AND m.morpheme = '-al'
ON CONFLICT DO NOTHING;

-- insidious: in- (into) + sid (sit) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'insidious' AND m.morpheme = 'in-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'insidious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- intransigent: in- (not) + trans- (across) + ig (act) + -ent (state of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'intransigent' AND m.morpheme = 'in-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'intransigent' AND m.morpheme = 'trans-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'intransigent' AND m.morpheme = '-ent'
ON CONFLICT DO NOTHING;

-- invective: in- (against) + vect (carry) + -ive (tending to)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'invective' AND m.morpheme = 'in-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'invective' AND m.morpheme = '-ive'
ON CONFLICT DO NOTHING;

-- lucid: luc (light) + -id (state of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'lucid' AND m.morpheme = 'luc'
ON CONFLICT DO NOTHING;

-- mendacious: mendac (lying) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'mendacious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- mollify: moll (soft) + -ify (to make)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'mollify' AND m.morpheme = '-y'
ON CONFLICT DO NOTHING;

-- ostentatious: ostent (show) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'ostentatious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- panacea: pan- (all) + ace (cure) + -a
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'panacea' AND m.morpheme = 'pan-'
ON CONFLICT DO NOTHING;

-- perspicacious: per- (through) + spic (look) + -acious (inclined to)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'perspicacious' AND m.morpheme = 'per-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'perspicacious' AND m.morpheme = 'spec'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'perspicacious' AND m.morpheme = '-acious'
ON CONFLICT DO NOTHING;

-- pragmatic: pragm (practical) + -ic (relating to)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'pragmatic' AND m.morpheme = '-ic'
ON CONFLICT DO NOTHING;

-- prescient: pre- (before) + sci (know) + -ent (state of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'prescient' AND m.morpheme = 'pre-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'prescient' AND m.morpheme = '-ent'
ON CONFLICT DO NOTHING;

-- proclivity: pro- (forward) + cliv (lean) + -ity (state of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'proclivity' AND m.morpheme = 'pro-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'proclivity' AND m.morpheme = '-ity'
ON CONFLICT DO NOTHING;

-- prodigious: pro- (forward) + dig (drive) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'prodigious' AND m.morpheme = 'pro-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'prodigious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- propitious: pro- (forward) + pit (favorable) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'propitious' AND m.morpheme = 'pro-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'propitious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- recalcitrant: re- (back) + calc (kick) + -ant (one who)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'recalcitrant' AND m.morpheme = 're-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'recalcitrant' AND m.morpheme = '-ant'
ON CONFLICT DO NOTHING;

-- repudiate: re- (back) + pud (shame) + -ate (to make)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'repudiate' AND m.morpheme = 're-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'repudiate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- reticent: re- (back) + tic (silent) + -ent (state of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'reticent' AND m.morpheme = 're-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'reticent' AND m.morpheme = '-ent'
ON CONFLICT DO NOTHING;

-- sagacious: sag (wise) + -acious (inclined to)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'sagacious' AND m.morpheme = '-acious'
ON CONFLICT DO NOTHING;

-- surreptitious: sur- (under) + rept (creep) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'surreptitious' AND m.morpheme = 'sub-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'surreptitious' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- ubiquitous: ubique (everywhere) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'ubiquitous' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- vacillate: vacill (sway) + -ate (to make)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'vacillate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- verbose: verb (word) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'verbose' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- vindicate: vindic (claim) + -ate (to make)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'vindicate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;

-- vociferous: voc (voice) + fer (carry) + -ous (full of)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'vociferous' AND m.morpheme = 'voc'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'vociferous' AND m.morpheme = 'fer'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'vociferous' AND m.morpheme = '-ous'
ON CONFLICT DO NOTHING;

-- corroborate: co- (together) + robor (strength) + -ate (to make)
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 0 FROM words w, morphemes m WHERE w.word = 'corroborate' AND m.morpheme = 'co-'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 1 FROM words w, morphemes m WHERE w.word = 'corroborate' AND m.morpheme = 'fort'
ON CONFLICT DO NOTHING;
INSERT INTO word_morphemes (word_id, morpheme_id, position)
SELECT w.id, m.id, 2 FROM words w, morphemes m WHERE w.word = 'corroborate' AND m.morpheme = '-ate'
ON CONFLICT DO NOTHING;
