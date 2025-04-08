-- Migration: 004_seed_words.sql
-- Created: 2025-04-07
-- Description: Seeds the words table with literary vocabulary

-- Start transaction
BEGIN;

-- Insert literary words
INSERT INTO words (value, definition, part_of_speech, pronunciation, example, synonyms, difficulty, etymology)
VALUES
  ('abase', 'To lower in rank, prestige, or esteem; to humble or humiliate', 'verb', 'uh-beys', 'The dictator''s harsh policies abased the citizens, stripping them of their dignity.', ARRAY['humble', 'humiliate', 'degrade', 'demean'], 4, 'From Old French "abaissier" (to lower, diminish)'),
  
  ('abate', 'To reduce in amount, degree, or intensity; to lessen', 'verb', 'uh-beyt', 'The storm began to abate as the winds decreased and the rain slowed to a drizzle.', ARRAY['decrease', 'diminish', 'subside', 'wane'], 3, 'From Old French "abattre" (to beat down)'),
  
  ('aberrant', 'Deviating from the normal or usual course; abnormal or deviant', 'adjective', 'ab-er-uhnt', 'The scientist noted the aberrant behavior of the cells when exposed to the experimental drug.', ARRAY['abnormal', 'deviant', 'atypical', 'anomalous'], 4, 'From Latin "aberrantem" (wandering away)'),
  
  ('abeyance', 'A state of temporary suspension or inactivity', 'noun', 'uh-bey-uhns', 'The project was held in abeyance until additional funding could be secured.', ARRAY['suspension', 'dormancy', 'inactivity', 'latency'], 4, 'From Old French "abeance" (expectation, aspiration)'),
  
  ('abhor', 'To regard with extreme repugnance or aversion; to detest utterly', 'verb', 'ab-hawr', 'She abhors violence in any form and advocates for peaceful conflict resolution.', ARRAY['detest', 'loathe', 'despise', 'hate'], 3, 'From Latin "abhorrere" (to shrink back from in terror)'),
  
  ('abject', 'Sunk to a low condition; cast down in spirit; degraded; servile; groveling', 'adjective', 'ab-jekt', 'The prisoners lived in abject conditions, deprived of basic necessities and dignity.', ARRAY['degraded', 'miserable', 'wretched', 'contemptible'], 4, 'From Latin "abjectus" (thrown down)'),
  
  ('abjure', 'To renounce upon oath; to reject solemnly; to recant', 'verb', 'ab-joor', 'The former cult member was forced to abjure his previous beliefs in a public ceremony.', ARRAY['renounce', 'recant', 'repudiate', 'forswear'], 5, 'From Latin "abjurare" (to deny under oath)'),
  
  ('abnegate', 'To deny oneself something; to reject or renounce', 'verb', 'ab-ni-geyt', 'The monk chose to abnegate worldly pleasures in pursuit of spiritual enlightenment.', ARRAY['renounce', 'deny', 'surrender', 'relinquish'], 5, 'From Latin "abnegare" (to refuse, deny)'),
  
  ('abrasive', 'Causing irritation, either physically or emotionally; harsh', 'adjective', 'uh-brey-siv', 'His abrasive personality made it difficult for him to maintain long-term relationships.', ARRAY['harsh', 'irritating', 'rough', 'grating'], 3, 'From Latin "abradere" (to scrape off)'),
  
  ('abrogate', 'To abolish, do away with, or annul, especially by authority', 'verb', 'ab-ruh-geyt', 'The new government moved quickly to abrogate the controversial laws passed by the previous administration.', ARRAY['abolish', 'annul', 'cancel', 'revoke'], 5, 'From Latin "abrogare" (to repeal, annul)'),
  
  ('abstemious', 'Characterized by restraint, especially in the consumption of food or alcohol', 'adjective', 'ab-stee-mee-uhs', 'His abstemious lifestyle included a strict diet and abstention from alcohol.', ARRAY['moderate', 'temperate', 'restrained', 'frugal'], 5, 'From Latin "abstemius" (moderate, sober)'),
  
  ('abstruse', 'Difficult to comprehend; obscure; esoteric', 'adjective', 'ab-stroos', 'The professor''s abstruse explanation of quantum mechanics left most students confused.', ARRAY['obscure', 'complex', 'recondite', 'esoteric'], 5, 'From Latin "abstrusus" (hidden, concealed)'),
  
  ('acerbic', 'Sharp and forthright in expression or tone; harsh', 'adjective', 'uh-sur-bik', 'The critic was known for his acerbic reviews that spared no one''s feelings.', ARRAY['caustic', 'biting', 'sharp', 'tart'], 4, 'From Latin "acerbus" (harsh, bitter)'),
  
  ('acme', 'The highest point or stage; the peak or zenith', 'noun', 'ak-mee', 'The artist reached the acme of his career when his work was displayed in the national gallery.', ARRAY['peak', 'zenith', 'apex', 'pinnacle'], 3, 'From Greek "akme" (peak, highest point)'),
  
  ('acquiesce', 'To accept, comply, or submit tacitly without protest', 'verb', 'ak-wee-es', 'Though she disagreed with the decision, she decided to acquiesce rather than cause conflict.', ARRAY['comply', 'consent', 'agree', 'yield'], 4, 'From Latin "acquiescere" (to rest, find rest in)'),
  
  ('acumen', 'Quickness, accuracy, and keenness of judgment or insight', 'noun', 'ak-yoo-muhn', 'Her business acumen allowed her to identify profitable opportunities that others missed.', ARRAY['insight', 'astuteness', 'shrewdness', 'perception'], 4, 'From Latin "acumen" (sharpness, point)'),
  
  ('adamant', 'Utterly unyielding or firm in attitude or opinion; unshakable', 'adjective', 'ad-uh-muhnt', 'He was adamant about not changing the company''s long-standing policies.', ARRAY['unyielding', 'inflexible', 'resolute', 'unshakable'], 3, 'From Greek "adamas" (unbreakable, invincible)'),
  
  ('admonish', 'To caution, advise, or counsel against something; to reprove gently but earnestly', 'verb', 'ad-mon-ish', 'The teacher admonished the students to study diligently for their upcoming exams.', ARRAY['warn', 'caution', 'reprove', 'counsel'], 3, 'From Latin "admonere" (to warn, advise)'),
  
  ('adroit', 'Skillful and adept under pressing conditions; dexterous', 'adjective', 'uh-droit', 'The adroit negotiator was able to secure favorable terms despite the challenging circumstances.', ARRAY['skillful', 'dexterous', 'deft', 'nimble'], 4, 'From French "adroit" (skillful, clever)'),
  
  ('adulation', 'Excessive or slavish admiration or flattery', 'noun', 'aj-uh-ley-shuhn', 'The celebrity was surrounded by fans offering adulation wherever she went.', ARRAY['flattery', 'praise', 'worship', 'homage'], 4, 'From Latin "adulatio" (flattery)'),
  
  ('ambiguous', 'Open to more than one interpretation; having a double meaning; unclear or uncertain', 'adjective', 'am-big-yoo-uhs', 'The ambiguous statement could be interpreted in several different ways.', ARRAY['vague', 'equivocal', 'unclear', 'cryptic'], 3, 'From Latin "ambiguus" (doubtful, uncertain)'),
  
  ('benevolent', 'Characterized by or expressing goodwill or kindly feelings; desiring to help others', 'adjective', 'buh-nev-uh-luhnt', 'The benevolent philanthropist donated millions to educational causes.', ARRAY['kind', 'charitable', 'generous', 'altruistic'], 3, 'From Latin "benevolens" (wishing well)'),
  
  ('diligent', 'Characterized by steady, earnest, and energetic effort; painstaking', 'adjective', 'dil-i-juhnt', 'The diligent student spent hours in the library researching for her thesis.', ARRAY['industrious', 'assiduous', 'sedulous', 'persevering'], 3, 'From Latin "diligens" (attentive, careful)'),
  
  ('eloquent', 'Fluent or persuasive in speaking or writing; vividly or movingly expressive', 'adjective', 'el-uh-kwuhnt', 'Her eloquent speech moved the audience to tears.', ARRAY['articulate', 'fluent', 'expressive', 'persuasive'], 3, 'From Latin "eloquens" (speaking, fluent)'),
  
  ('ephemeral', 'Lasting for a very short time; transitory; fleeting', 'adjective', 'ih-fem-er-uhl', 'The beauty of cherry blossoms is ephemeral, lasting only a few days each spring.', ARRAY['fleeting', 'transient', 'momentary', 'short-lived'], 4, 'From Greek "ephemeros" (lasting only a day)'),
  
  ('ineffable', 'Too great or extreme to be expressed or described in words; unutterable', 'adjective', 'in-ef-uh-buhl', 'The beauty of the sunset over the ocean was almost ineffable.', ARRAY['inexpressible', 'indescribable', 'unspeakable', 'unutterable'], 5, 'From Latin "ineffabilis" (unutterable)'),
  
  ('loquacious', 'Tending to talk a great deal; garrulous', 'adjective', 'loh-kwey-shuhs', 'The loquacious tour guide barely paused for breath during the two-hour tour.', ARRAY['talkative', 'garrulous', 'voluble', 'chatty'], 4, 'From Latin "loquax" (talkative)'),
  
  ('mellifluous', 'Sweet or musical; pleasant to hear', 'adjective', 'muh-lif-loo-uhs', 'The singer''s mellifluous voice captivated the audience throughout the performance.', ARRAY['melodious', 'dulcet', 'harmonious', 'euphonious'], 5, 'From Latin "mellifluus" (flowing with honey)'),
  
  ('meticulous', 'Showing great attention to detail; very careful and precise', 'adjective', 'muh-tik-yuh-luhs', 'The meticulous researcher double-checked every fact before submitting her paper.', ARRAY['careful', 'precise', 'thorough', 'scrupulous'], 3, 'From Latin "meticulosus" (fearful, timid)'),
  
  ('obfuscate', 'To render obscure, unclear, or unintelligible; to bewilder or stupefy', 'verb', 'ob-fuh-skeyt', 'The politician tried to obfuscate the issue by using complex jargon and vague statements.', ARRAY['confuse', 'bewilder', 'obscure', 'muddle'], 5, 'From Latin "obfuscare" (to darken)'),
  
  ('pernicious', 'Having a harmful effect, especially in a gradual or subtle way', 'adjective', 'per-nish-uhs', 'The pernicious influence of the gang slowly corrupted the once-peaceful neighborhood.', ARRAY['harmful', 'destructive', 'injurious', 'deleterious'], 4, 'From Latin "perniciosus" (destructive)'),
  
  ('pragmatic', 'Dealing with things sensibly and realistically in a way that is based on practical considerations', 'adjective', 'prag-mat-ik', 'She took a pragmatic approach to the problem, focusing on practical solutions rather than ideal ones.', ARRAY['practical', 'realistic', 'sensible', 'down-to-earth'], 3, 'From Greek "pragmatikos" (relating to affairs)'),
  
  ('quintessential', 'Representing the most perfect or typical example of a quality or class', 'adjective', 'kwin-tuh-sen-shuhl', 'The small town diner with its friendly service and homemade pie is the quintessential American eating establishment.', ARRAY['typical', 'classic', 'archetypal', 'definitive'], 4, 'From Medieval Latin "quinta essentia" (fifth essence)'),
  
  ('resilient', 'Able to withstand or recover quickly from difficult conditions; tough', 'adjective', 'ri-zil-yuhnt', 'The resilient community quickly rebuilt after the devastating hurricane.', ARRAY['tough', 'adaptable', 'flexible', 'buoyant'], 3, 'From Latin "resilire" (to leap back, rebound)'),
  
  ('serendipity', 'The occurrence and development of events by chance in a happy or beneficial way', 'noun', 'ser-uhn-dip-i-tee', 'Finding her dream job while on vacation was a case of pure serendipity.', ARRAY['chance', 'fortuity', 'luck', 'providence'], 4, 'Coined by Horace Walpole in 1754 based on the Persian fairy tale "The Three Princes of Serendip"'),
  
  ('sonder', 'The realization that each random passerby is living a life as vivid and complex as your own', 'noun', 'son-der', 'Walking through the busy city streets, she was overcome with a feeling of sonder.', ARRAY['awareness', 'realization', 'comprehension', 'understanding'], 5, 'Neologism coined by John Koenig for The Dictionary of Obscure Sorrows'),
  
  ('sycophant', 'A person who acts obsequiously toward someone important in order to gain advantage', 'noun', 'sik-uh-fuhnt', 'The CEO was surrounded by sycophants who agreed with everything he said.', ARRAY['flatterer', 'toady', 'yes-man', 'bootlicker'], 4, 'From Greek "sykophantes" (false accuser)'),
  
  ('tranquil', 'Free from disturbance; calm; quiet; peaceful', 'adjective', 'trang-kwil', 'The tranquil lake reflected the mountains like a perfect mirror.', ARRAY['calm', 'peaceful', 'serene', 'placid'], 3, 'From Latin "tranquillus" (calm, still)'),
  
  ('ubiquitous', 'Present, appearing, or found everywhere', 'adjective', 'yoo-bik-wi-tuhs', 'Smartphones have become ubiquitous in modern society.', ARRAY['omnipresent', 'universal', 'pervasive', 'worldwide'], 4, 'From Latin "ubique" (everywhere)'),
  
  ('verbose', 'Using or containing more words than needed; wordy', 'adjective', 'ver-bohs', 'The verbose report could have conveyed the same information in half as many pages.', ARRAY['wordy', 'long-winded', 'prolix', 'garrulous'], 3, 'From Latin "verbosus" (wordy)')
