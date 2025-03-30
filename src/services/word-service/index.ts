import { Word } from '../../models';

// In a real application, this would likely come from an API or database
// For this example, we'll use a static dataset
const literaryWords: Word[] = [
  {
    id: '12',
    value: 'tranquil',
    definition: 'Free from disturbance; calm and peaceful',
    partOfSpeech: 'adjective',
    pronunciation: 'TRANG-kwil',
    example: 'The tranquil lake reflected the mountains like a mirror.',
    synonyms: ['peaceful', 'calm', 'serene', 'quiet', 'still'],
    difficulty: 1,
    etymology: 'From Latin tranquillus "quiet, calm"'
  },
  {
    id: '13',
    value: 'eloquent',
    definition: 'Fluent or persuasive in speaking or writing',
    partOfSpeech: 'adjective',
    pronunciation: 'EL-uh-kwent',
    example: 'Her eloquent speech moved the entire audience.',
    synonyms: ['articulate', 'expressive', 'fluent', 'well-spoken', 'persuasive'],
    difficulty: 1,
    etymology: 'From Latin eloquentem, from eloqui "to speak out"'
  },
  {
    id: '14',
    value: 'diligent',
    definition: 'Having or showing care and conscientiousness in one\'s work or duties',
    partOfSpeech: 'adjective',
    pronunciation: 'DIL-i-jent',
    example: 'The diligent student always completed her assignments on time.',
    synonyms: ['hardworking', 'industrious', 'careful', 'thorough', 'attentive'],
    difficulty: 1,
    etymology: 'From Latin diligentem "attentive, careful"'
  },
  {
    id: '15',
    value: 'benevolent',
    definition: 'Well-meaning and kindly',
    partOfSpeech: 'adjective',
    pronunciation: 'buh-NEV-uh-lent',
    example: 'The benevolent donor gave millions to charity.',
    synonyms: ['kind', 'generous', 'charitable', 'altruistic', 'compassionate'],
    difficulty: 1,
    etymology: 'From Latin benevolens "wishing well, benevolent"'
  },

  // Difficulty Level 2 Words
  {
    id: '16',
    value: 'ambiguous',
    definition: 'Open to more than one interpretation; not having one obvious meaning',
    partOfSpeech: 'adjective',
    pronunciation: 'am-BIG-yoo-us',
    example: 'His ambiguous response left us wondering what he really meant.',
    synonyms: ['unclear', 'vague', 'equivocal', 'cryptic', 'obscure'],
    difficulty: 2,
    etymology: 'From Latin ambiguus "having double meaning, shifting"'
  },
  {
    id: '17',
    value: 'meticulous',
    definition: 'Showing great attention to detail; very careful and precise',
    partOfSpeech: 'adjective',
    pronunciation: 'muh-TIK-yuh-lus',
    example: 'The watchmaker was meticulous in assembling the tiny components.',
    synonyms: ['precise', 'thorough', 'careful', 'fastidious', 'scrupulous'],
    difficulty: 2,
    etymology: 'From Latin meticulosus "fearful, timid"'
  },
  {
    id: '18',
    value: 'resilient',
    definition: 'Able to withstand or recover quickly from difficult conditions',
    partOfSpeech: 'adjective',
    pronunciation: 'ri-ZIL-yent',
    example: 'The resilient community quickly rebuilt after the hurricane.',
    synonyms: ['tough', 'adaptable', 'hardy', 'flexible', 'buoyant'],
    difficulty: 2,
    etymology: 'From Latin resiliens, present participle of resilire "to rebound, recoil"'
  },
  {
    id: '19',
    value: 'pragmatic',
    definition: 'Dealing with things sensibly and realistically in a way that is based on practical considerations',
    partOfSpeech: 'adjective',
    pronunciation: 'prag-MAT-ik',
    example: 'We need a pragmatic approach to solving this problem.',
    synonyms: ['practical', 'realistic', 'sensible', 'rational', 'reasonable'],
    difficulty: 2,
    etymology: 'From Greek pragmatikos "relating to fact"'
  },
  {
    id: '20',
    value: 'verbose',
    definition: 'Using or containing more words than needed; wordy',
    partOfSpeech: 'adjective',
    pronunciation: 'ver-BOSE',
    example: 'His verbose explanation confused rather than clarified the issue.',
    synonyms: ['wordy', 'long-winded', 'prolix', 'talkative', 'garrulous'],
    difficulty: 2,
    etymology: 'From Latin verbosus "full of words"'
  },

  {
    id: '1',
    value: 'ephemeral',
    definition: 'Lasting for a very short time',
    partOfSpeech: 'adjective',
    pronunciation: 'ih-FEM-er-uhl',
    example: 'The ephemeral beauty of cherry blossoms makes them all the more precious.',
    synonyms: ['fleeting', 'transient', 'momentary', 'brief', 'short-lived'],
    difficulty: 4,
    etymology: 'From Greek ephēmeros, meaning "lasting only a day"'
  },
  {
    id: '2',
    value: 'mellifluous',
    definition: 'Sweet or musical; pleasant to hear',
    partOfSpeech: 'adjective',
    pronunciation: 'muh-LIF-loo-uhs',
    example: 'Her mellifluous voice captivated the entire audience during her speech.',
    synonyms: ['melodious', 'dulcet', 'honeyed', 'sweet-sounding', 'euphonious'],
    difficulty: 4,
    etymology: 'From Latin mellifer, meaning "bearing honey"'
  },
  {
    id: '3',
    value: 'serendipity',
    definition: 'The occurrence of events by chance in a happy or beneficial way',
    partOfSpeech: 'noun',
    pronunciation: 'ser-uhn-DIP-i-tee',
    example: 'Finding the rare book in that small shop was pure serendipity.',
    synonyms: ['chance', 'fortuity', 'providence', 'luck', 'fortunate coincidence'],
    difficulty: 3,
    etymology: 'Coined by Horace Walpole in 1754 from the Persian fairy tale "The Three Princes of Serendip"'
  },
  {
    id: '4',
    value: 'loquacious',
    definition: 'Tending to talk a great deal; garrulous',
    partOfSpeech: 'adjective',
    pronunciation: 'loh-KWAY-shuhs',
    example: 'The loquacious professor often spent half the class discussing tangential topics.',
    synonyms: ['talkative', 'garrulous', 'verbose', 'chatty', 'voluble'],
    difficulty: 4,
    etymology: 'From Latin loquax, meaning "talkative"'
  },
  {
    id: '5',
    value: 'obfuscate',
    definition: 'To make obscure, unclear, or unintelligible',
    partOfSpeech: 'verb',
    pronunciation: 'OB-fuh-skayt',
    example: 'The politician tried to obfuscate the issue by using technical jargon.',
    synonyms: ['confuse', 'complicate', 'muddle', 'cloud', 'obscure'],
    difficulty: 5,
    etymology: 'From Latin obfuscare, meaning "to darken"'
  },
  {
    id: '6',
    value: 'pernicious',
    definition: 'Having a harmful effect, especially in a gradual or subtle way',
    partOfSpeech: 'adjective',
    pronunciation: 'per-NISH-uhs',
    example: 'The pernicious influence of the gossip slowly damaged their friendship.',
    synonyms: ['harmful', 'destructive', 'malignant', 'noxious', 'insidious'],
    difficulty: 4,
    etymology: 'From Latin perniciosus, from pernicies "destruction"'
  },
  {
    id: '7',
    value: 'quintessential',
    definition: 'Representing the most perfect or typical example of a quality or class',
    partOfSpeech: 'adjective',
    pronunciation: 'kwin-tuh-SEN-shuhl',
    example: 'With its cobblestone streets and cafés, the village was the quintessential French countryside experience.',
    synonyms: ['archetypal', 'classic', 'definitive', 'exemplary', 'representative'],
    difficulty: 3,
    etymology: 'From Latin quintessentia, "fifth essence"'
  },
  {
    id: '8',
    value: 'ubiquitous',
    definition: 'Present, appearing, or found everywhere',
    partOfSpeech: 'adjective',
    pronunciation: 'yoo-BIK-wi-tuhs',
    example: 'Smartphones have become ubiquitous in modern society.',
    synonyms: ['omnipresent', 'universal', 'pervasive', 'everywhere', 'prevalent'],
    difficulty: 3,
    etymology: 'From Latin ubique, meaning "everywhere"'
  },
  {
    id: '9',
    value: 'sycophant',
    definition: 'A person who acts obsequiously toward someone important in order to gain advantage',
    partOfSpeech: 'noun',
    pronunciation: 'SIK-uh-fuhnt',
    example: 'The CEO surrounded himself with sycophants who never questioned his decisions.',
    synonyms: ['flatterer', 'toady', 'yes-man', 'bootlicker', 'brown-noser'],
    difficulty: 4,
    etymology: 'From Greek sykophantēs, originally "showing the fig"'
  },
  {
    id: '10',
    value: 'ineffable',
    definition: 'Too great or extreme to be expressed or described in words',
    partOfSpeech: 'adjective',
    pronunciation: 'in-EF-uh-buhl',
    example: 'The beauty of the sunset over the ocean was ineffable.',
    synonyms: ['inexpressible', 'indescribable', 'unspeakable', 'beyond words', 'unutterable'],
    difficulty: 5,
    etymology: 'From Latin ineffabilis, from in- "not" + effabilis "speakable"'
  },
  {
    id: '11',
    value: 'sonder',
    definition: 'The realization that each random passerby is living a life as vivid and complex as your own',
    partOfSpeech: 'noun',
    pronunciation: 'SON-der',
    example: 'In the crowded city, I often feel a sense of sonder as I watch strangers go about their lives.',
    synonyms: ['empathy', 'understanding', 'connection', 'shared experience'],
    difficulty: 1,
    etymology: 'Coined by John Koenig in "The Dictionary of Obscure Sorrows"'
  }
];

