-- Seed definitions for vocabulary words

INSERT INTO definitions (word_id, definition, example_sentence, is_primary) VALUES
-- aberrant
((SELECT id FROM words WHERE word = 'aberrant'), 'Departing from an accepted standard or norm', 'The aberrant behavior of the usually calm professor surprised everyone.', true),
-- abstruse
((SELECT id FROM words WHERE word = 'abstruse'), 'Difficult to understand; obscure', 'The philosopher''s abstruse arguments confused even his colleagues.', true),
-- acerbic
((SELECT id FROM words WHERE word = 'acerbic'), 'Sharp and forthright in speech or manner, especially in a critical way', 'Her acerbic wit made her both feared and admired in literary circles.', true),
-- acumen
((SELECT id FROM words WHERE word = 'acumen'), 'The ability to make good judgments and quick decisions', 'Her business acumen helped the startup survive its first year.', true),
-- admonish
((SELECT id FROM words WHERE word = 'admonish'), 'To warn or reprimand someone firmly', 'The teacher admonished the students for their lack of preparation.', true),
-- aesthetic
((SELECT id FROM words WHERE word = 'aesthetic'), 'Concerned with beauty or the appreciation of beauty', 'The museum''s aesthetic appeal draws visitors from around the world.', true),
-- alacrity
((SELECT id FROM words WHERE word = 'alacrity'), 'Brisk and cheerful readiness', 'She accepted the challenge with alacrity, eager to prove herself.', true),
-- ameliorate
((SELECT id FROM words WHERE word = 'ameliorate'), 'To make something bad or unsatisfactory better', 'The new policies were designed to ameliorate working conditions.', true),
-- anachronism
((SELECT id FROM words WHERE word = 'anachronism'), 'Something or someone that belongs to a different time period', 'The knight''s armor in the Victorian setting was a glaring anachronism.', true),
-- anathema
((SELECT id FROM words WHERE word = 'anathema'), 'Something or someone that one vehemently dislikes', 'Censorship was anathema to the free speech advocate.', true),
-- antithesis
((SELECT id FROM words WHERE word = 'antithesis'), 'A person or thing that is the direct opposite of someone or something else', 'His calm demeanor was the antithesis of her fiery temperament.', true),
-- apocryphal
((SELECT id FROM words WHERE word = 'apocryphal'), 'Of doubtful authenticity, although widely circulated as being true', 'The apocryphal story of the cherry tree has been debunked by historians.', true),
-- archaic
((SELECT id FROM words WHERE word = 'archaic'), 'Very old or old-fashioned; belonging to an earlier period', 'The document contained archaic language that few could understand.', true),
-- arduous
((SELECT id FROM words WHERE word = 'arduous'), 'Involving or requiring strenuous effort; difficult and tiring', 'The arduous journey through the mountains took three weeks.', true),
-- ascetic
((SELECT id FROM words WHERE word = 'ascetic'), 'Characterized by severe self-discipline and abstention from indulgence', 'The monk lived an ascetic life, owning only the clothes on his back.', true),
-- aspersion
((SELECT id FROM words WHERE word = 'aspersion'), 'An attack on the reputation or integrity of someone', 'She cast aspersions on his character without any evidence.', true),
-- assiduous
((SELECT id FROM words WHERE word = 'assiduous'), 'Showing great care and perseverance', 'Her assiduous attention to detail made her invaluable to the team.', true),
-- auspicious
((SELECT id FROM words WHERE word = 'auspicious'), 'Conducive to success; favorable', 'The sunny weather was an auspicious start to their wedding day.', true),
-- austere
((SELECT id FROM words WHERE word = 'austere'), 'Severe or strict in manner, attitude, or appearance', 'The austere classroom had bare walls and uncomfortable wooden chairs.', true),
-- avarice
((SELECT id FROM words WHERE word = 'avarice'), 'Extreme greed for wealth or material gain', 'His avarice led him to betray even his closest friends.', true),
-- bellicose
((SELECT id FROM words WHERE word = 'bellicose'), 'Demonstrating aggression and willingness to fight', 'The bellicose rhetoric from both nations raised fears of war.', true),
-- benevolent
((SELECT id FROM words WHERE word = 'benevolent'), 'Well-meaning and kindly', 'The benevolent donor funded scholarships for underprivileged students.', true),
-- brusque
((SELECT id FROM words WHERE word = 'brusque'), 'Abrupt or offhand in speech or manner', 'His brusque response hurt her feelings, though he meant no offense.', true),
-- cacophony
((SELECT id FROM words WHERE word = 'cacophony'), 'A harsh, discordant mixture of sounds', 'The cacophony of car horns and shouting vendors filled the street.', true),
-- candor
((SELECT id FROM words WHERE word = 'candor'), 'The quality of being open and honest in expression', 'I appreciate your candor, even though the truth is difficult to hear.', true),
-- capricious
((SELECT id FROM words WHERE word = 'capricious'), 'Given to sudden and unaccountable changes of mood or behavior', 'The capricious weather made it impossible to plan outdoor activities.', true),
-- catalyst
((SELECT id FROM words WHERE word = 'catalyst'), 'A person or thing that precipitates an event or change', 'The protest served as a catalyst for widespread reform.', true),
-- caustic
((SELECT id FROM words WHERE word = 'caustic'), 'Sarcastic in a scathing and bitter way', 'His caustic remarks alienated many of his colleagues.', true),
-- circumlocution
((SELECT id FROM words WHERE word = 'circumlocution'), 'The use of many words where fewer would do', 'His circumlocution frustrated listeners who wanted a direct answer.', true),
-- clandestine
((SELECT id FROM words WHERE word = 'clandestine'), 'Kept secret or done secretively', 'They held clandestine meetings to plan their escape.', true),
-- cogent
((SELECT id FROM words WHERE word = 'cogent'), 'Clear, logical, and convincing', 'She made a cogent argument that swayed the jury.', true),
-- complacent
((SELECT id FROM words WHERE word = 'complacent'), 'Showing smug or uncritical satisfaction with oneself', 'The team became complacent after their early success.', true),
-- concomitant
((SELECT id FROM words WHERE word = 'concomitant'), 'Naturally accompanying or associated', 'Fame brings concomitant responsibilities that many find burdensome.', true),
-- conflagration
((SELECT id FROM words WHERE word = 'conflagration'), 'An extensive fire that destroys a great deal of land or property', 'The conflagration consumed three city blocks before it was contained.', true),
-- conundrum
((SELECT id FROM words WHERE word = 'conundrum'), 'A confusing and difficult problem or question', 'The budget deficit presented a conundrum with no easy solution.', true),
-- corroborate
((SELECT id FROM words WHERE word = 'corroborate'), 'To confirm or give support to a statement or theory', 'The witness testimony corroborated the defendant''s alibi.', true),
-- credulous
((SELECT id FROM words WHERE word = 'credulous'), 'Having or showing too great a readiness to believe things', 'Credulous investors fell for the obvious scam.', true),
-- deleterious
((SELECT id FROM words WHERE word = 'deleterious'), 'Causing harm or damage', 'The deleterious effects of pollution are well documented.', true),
-- denigrate
((SELECT id FROM words WHERE word = 'denigrate'), 'To criticize unfairly; disparage', 'He sought to denigrate his opponent rather than debate the issues.', true),
-- deride
((SELECT id FROM words WHERE word = 'deride'), 'To express contempt for; ridicule', 'Critics derided the film as pretentious and boring.', true),
-- desultory
((SELECT id FROM words WHERE word = 'desultory'), 'Lacking a plan, purpose, or enthusiasm', 'Their desultory conversation wandered from topic to topic.', true),
-- dichotomy
((SELECT id FROM words WHERE word = 'dichotomy'), 'A division or contrast between two things that are represented as being opposed', 'The dichotomy between work and personal life is a common struggle.', true),
-- didactic
((SELECT id FROM words WHERE word = 'didactic'), 'Intended to teach, particularly in having moral instruction as an ulterior motive', 'The novel''s didactic tone alienated readers looking for entertainment.', true),
-- diffident
((SELECT id FROM words WHERE word = 'diffident'), 'Modest or shy because of a lack of self-confidence', 'Despite her talents, she remained diffident about her abilities.', true),
-- dilatory
((SELECT id FROM words WHERE word = 'dilatory'), 'Slow to act; intended to cause delay', 'The company''s dilatory tactics frustrated the negotiations.', true),
-- disparage
((SELECT id FROM words WHERE word = 'disparage'), 'To regard or represent as being of little worth', 'She would never disparage a colleague''s work in public.', true),
-- dissemble
((SELECT id FROM words WHERE word = 'dissemble'), 'To conceal one''s true motives or feelings', 'He tried to dissemble his disappointment with a forced smile.', true),
-- ebullient
((SELECT id FROM words WHERE word = 'ebullient'), 'Cheerful and full of energy', 'Her ebullient personality made her the life of every party.', true),
-- eclectic
((SELECT id FROM words WHERE word = 'eclectic'), 'Deriving ideas or style from a broad and diverse range of sources', 'The restaurant offers an eclectic menu featuring cuisines from around the world.', true),
-- efficacious
((SELECT id FROM words WHERE word = 'efficacious'), 'Successful in producing a desired or intended result', 'The treatment proved efficacious in reducing symptoms.', true),
-- egregious
((SELECT id FROM words WHERE word = 'egregious'), 'Outstandingly bad; shocking', 'The referee made an egregious error that cost them the game.', true),
-- elucidate
((SELECT id FROM words WHERE word = 'elucidate'), 'To make something clear; explain', 'Could you elucidate your position on this matter?', true),
-- emulate
((SELECT id FROM words WHERE word = 'emulate'), 'To match or surpass, typically by imitation', 'Young athletes often try to emulate their sports heroes.', true),
-- enervate
((SELECT id FROM words WHERE word = 'enervate'), 'To cause someone to feel drained of energy', 'The oppressive heat enervated the hikers.', true),
-- enigmatic
((SELECT id FROM words WHERE word = 'enigmatic'), 'Difficult to interpret or understand; mysterious', 'The Mona Lisa''s enigmatic smile has fascinated viewers for centuries.', true),
-- ephemeral
((SELECT id FROM words WHERE word = 'ephemeral'), 'Lasting for a very short time', 'Fame can be ephemeral in the age of social media.', true),
-- equanimity
((SELECT id FROM words WHERE word = 'equanimity'), 'Mental calmness and composure, especially in a difficult situation', 'She faced the crisis with remarkable equanimity.', true),
-- equivocate
((SELECT id FROM words WHERE word = 'equivocate'), 'To use ambiguous language so as to conceal the truth', 'Politicians often equivocate when asked direct questions.', true),
-- erudite
((SELECT id FROM words WHERE word = 'erudite'), 'Having or showing great knowledge or learning', 'The erudite professor could discuss any topic with authority.', true),
-- esoteric
((SELECT id FROM words WHERE word = 'esoteric'), 'Intended for or likely to be understood by only a small number of people', 'The lecture covered esoteric aspects of quantum mechanics.', true),
-- euphemism
((SELECT id FROM words WHERE word = 'euphemism'), 'A mild or indirect word substituted for one considered too harsh', '"Passed away" is a common euphemism for "died."', true),
-- exacerbate
((SELECT id FROM words WHERE word = 'exacerbate'), 'To make a problem, bad situation, or negative feeling worse', 'His comments only exacerbated the tension in the room.', true),
-- exculpate
((SELECT id FROM words WHERE word = 'exculpate'), 'To show or declare that someone is not guilty of wrongdoing', 'The new evidence exculpated the wrongly accused man.', true),
-- exigent
((SELECT id FROM words WHERE word = 'exigent'), 'Pressing; demanding', 'The exigent circumstances required immediate action.', true),
-- expedient
((SELECT id FROM words WHERE word = 'expedient'), 'Convenient and practical, although possibly improper or immoral', 'Taking the shortcut was expedient but not entirely ethical.', true),
-- extenuate
((SELECT id FROM words WHERE word = 'extenuate'), 'To make guilt or an offense seem less serious', 'Nothing could extenuate the severity of his crimes.', true),
-- facetious
((SELECT id FROM words WHERE word = 'facetious'), 'Treating serious issues with deliberately inappropriate humor', 'His facetious remarks were unwelcome during the solemn ceremony.', true),
-- fallacious
((SELECT id FROM words WHERE word = 'fallacious'), 'Based on a mistaken belief', 'The fallacious argument was quickly dismantled by the debate team.', true),
-- fastidious
((SELECT id FROM words WHERE word = 'fastidious'), 'Very attentive to and concerned about accuracy and detail', 'The fastidious editor caught every minor error in the manuscript.', true),
-- fecund
((SELECT id FROM words WHERE word = 'fecund'), 'Producing or capable of producing an abundance of offspring or new growth', 'The fecund soil yielded an abundant harvest.', true),
-- garrulous
((SELECT id FROM words WHERE word = 'garrulous'), 'Excessively talkative, especially on trivial matters', 'The garrulous neighbor talked for hours about nothing important.', true),
-- gregarious
((SELECT id FROM words WHERE word = 'gregarious'), 'Fond of company; sociable', 'His gregarious nature made him popular at social gatherings.', true),
-- hackneyed
((SELECT id FROM words WHERE word = 'hackneyed'), 'Lacking significance through having been overused', 'The movie relied on hackneyed plot devices and predictable twists.', true),
-- hegemony
((SELECT id FROM words WHERE word = 'hegemony'), 'Leadership or dominance, especially by one country or group over others', 'The empire maintained hegemony over the region for centuries.', true),
-- iconoclast
((SELECT id FROM words WHERE word = 'iconoclast'), 'A person who attacks cherished beliefs or institutions', 'The iconoclast challenged every traditional value of the organization.', true),
-- impecunious
((SELECT id FROM words WHERE word = 'impecunious'), 'Having little or no money', 'The impecunious artist could barely afford rent.', true),
-- impervious
((SELECT id FROM words WHERE word = 'impervious'), 'Not allowing fluid to pass through; unable to be affected', 'She seemed impervious to criticism.', true),
-- implacable
((SELECT id FROM words WHERE word = 'implacable'), 'Unable to be appeased or placated', 'His implacable hatred for his enemies knew no bounds.', true),
-- inchoate
((SELECT id FROM words WHERE word = 'inchoate'), 'Just begun and so not fully formed or developed', 'The inchoate plan needed much more work before implementation.', true),
-- indefatigable
((SELECT id FROM words WHERE word = 'indefatigable'), 'Persisting tirelessly', 'Her indefatigable efforts finally brought about change.', true),
-- ingenuous
((SELECT id FROM words WHERE word = 'ingenuous'), 'Innocent and unsuspecting', 'His ingenuous trust in others sometimes led to disappointment.', true),
-- inimical
((SELECT id FROM words WHERE word = 'inimical'), 'Tending to obstruct or harm; unfriendly; hostile', 'The harsh climate was inimical to agriculture.', true),
-- insidious
((SELECT id FROM words WHERE word = 'insidious'), 'Proceeding in a gradual, subtle way, but with harmful effects', 'The insidious effects of the disease went unnoticed for years.', true),
-- intransigent
((SELECT id FROM words WHERE word = 'intransigent'), 'Unwilling or refusing to change one''s views or to agree about something', 'The intransigent negotiators refused to compromise.', true),
-- inundate
((SELECT id FROM words WHERE word = 'inundate'), 'To overwhelm with things to be dealt with', 'The office was inundated with applications after the job posting.', true),
-- invective
((SELECT id FROM words WHERE word = 'invective'), 'Insulting, abusive, or highly critical language', 'The debate descended into personal invective.', true),
-- laconic
((SELECT id FROM words WHERE word = 'laconic'), 'Using very few words', 'His laconic responses revealed nothing about his feelings.', true),
-- loquacious
((SELECT id FROM words WHERE word = 'loquacious'), 'Tending to talk a great deal; talkative', 'The loquacious host kept the conversation flowing all evening.', true),
-- lucid
((SELECT id FROM words WHERE word = 'lucid'), 'Expressed clearly; easy to understand', 'Her lucid explanation made the complex topic accessible to everyone.', true),
-- magnanimous
((SELECT id FROM words WHERE word = 'magnanimous'), 'Very generous or forgiving, especially toward a rival', 'In a magnanimous gesture, the winner praised his opponent.', true),
-- malevolent
((SELECT id FROM words WHERE word = 'malevolent'), 'Having or showing a wish to do evil to others', 'The villain''s malevolent grin sent chills down their spines.', true),
-- mendacious
((SELECT id FROM words WHERE word = 'mendacious'), 'Not telling the truth; lying', 'The mendacious witness was charged with perjury.', true),
-- meticulous
((SELECT id FROM words WHERE word = 'meticulous'), 'Showing great attention to detail; very careful and precise', 'She kept meticulous records of every transaction.', true),
-- mollify
((SELECT id FROM words WHERE word = 'mollify'), 'To appease the anger or anxiety of someone', 'The manager tried to mollify the upset customer with a refund.', true),
-- nefarious
((SELECT id FROM words WHERE word = 'nefarious'), 'Wicked or criminal', 'The detective uncovered the gang''s nefarious activities.', true),
-- obdurate
((SELECT id FROM words WHERE word = 'obdurate'), 'Stubbornly refusing to change one''s opinion or course of action', 'Despite the evidence, he remained obdurate in his beliefs.', true),
-- obsequious
((SELECT id FROM words WHERE word = 'obsequious'), 'Obedient or attentive to an excessive degree', 'The obsequious assistant agreed with everything the boss said.', true),
-- obviate
((SELECT id FROM words WHERE word = 'obviate'), 'To remove a need or difficulty', 'The new software obviated the need for manual data entry.', true),
-- ostentatious
((SELECT id FROM words WHERE word = 'ostentatious'), 'Characterized by vulgar or pretentious display', 'The ostentatious mansion was designed to impress visitors.', true),
-- panacea
((SELECT id FROM words WHERE word = 'panacea'), 'A solution or remedy for all difficulties or diseases', 'There is no panacea for the complex problems facing society.', true),
-- paradigm
((SELECT id FROM words WHERE word = 'paradigm'), 'A typical example or pattern of something', 'The discovery represented a paradigm shift in scientific thinking.', true),
-- parsimonious
((SELECT id FROM words WHERE word = 'parsimonious'), 'Unwilling to spend money or use resources; stingy', 'The parsimonious millionaire refused to donate to charity.', true),
-- paucity
((SELECT id FROM words WHERE word = 'paucity'), 'The presence of something in only small or insufficient quantities', 'The paucity of evidence made prosecution difficult.', true),
-- pedantic
((SELECT id FROM words WHERE word = 'pedantic'), 'Excessively concerned with minor details or rules', 'His pedantic corrections of grammar annoyed his colleagues.', true),
-- perfidious
((SELECT id FROM words WHERE word = 'perfidious'), 'Deceitful and untrustworthy', 'The perfidious ally betrayed them at the crucial moment.', true),
-- perfunctory
((SELECT id FROM words WHERE word = 'perfunctory'), 'Carried out with a minimum of effort or reflection', 'The inspector gave the car only a perfunctory glance.', true),
-- pernicious
((SELECT id FROM words WHERE word = 'pernicious'), 'Having a harmful effect, especially in a gradual or subtle way', 'The pernicious influence of the propaganda spread throughout society.', true),
-- perspicacious
((SELECT id FROM words WHERE word = 'perspicacious'), 'Having a ready insight into and understanding of things', 'The perspicacious detective noticed the tiny detail that solved the case.', true),
-- philanthropy
((SELECT id FROM words WHERE word = 'philanthropy'), 'The desire to promote the welfare of others, often through generous donations', 'Her philanthropy has helped thousands of underprivileged children.', true),
-- phlegmatic
((SELECT id FROM words WHERE word = 'phlegmatic'), 'Having an unemotional and stolidly calm disposition', 'His phlegmatic demeanor helped calm others during the crisis.', true),
-- placate
((SELECT id FROM words WHERE word = 'placate'), 'To make someone less angry or hostile', 'She tried to placate him with promises of future consideration.', true),
-- pragmatic
((SELECT id FROM words WHERE word = 'pragmatic'), 'Dealing with things sensibly and realistically', 'Her pragmatic approach focused on what could actually be achieved.', true),
-- precipitous
((SELECT id FROM words WHERE word = 'precipitous'), 'Dangerously high or steep; done suddenly and without careful consideration', 'The precipitous decline in sales alarmed the board of directors.', true),
-- precocious
((SELECT id FROM words WHERE word = 'precocious'), 'Having developed certain abilities earlier than usual', 'The precocious child was reading at age three.', true),
-- prescient
((SELECT id FROM words WHERE word = 'prescient'), 'Having or showing knowledge of events before they take place', 'His prescient warnings about the market crash went unheeded.', true),
-- presumptuous
((SELECT id FROM words WHERE word = 'presumptuous'), 'Failing to observe the limits of what is permitted or appropriate', 'It would be presumptuous of me to speak on her behalf.', true),
-- probity
((SELECT id FROM words WHERE word = 'probity'), 'The quality of having strong moral principles; honesty and decency', 'His probity was never questioned throughout his long career.', true),
-- proclivity
((SELECT id FROM words WHERE word = 'proclivity'), 'A tendency to choose or do something regularly', 'She had a proclivity for getting involved in controversial causes.', true),
-- prodigious
((SELECT id FROM words WHERE word = 'prodigious'), 'Remarkably great in extent, size, or degree', 'The child prodigy showed prodigious musical talent.', true),
-- profligate
((SELECT id FROM words WHERE word = 'profligate'), 'Recklessly extravagant or wasteful', 'His profligate spending left him deeply in debt.', true),
-- propitious
((SELECT id FROM words WHERE word = 'propitious'), 'Giving or indicating a good chance of success; favorable', 'They waited for a more propitious moment to launch the product.', true),
-- prosaic
((SELECT id FROM words WHERE word = 'prosaic'), 'Having the style or diction of prose; lacking poetic beauty', 'His prosaic description failed to capture the beauty of the sunset.', true),
-- pugnacious
((SELECT id FROM words WHERE word = 'pugnacious'), 'Eager or quick to argue, quarrel, or fight', 'His pugnacious attitude made negotiations difficult.', true),
-- querulous
((SELECT id FROM words WHERE word = 'querulous'), 'Complaining in a petulant or whining manner', 'The querulous patient complained about everything.', true),
-- quixotic
((SELECT id FROM words WHERE word = 'quixotic'), 'Exceedingly idealistic; unrealistic and impractical', 'His quixotic quest to end all poverty seemed noble but naive.', true),
-- recalcitrant
((SELECT id FROM words WHERE word = 'recalcitrant'), 'Having an obstinately uncooperative attitude', 'The recalcitrant teenager refused to follow any rules.', true),
-- recondite
((SELECT id FROM words WHERE word = 'recondite'), 'Little known; abstruse', 'The professor specialized in recondite areas of medieval history.', true),
-- refractory
((SELECT id FROM words WHERE word = 'refractory'), 'Stubborn or unmanageable; resistant to treatment', 'The refractory infection did not respond to antibiotics.', true),
-- repudiate
((SELECT id FROM words WHERE word = 'repudiate'), 'To refuse to accept or be associated with', 'The politician repudiated his former ally''s controversial statements.', true),
-- reticent
((SELECT id FROM words WHERE word = 'reticent'), 'Not revealing one''s thoughts or feelings readily', 'She was reticent about discussing her personal life.', true),
-- sagacious
((SELECT id FROM words WHERE word = 'sagacious'), 'Having or showing keen mental discernment and good judgment', 'The sagacious leader anticipated the crisis and prepared accordingly.', true),
-- sanguine
((SELECT id FROM words WHERE word = 'sanguine'), 'Optimistic or positive, especially in a difficult situation', 'Despite the setbacks, she remained sanguine about their chances.', true),
-- sardonic
((SELECT id FROM words WHERE word = 'sardonic'), 'Grimly mocking or cynical', 'His sardonic smile suggested he knew something the others didn''t.', true),
-- sedulous
((SELECT id FROM words WHERE word = 'sedulous'), 'Showing dedication and diligence', 'Her sedulous research uncovered important new evidence.', true),
-- spurious
((SELECT id FROM words WHERE word = 'spurious'), 'Not being what it purports to be; false or fake', 'The spurious claims were quickly debunked by fact-checkers.', true),
-- surreptitious
((SELECT id FROM words WHERE word = 'surreptitious'), 'Kept secret, especially because it would not be approved of', 'She cast a surreptitious glance at her phone during the meeting.', true),
-- sycophant
((SELECT id FROM words WHERE word = 'sycophant'), 'A person who acts obsequiously toward someone to gain advantage', 'The king was surrounded by sycophants who told him only what he wanted to hear.', true),
-- taciturn
((SELECT id FROM words WHERE word = 'taciturn'), 'Reserved or uncommunicative in speech; saying little', 'The taciturn stranger sat alone at the bar.', true),
-- temerity
((SELECT id FROM words WHERE word = 'temerity'), 'Excessive confidence or boldness; audacity', 'She had the temerity to challenge the CEO''s decision.', true),
-- tenacious
((SELECT id FROM words WHERE word = 'tenacious'), 'Tending to keep a firm hold of something; persistent', 'Her tenacious pursuit of justice finally paid off.', true),
-- trepidation
((SELECT id FROM words WHERE word = 'trepidation'), 'A feeling of fear or agitation about something that may happen', 'He approached the interview with considerable trepidation.', true),
-- truculent
((SELECT id FROM words WHERE word = 'truculent'), 'Eager or quick to argue or fight; aggressively defiant', 'The truculent defendant challenged every statement made by the prosecution.', true),
-- ubiquitous
((SELECT id FROM words WHERE word = 'ubiquitous'), 'Present, appearing, or found everywhere', 'Smartphones have become ubiquitous in modern society.', true),
-- unctuous
((SELECT id FROM words WHERE word = 'unctuous'), 'Excessively flattering or ingratiating', 'The unctuous salesman made everyone uncomfortable.', true),
-- vacillate
((SELECT id FROM words WHERE word = 'vacillate'), 'To alternate or waver between different opinions or actions', 'She vacillated between accepting the job and staying where she was.', true),
-- venal
((SELECT id FROM words WHERE word = 'venal'), 'Showing or motivated by susceptibility to bribery', 'The venal official accepted bribes from multiple corporations.', true),
-- verbose
((SELECT id FROM words WHERE word = 'verbose'), 'Using or expressed in more words than are needed', 'The verbose report could have been summarized in two pages.', true),
-- vicarious
((SELECT id FROM words WHERE word = 'vicarious'), 'Experienced in the imagination through the feelings of another person', 'She lived vicariously through her daughter''s adventures.', true),
-- vindicate
((SELECT id FROM words WHERE word = 'vindicate'), 'To clear someone of blame or suspicion', 'The DNA evidence vindicated the wrongly imprisoned man.', true),
-- vitriolic
((SELECT id FROM words WHERE word = 'vitriolic'), 'Filled with bitter criticism or malice', 'The vitriolic review destroyed any chance of the play succeeding.', true),
-- vociferous
((SELECT id FROM words WHERE word = 'vociferous'), 'Vehement or clamorous in expressing opinions', 'The vociferous protesters could be heard blocks away.', true),
-- zealous
((SELECT id FROM words WHERE word = 'zealous'), 'Having or showing zeal; fervent', 'Her zealous advocacy for environmental causes inspired many others.', true);