ON CONFLICT (value) DO NOTHING;

-- Update etymology columns for words
UPDATE words SET
  etymology_origin = 'Old French',
  etymology_period = 'Middle English',
  etymology_development = ARRAY['From Old French "abaissier" (to lower, diminish)', 'Formed from a- (to) + baissier (to lower)', 'Entered English in the 14th century']
WHERE value = 'abase';

UPDATE words SET
  etymology_origin = 'Old French',
  etymology_period = 'Middle English',
  etymology_development = ARRAY['From Old French "abattre" (to beat down)', 'Formed from a- (to) + battre (to beat)', 'Entered English in the 14th century']
WHERE value = 'abate';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Latin "aberrantem" (wandering away)', 'Formed from ab- (away) + errare (to wander)', 'Entered English in the 16th century']
WHERE value = 'aberrant';

UPDATE words SET
  etymology_origin = 'Old French',
  etymology_period = 'Middle English',
  etymology_development = ARRAY['From Old French "abeance" (expectation, aspiration)', 'From a- (to) + béer (to gape, aspire to)', 'Entered English in the 16th century']
WHERE value = 'abeyance';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Middle English',
  etymology_development = ARRAY['From Latin "abhorrere" (to shrink back from in terror)', 'Formed from ab- (away) + horrere (to bristle with fear)', 'Entered English in the 14th century']