/**
 * Service to handle word-related operations
 */
export class WordService {
  private words: Word[] = literaryWords;

  /**
   * Get all available words
   * @returns Array of all words
   */
  public getAllWords(): Word[] {
    return [...this.words];
  }

  /**
   * Get a specific word by ID
   * @param id Word ID
   * @returns Word object or undefined if not found
   */
  public getWordById(id: string): Word | undefined {
    return this.words.find(word => word.id === id);
  }

  /**
   * Get words by difficulty level
   * @param level Difficulty level (1-5)
   * @returns Array of words matching the difficulty level
   */
  public getWordsByDifficulty(level: 1 | 2 | 3 | 4 | 5): Word[] {
    return this.words.filter(word => word.difficulty === level);
  }

  /**
   * Get a batch of new words for the user to learn
   * @param count Number of words to return
   * @param excludeIds IDs of words to exclude (e.g., already known words)
   * @param maxDifficulty Maximum difficulty level
   * @returns Array of words
   */
  public getNewWords(
    count: number,
    excludeIds: string[] = [],
    maxDifficulty: 1 | 2 | 3 | 4 | 5 = 5
  ): Word[] {
    console.log(`Excluding IDs: ${excludeIds.join(', ')}`);
    console.log(`Max Difficulty: ${maxDifficulty}`);
    return this.words
      .filter(word => !excludeIds.includes(word.id) && word.difficulty <= maxDifficulty)
      .sort(() => Math.random() - 0.5) // Randomize order
      .slice(0, count);
  }

