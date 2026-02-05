Addendum — Word Clues Methodology Integration

This addendum introduces the instructional elements that made Word Clues uniquely effective: training users to decode unfamiliar words through morphemic analysis.

The goal is to shift the app from vocabulary memorization to structural word reasoning.

⸻

New Pedagogical Goal

Teach users how to determine the meaning of words they have never seen before by trusting prefixes, roots, and suffixes.

⸻

1. Root-First Curriculum (Primary Unit = Morpheme)

Concept

Learning progression is driven by roots, not words.

Implementation

Introduce Root Lessons as the primary unit of learning.

Each lesson includes:
	•	1 root
	•	3–5 common prefixes/suffixes
	•	10–20 derived words

Data Model

interface RootLesson {
  id: string;
  rootMorphemeId: string;
  affixIds: string[];
  wordIds: string[];
  order: number;
}

Behavior
	•	Users progress through RootLessons sequentially
	•	Word recommendations prioritize words from the active root

⸻

2. Literal Meaning Requirement (Before Definition)

Concept

Users must combine morphemes into a literal meaning before seeing the definition.

UI Flow
	1.	Show morphemes only
	2.	Prompt: “Combine these parts into a literal meaning”
	3.	User submits
	4.	Show actual definition

Applies To
	•	Word Lab
	•	MorphemeBuilder
	•	Decode modes

⸻

3. Unknown Word Decode Mode (Core Feature)

Concept

Users decode words not previously learned.

Learning Mode

UnknownWordDecodeMode

interface UnknownWordChallenge {
  wordId: string; // not yet learned
  morphemeIds: string[];
}

Flow
	1.	Present unfamiliar word
	2.	User splits into morphemes
	3.	User infers meaning
	4.	Reveal real definition
	5.	Award XP for structural reasoning

Runs daily during review sessions.

⸻

4. Construction Before Recognition

Concept

Users build words from meanings before seeing the actual word.

Learning Mode

WordConstructionMode

Prompt example:

“Create a word meaning ‘one who sees’”

User assembles morphemes → system reveals spectator

⸻

5. Word Family Clustering (Root Networks)

Concept

Emphasize large visible families of words from one root.

Word Lab Addition
	•	“Words from this root” becomes a primary section
	•	Interactive graph centered on shared root

⸻

6. Prefix/Suffix as Meaning Modifiers

Exercise Pattern

Given a root meaning, ask how a prefix changes it.

Example:

spect = see
What does re-spect literally mean?

These appear during review sessions.

⸻

7. Morpheme SRS (Not Just Word SRS)

Concept

Track familiarity with morphemes across new words.

Behavior
	•	Reviews include words containing previously learned roots in new contexts
	•	Morphemes have independent spaced repetition intervals

Uses existing table:
user_morpheme_progress

⸻

8. Delayed Definition Reveal Pattern

Across learning modes, enforce:

Analyze → Infer → Reveal → Correct

Definitions should not appear before analysis.

⸻

9. “Trust the Parts” Challenge Words

Curated set of words that:
	•	Look difficult
	•	Are easy when decoded by morphemes

DB Addition

words.trust_the_parts = true

These are prioritized in Decode Mode.

⸻

10. Psychological Reinforcement: Decoding Success

UX Feedback

After successful decode:

“You just decoded a word you’ve never seen before.”

Badge

Structural Thinker

⸻

New Learning Modes Summary

Mode	Purpose
UnknownWordDecodeMode	Decode unfamiliar words
WordConstructionMode	Build words from meaning
LiteralMeaningStep	Required step in Word Lab
RootLessonFlow	Root-driven progression


⸻

Changes to User Flow

Learn Flow
	1.	Start with Root Lesson
	2.	Construction exercise
	3.	Learn derived words

Review Flow Includes
	•	Standard word reviews
	•	Unknown decode challenge
	•	Prefix/suffix modifier exercises

⸻

MVP Priority Adjustment (Phase 2)

Before advanced gamification and LLM features, implement:
	1.	RootLesson system
	2.	Literal meaning gate
	3.	UnknownWordDecodeMode
	4.	WordConstructionMode

⸻

Resulting Shift in App Identity

Before	After Addendum
Vocabulary app	Word decoding trainer
Word memory	Structural reasoning
Etymology reference	Etymology as tool
Morphemes displayed	Morphemes exercised
