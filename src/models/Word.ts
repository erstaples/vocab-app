import { Etymology } from './Morpheme';

export interface Word {
  id: number;
  value: string;
  definition: string;
  partOfSpeech: string;
  pronunciation: string;
  example: string;
  synonyms: string[];
  difficulty: 1 | 2 | 3 | 4 | 5; // 1-5 scale of difficulty
  etymology?: Etymology;
}