WHERE value = 'abhor';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Middle English',
  etymology_development = ARRAY['From Latin "abjectus" (thrown down)', 'Past participle of abicere (to cast away)', 'From ab- (away) + jacere (to throw)', 'Entered English in the 15th century']
WHERE value = 'abject';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Middle English',
  etymology_development = ARRAY['From Latin "abjurare" (to deny under oath)', 'Formed from ab- (away) + jurare (to swear)', 'Entered English in the 15th century']
WHERE value = 'abjure';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Latin "abnegare" (to refuse, deny)', 'Formed from ab- (away) + negare (to deny)', 'Entered English in the 16th century']
WHERE value = 'abnegate';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Modern English',
  etymology_development = ARRAY['From Latin "abradere" (to scrape off)', 'Formed from ab- (away) + radere (to scrape)', 'Entered English in the 19th century']
WHERE value = 'abrasive';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Latin "abrogare" (to repeal, annul)', 'Formed from ab- (away) + rogare (to ask, propose)', 'Entered English in the 16th century']
WHERE value = 'abrogate';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Latin "abstemius" (moderate, sober)', 'Possibly from abs- (from) + temetum (intoxicating drink)', 'Entered English in the early 17th century']
WHERE value = 'abstemious';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Latin "abstrusus" (hidden, concealed)', 'Past participle of abstrudere (to push away)', 'From abs- (away) + trudere (to push, thrust)', 'Entered English in the 16th century']
WHERE value = 'abstruse';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Modern English',
  etymology_development = ARRAY['From Latin "acerbus" (harsh, bitter)', 'Related to acer (sharp)', 'Entered English in the 19th century']
