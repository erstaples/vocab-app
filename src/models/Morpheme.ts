import { Word } from './Word';

/**
 * Types of morphemes
 * - prefix: appears at the beginning of a word (e.g., 'un-' in 'unhappy')
 * - root: core meaning-bearing unit (e.g., 'happy' in 'unhappy')
 * - suffix: appears at the end of a word (e.g., '-ness' in 'happiness')
 * - free: can stand alone as a word (e.g., 'happy')
 * - infix: inserted within a word (rare in English, common in other languages)
 * - bound: cannot stand alone, must be attached to other morphemes
 */
export type MorphemeType = 'prefix' | 'root' | 'suffix' | 'free' | 'infix' | 'bound';

/**
 * Represents a morpheme - the smallest meaningful unit in a language
 */
export interface Morpheme {
  id: number;
  value: string;
  type: MorphemeType;
  meaning: string;
  languageOrigin: string;
  examples: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents the relationship between a word and its morphemes, including morpheme details
 */
export interface WordMorpheme extends Morpheme {
  wordId: string;
  position: number;
  createdAt: Date;
}

/**
 * Types of relationships between words in a word family
 */
export type WordFamilyRelationType = 'derivative' | 'compound' | 'variant';

/**
 * Represents a relationship between words in a word family, including related word details
 */
export interface WordFamily {
  baseWordId: string;
  relatedWordId: string;
  relationshipType: WordFamilyRelationType;
  value: string; // The word value
  definition: string;
  createdAt: Date;
}

/**
 * Etymology information for a word
 */
export interface Etymology {
  origin: string;
  period: string;
  development: string[];
}

/**
 * Enhanced Word type with etymology and morpheme information
 */
export interface EnhancedWord extends Omit<Word, 'etymology'> {
  etymology: Etymology;
  morphemes: WordMorpheme[];
  wordFamilies: WordFamily[];
}