  /**
   * Search for words matching a query
   * @param query Search query
   * @returns Array of matching words
   */
  public searchWords(query: string): Word[] {
    const lowerQuery = query.toLowerCase();
    return this.words.filter(word =>
      word.value.toLowerCase().includes(lowerQuery) ||
      word.definition.toLowerCase().includes(lowerQuery) ||
      word.synonyms.some((syn: string) => syn.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get related words (same difficulty or synonyms)
   * @param wordId ID of the word to find related words for
   * @param count Maximum number of related words to return
   * @returns Array of related words
   */
  public getRelatedWords(wordId: string, count: number = 5): Word[] {
    const word = this.getWordById(wordId);
    if (!word) return [];

    // First, find words that share synonyms
    const synonymRelated = this.words.filter(w =>
      w.id !== wordId &&
      (w.synonyms.some((syn: string) => word.synonyms.includes(syn)) ||
        word.synonyms.some((syn: string) => w.value.toLowerCase() === syn.toLowerCase()) ||
        w.value.toLowerCase() === word.synonyms.find((syn: string) => syn.toLowerCase() === w.value.toLowerCase()))
    );

    // If we don't have enough, add words of similar difficulty
    let result = [...synonymRelated];
    if (result.length < count) {
      const difficultyRelated = this.words.filter(w =>
        w.id !== wordId &&
        !result.find(r => r.id === w.id) &&
        w.difficulty === word.difficulty
      ).sort(() => Math.random() - 0.5);

      result = [...result, ...difficultyRelated].slice(0, count);
    }

    return result;
  }

  /**
   * Add a new word to the dictionary (for admin purposes)
   * @param word Word to add
   */
  public addWord(word: Omit<Word, 'id'>): Word {
    const newId = (Math.max(...this.words.map(w => parseInt(w.id))) + 1).toString();
    const newWord = { ...word, id: newId };
    this.words.push(newWord);
    return newWord;
  }
}

export default new WordService();