WHERE value = 'acerbic';

UPDATE words SET
  etymology_origin = 'Greek',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Greek "akme" (peak, highest point)', 'Related to akis (point)', 'Entered English in the 17th century']
WHERE value = 'acme';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Latin "acquiescere" (to rest, find rest in)', 'Formed from ad- (to) + quiescere (to rest)', 'Entered English in the 17th century']
WHERE value = 'acquiesce';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Latin "acumen" (sharpness, point)', 'From acuere (to sharpen)', 'Entered English in the 16th century']
WHERE value = 'acumen';

UPDATE words SET
  etymology_origin = 'Greek',
  etymology_period = 'Old English',
  etymology_development = ARRAY['From Greek "adamas" (unbreakable, invincible)', 'Formed from a- (not) + daman (to tame, subdue)', 'Entered English before the 12th century']
WHERE value = 'adamant';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Middle English',
  etymology_development = ARRAY['From Latin "admonere" (to warn, advise)', 'Formed from ad- (to) + monere (to warn)', 'Entered English in the 14th century']
WHERE value = 'admonish';

UPDATE words SET
  etymology_origin = 'French',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From French "adroit" (skillful, clever)', 'From à droit (according to right)', 'Entered English in the 17th century']
WHERE value = 'adroit';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Middle English',
  etymology_development = ARRAY['From Latin "adulatio" (flattery)', 'From adulari (to flatter)', 'Entered English in the 15th century']
