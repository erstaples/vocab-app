export interface Word {
  id: string;
  value: string;
  definition: string;
  partOfSpeech: string;
  pronunciation: string;
  example: string;
  synonyms: string[];
  difficulty: 1 | 2 | 3 | 4 | 5; // 1-5 scale of difficulty
  etymology?: string;
}