WHERE value = 'adulation';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Latin "ambiguus" (doubtful, uncertain)', 'From ambigere (to wander about, dispute)', 'From ambi- (around) + agere (to drive)', 'Entered English in the 16th century']
WHERE value = 'ambiguous';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Middle English',
  etymology_development = ARRAY['From Latin "benevolens" (wishing well)', 'Formed from bene- (well) + volens (wishing)', 'Entered English in the 15th century']
WHERE value = 'benevolent';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Middle English',
  etymology_development = ARRAY['From Latin "diligens" (attentive, careful)', 'Present participle of diligere (to value, esteem)', 'From dis- (apart) + legere (to choose, pick out)', 'Entered English in the 14th century']
WHERE value = 'diligent';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Middle English',
  etymology_development = ARRAY['From Latin "eloquens" (speaking, fluent)', 'Present participle of eloqui (to speak out)', 'From e- (out) + loqui (to speak)', 'Entered English in the 14th century']
WHERE value = 'eloquent';

UPDATE words SET
  etymology_origin = 'Greek',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Greek "ephemeros" (lasting only a day)', 'Formed from epi- (on) + hemera (day)', 'Entered English in the 16th century']
WHERE value = 'ephemeral';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Middle English',
  etymology_development = ARRAY['From Latin "ineffabilis" (unutterable)', 'Formed from in- (not) + effabilis (utterable)', 'From ex- (out) + fari (to speak)', 'Entered English in the 15th century']
WHERE value = 'ineffable';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Latin "loquax" (talkative)', 'From loqui (to speak)', 'Entered English in the 17th century']
WHERE value = 'loquacious';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Middle English',
  etymology_development = ARRAY['From Latin "mellifluus" (flowing with honey)', 'Formed from mel (honey) + fluere (to flow)', 'Entered English in the 15th century']
WHERE value = 'mellifluous';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Latin "meticulosus" (fearful, timid)', 'From metus (fear) + -culus (diminutive suffix)', 'Entered English in the 16th century, with meaning shifting to "careful, precise"']
WHERE value = 'meticulous';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Latin "obfuscare" (to darken)', 'Formed from ob- (over) + fuscare (to darken)', 'From fuscus (dark)', 'Entered English in the 16th century']
WHERE value = 'obfuscate';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Middle English',
  etymology_development = ARRAY['From Latin "perniciosus" (destructive)', 'From pernicies (destruction)', 'From per- (thoroughly) + nex (death)', 'Entered English in the 15th century']
WHERE value = 'pernicious';

UPDATE words SET
  etymology_origin = 'Greek',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Greek "pragmatikos" (relating to affairs)', 'From pragma (deed, act)', 'From prassein (to do)', 'Entered English in the 16th century']
WHERE value = 'pragmatic';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Medieval Latin "quinta essentia" (fifth essence)', 'Referring to the fifth element in ancient and medieval philosophy', 'Entered English in the 16th century']
WHERE value = 'quintessential';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Classical Latin',
  etymology_development = ARRAY['From Latin "resilire" (to leap back, rebound)', 'Formed from re- (back) + salire (to leap)', 'Entered English in the 17th century']
WHERE value = 'resilient';

UPDATE words SET
  etymology_origin = 'English',
  etymology_period = 'Modern English',
  etymology_development = ARRAY['Coined by Horace Walpole in 1754', 'Based on the Persian fairy tale "The Three Princes of Serendip"', 'From Serendip (old name for Sri Lanka) + -ity (state or quality)']
WHERE value = 'serendipity';

UPDATE words SET
  etymology_origin = 'English',
  etymology_period = 'Contemporary English',
  etymology_development = ARRAY['Neologism coined by John Koenig for The Dictionary of Obscure Sorrows', 'Possibly influenced by French "sonder" (to probe, explore)', 'Created in the early 21st century']
WHERE value = 'sonder';

UPDATE words SET
  etymology_origin = 'Greek',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Greek "sykophantes" (false accuser)', 'Literally "fig-revealer" from sykon (fig) + phainein (to show)', 'Originally referred to informers against illegal exportation of figs', 'Entered English in the 16th century']
WHERE value = 'sycophant';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Latin "tranquillus" (calm, still)', 'Possibly from trans- (across, beyond) + quies (rest)', 'Entered English in the 16th century']
WHERE value = 'tranquil';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Modern English',
  etymology_development = ARRAY['From Latin "ubique" (everywhere)', 'From ubi (where) + -que (and, also)', 'Entered English in the 19th century']
WHERE value = 'ubiquitous';

UPDATE words SET
  etymology_origin = 'Latin',
  etymology_period = 'Early Modern English',
  etymology_development = ARRAY['From Latin "verbosus" (wordy)', 'From verbum (word)', 'Entered English in the 17th century']
WHERE value = 'verbose';

-- Commit transaction
COMMIT;
