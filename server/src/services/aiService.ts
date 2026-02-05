import Anthropic from '@anthropic-ai/sdk';
import type {
  MorphemeBreakdown,
  WordSuggestion,
  DefinitionData,
  WordFamilyData,
  MorphemeType,
  PartOfSpeech,
} from '@vocab-builder/shared';

// In-memory storage for API key (session-only, most secure)
let anthropicClient: Anthropic | null = null;
let configuredProvider: 'anthropic' | 'openai' | null = null;

const MODEL = 'claude-sonnet-4-20250514';

export interface AIServiceConfig {
  provider: 'anthropic' | 'openai';
  apiKey: string;
}

export function configureAI(config: AIServiceConfig): void {
  if (config.provider === 'anthropic') {
    anthropicClient = new Anthropic({ apiKey: config.apiKey });
    configuredProvider = 'anthropic';
  } else {
    throw new Error('OpenAI provider not yet implemented');
  }
}

export function isConfigured(): { configured: boolean; provider: string | null } {
  return {
    configured: anthropicClient !== null,
    provider: configuredProvider,
  };
}

export function clearConfig(): void {
  anthropicClient = null;
  configuredProvider = null;
}

export async function testConnection(): Promise<boolean> {
  if (!anthropicClient) {
    throw new Error('AI service not configured');
  }

  try {
    // Make a minimal API call to test the connection
    await anthropicClient.messages.create({
      model: MODEL,
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Hi' }],
    });
    return true;
  } catch (error) {
    console.error('AI connection test failed:', error);
    return false;
  }
}

export async function analyzeWord(word: string): Promise<MorphemeBreakdown> {
  if (!anthropicClient) {
    throw new Error('AI service not configured');
  }

  const prompt = `Analyze the English word "${word}" and break it down into its morphemes (prefixes, roots, and suffixes).

Return a JSON object with this exact structure:
{
  "word": "${word}",
  "morphemes": [
    {
      "text": "the morpheme text with appropriate hyphen",
      "type": "prefix" | "root" | "suffix",
      "meaning": "what this morpheme means",
      "origin": "Latin" | "Greek" | "Old English" | "French" | etc.
    }
  ],
  "etymology": "A brief etymology of the word explaining its historical origin and development"
}

Rules:
- List morphemes in order from left to right as they appear in the word
- Every word must have at least one root
- Be accurate with the morpheme boundaries
- Include the origin language for each morpheme
- Provide a concise but informative etymology
- IMPORTANT: Format morphemes with hyphens to indicate attachment:
  - Prefixes must END with a hyphen (e.g., "pre-", "un-", "re-")
  - Suffixes must START with a hyphen (e.g., "-tion", "-ness", "-ard", "-ly")
  - Roots have NO hyphens (e.g., "dict", "spect", "aud")

Return ONLY the JSON object, no additional text.`;

  const response = await anthropicClient.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from AI');
  }

  try {
    const parsed = JSON.parse(content.text);
    return {
      word: parsed.word,
      morphemes: parsed.morphemes.map((m: { text: string; type: string; meaning: string; origin?: string }) => ({
        text: m.text,
        type: m.type as MorphemeType,
        meaning: m.meaning,
        origin: m.origin,
      })),
      etymology: parsed.etymology,
    };
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${content.text}`);
  }
}

export async function suggestWords(
  morpheme: string,
  meaning: string,
  morphemeType: MorphemeType,
  limit: number = 10
): Promise<WordSuggestion[]> {
  if (!anthropicClient) {
    throw new Error('AI service not configured');
  }

  const prompt = `Generate ${limit} English words that contain the ${morphemeType} "${morpheme}" (meaning: ${meaning}).

Return a JSON array with this exact structure:
[
  {
    "word": "the word",
    "partOfSpeech": "noun" | "verb" | "adjective" | "adverb",
    "definition": "a clear, concise definition",
    "etymology": "brief etymology explaining the word's origin and morpheme components",
    "morphemes": [
      {
        "text": "morpheme with hyphen",
        "type": "prefix" | "root" | "suffix",
        "meaning": "what this morpheme means",
        "origin": "Latin" | "Greek" | "Old English" | etc.
      }
    ]
  }
]

Rules:
- Only include words where the morpheme "${morpheme}" is actually used with its meaning "${meaning}"
- Include a mix of common and advanced vocabulary words
- Definitions should be concise but complete (1-2 sentences)
- Order from most common to least common usage
- For each word, include its complete morpheme breakdown
- IMPORTANT: Format morphemes with hyphens to indicate attachment:
  - Prefixes must END with a hyphen (e.g., "pre-", "un-", "re-")
  - Suffixes must START with a hyphen (e.g., "-tion", "-ness", "-ard", "-ly")
  - Roots have NO hyphens (e.g., "dict", "spect", "aud")

Return ONLY the JSON array, no additional text.`;

  const response = await anthropicClient.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from AI');
  }

  try {
    const parsed = JSON.parse(content.text);
    return parsed.map((w: {
      word: string;
      partOfSpeech: string;
      definition: string;
      etymology: string;
      morphemes: Array<{ text: string; type: string; meaning: string; origin?: string }>;
    }) => ({
      word: w.word.toLowerCase(),
      partOfSpeech: w.partOfSpeech as PartOfSpeech,
      definition: w.definition,
      etymology: w.etymology,
      morphemes: w.morphemes.map(m => ({
        text: m.text,
        type: m.type as MorphemeType,
        meaning: m.meaning,
        origin: m.origin,
      })),
      exists: false, // Will be checked against DB by the route
    }));
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${content.text}`);
  }
}

export async function generateDefinition(
  word: string,
  partOfSpeech: string
): Promise<DefinitionData> {
  if (!anthropicClient) {
    throw new Error('AI service not configured');
  }

  const prompt = `Generate a definition, example sentence, and etymology for the ${partOfSpeech} "${word}".

Return a JSON object with this exact structure:
{
  "definition": "A clear, dictionary-style definition appropriate for vocabulary learning",
  "exampleSentence": "A natural sentence demonstrating proper usage of the word",
  "etymology": "The origin and history of the word, including its component morphemes and their meanings"
}

Rules:
- The definition should be clear and educational
- The example sentence should clearly demonstrate the word's meaning in context
- The etymology should trace the word's roots and explain how it came to have its current meaning

Return ONLY the JSON object, no additional text.`;

  const response = await anthropicClient.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from AI');
  }

  try {
    return JSON.parse(content.text) as DefinitionData;
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${content.text}`);
  }
}

export async function generateWordFamily(
  rootMorpheme: string,
  meaning: string
): Promise<WordFamilyData> {
  if (!anthropicClient) {
    throw new Error('AI service not configured');
  }

  const prompt = `Generate a word family for the root morpheme "${rootMorpheme}" (meaning: ${meaning}).

Return a JSON object with this exact structure:
{
  "root": {
    "morpheme": "${rootMorpheme}",
    "meaning": "${meaning}",
    "origin": "Latin" | "Greek" | "Old English" | etc.
  },
  "words": [
    {
      "word": "a word containing this root",
      "partOfSpeech": "noun" | "verb" | "adjective" | "adverb",
      "definition": "clear, concise definition",
      "morphemes": ["pre-", "${rootMorpheme}", "-tion"]
    }
  ]
}

Rules:
- Include 8-12 words that share this root
- Include a mix of parts of speech where applicable
- List morphemes in order as they appear in the word
- Order words from most common to least common
- Include both simple and complex words (with multiple affixes)
- Make sure the root morpheme is clearly present and contributing its meaning in each word
- IMPORTANT: Format morphemes with hyphens to indicate attachment:
  - Prefixes must END with a hyphen (e.g., "pre-", "un-", "re-")
  - Suffixes must START with a hyphen (e.g., "-tion", "-ness", "-ard", "-ly")
  - Roots have NO hyphens (e.g., "dict", "spect", "aud")

Return ONLY the JSON object, no additional text.`;

  const response = await anthropicClient.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from AI');
  }

  try {
    const parsed = JSON.parse(content.text);
    return {
      root: {
        morpheme: parsed.root.morpheme,
        meaning: parsed.root.meaning,
        origin: parsed.root.origin,
      },
      words: parsed.words.map((w: { word: string; partOfSpeech: string; definition: string; morphemes: string[] }) => ({
        word: w.word.toLowerCase(),
        partOfSpeech: w.partOfSpeech as PartOfSpeech,
        definition: w.definition,
        morphemes: w.morphemes,
        exists: false, // Will be checked against DB by the route
      })),
    };
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${content.text}`);
  }
}

export interface WordPopulateData {
  word: string;
  partOfSpeech: PartOfSpeech;
  pronunciation: string;
  definition: string;
  exampleSentence: string;
  etymology: string;
  difficulty: number;
}

export async function populateWordData(word: string): Promise<WordPopulateData> {
  if (!anthropicClient) {
    throw new Error('AI service not configured');
  }

  const prompt = `Analyze the English word "${word}" and provide complete dictionary-style information.

Return a JSON object with this exact structure:
{
  "word": "${word}",
  "partOfSpeech": "noun" | "verb" | "adjective" | "adverb" | "preposition" | "conjunction" | "interjection",
  "pronunciation": "phonetic pronunciation guide (e.g., mag-NAN-uh-mus)",
  "definition": "A clear, educational dictionary-style definition",
  "exampleSentence": "A natural sentence demonstrating proper usage",
  "etymology": "The origin and history of the word, tracing its roots",
  "difficulty": 1-5 (1=common/easy, 2=intermediate, 3=advanced, 4=scholarly, 5=rare/archaic)
}

Rules:
- partOfSpeech should be the most common usage of the word
- pronunciation should use simple syllable markers with capitals for stress
- definition should be clear, concise, and suitable for vocabulary learning
- exampleSentence should clearly demonstrate the word's meaning in natural context
- etymology should explain the word's origins and component parts
- difficulty should reflect how commonly the word is used:
  - 1: Very common words (used in everyday speech)
  - 2: Common words (high school level)
  - 3: Advanced words (college level, SAT/GRE words)
  - 4: Scholarly words (academic, professional)
  - 5: Rare/archaic words (literary, historical)

Return ONLY the JSON object, no additional text.`;

  const response = await anthropicClient.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from AI');
  }

  try {
    const parsed = JSON.parse(content.text);
    return {
      word: parsed.word,
      partOfSpeech: parsed.partOfSpeech as PartOfSpeech,
      pronunciation: parsed.pronunciation,
      definition: parsed.definition,
      exampleSentence: parsed.exampleSentence,
      etymology: parsed.etymology,
      difficulty: Math.min(5, Math.max(1, parseInt(parsed.difficulty) || 2)),
    };
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${content.text}`);
  }
}

export function getTokensUsed(): number {
  // Note: In a real implementation, you'd track token usage across calls
  // For now, returning 0 as a placeholder
  return 0;
}

// Morpheme audit types
export interface MorphemeAuditSuggestion {
  text: string;
  type: MorphemeType;
  meaning: string;
  origin?: string;
  canonicalForm?: string; // If this is a variant, what's the canonical form
  isVariant: boolean;
}

export interface WordAuditResult {
  wordId: number;
  word: string;
  currentMorphemes: Array<{ id: number; morpheme: string; type: string; meaning: string; canonicalId?: number | null }>;
  suggestedMorphemes: MorphemeAuditSuggestion[];
  hasDiscrepancy: boolean;
  discrepancyType?: 'missing' | 'incorrect' | 'extra' | 'order' | 'variant';
  notes?: string;
}

export async function auditWordMorphemes(
  words: Array<{
    id: number;
    word: string;
    currentMorphemes: Array<{ id: number; morpheme: string; type: string; meaning: string; canonicalId?: number | null }>;
  }>,
  existingMorphemes: Array<{ id: number; morpheme: string; type: string; meaning: string; canonicalId?: number | null }>
): Promise<WordAuditResult[]> {
  if (!anthropicClient) {
    throw new Error('AI service not configured');
  }

  // Build a map of canonical morphemes and their variants for the prompt
  const canonicalMap = new Map<number, { morpheme: string; variants: string[] }>();
  existingMorphemes.forEach(m => {
    if (!m.canonicalId) {
      canonicalMap.set(m.id, { morpheme: m.morpheme, variants: [] });
    }
  });
  existingMorphemes.forEach(m => {
    if (m.canonicalId && canonicalMap.has(m.canonicalId)) {
      canonicalMap.get(m.canonicalId)!.variants.push(m.morpheme);
    }
  });

  const variantInfo = Array.from(canonicalMap.entries())
    .filter(([_, v]) => v.variants.length > 0)
    .map(([_, v]) => `${v.morpheme} has variants: ${v.variants.join(', ')}`)
    .join('\n');

  const wordsInfo = words.map(w => ({
    id: w.id,
    word: w.word,
    currentMorphemes: w.currentMorphemes.map(m => m.morpheme).join(' + '),
  }));

  const prompt = `Analyze these words and their current morpheme breakdowns. Check for errors and suggest corrections.

IMPORTANT CONTEXT - Prefix Assimilation Variants:
Some prefixes change form based on the following consonant. These variants are stored separately in our database.
${variantInfo || 'No variants defined yet.'}

Common assimilation patterns to look for:
- ad- (to, toward) → ac-, af-, ag-, al-, an-, ap-, ar-, as-, at- before c, f, g, l, n, p, r, s, t
- com- (with, together) → col-, con-, cor- before l, n, r
- in- (not, into) → il-, im-, ir- before l, m/b/p, r
- ob- (against) → oc-, of-, op- before c, f, p
- sub- (under) → suc-, suf-, sug-, sup-, sur-, sus- before c, f, g, p, r, s
- syn- (together) → syl-, sym-, sys- before l, m/b/p, s

Words to analyze:
${JSON.stringify(wordsInfo, null, 2)}

For each word, return your analysis in this JSON format:
{
  "results": [
    {
      "wordId": number,
      "word": "the word",
      "suggestedMorphemes": [
        {
          "text": "morpheme with hyphen",
          "type": "prefix" | "root" | "suffix",
          "meaning": "meaning",
          "origin": "Latin" | "Greek" | etc,
          "canonicalForm": "if this is a variant like 'as-', put the canonical 'ad-' here, otherwise null",
          "isVariant": true | false
        }
      ],
      "hasDiscrepancy": true | false,
      "discrepancyType": "missing" | "incorrect" | "extra" | "order" | "variant" | null,
      "notes": "explanation of what's wrong and how to fix it, or null if correct"
    }
  ]
}

Rules:
- IMPORTANT: Format morphemes with hyphens: prefixes end with hyphen (pre-), suffixes start with hyphen (-tion), roots have no hyphens
- Mark isVariant: true if the morpheme is an assimilated form of a canonical prefix
- If a word uses a variant form (like "as-" in "assiduous"), the canonicalForm should be the base form ("ad-")
- hasDiscrepancy should be true if the current breakdown differs from your suggestion
- discrepancyType categories:
  - "missing": morpheme(s) are missing from current breakdown
  - "incorrect": wrong morpheme identified (e.g., wrong root)
  - "extra": extra morpheme that shouldn't be there
  - "order": morphemes in wrong order
  - "variant": using canonical form instead of variant or vice versa
- Some words genuinely have no standard morpheme breakdown - note this in the notes field

Return ONLY the JSON object, no additional text.`;

  const response = await anthropicClient.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from AI');
  }

  try {
    const parsed = JSON.parse(content.text);
    return parsed.results.map((r: {
      wordId: number;
      word: string;
      suggestedMorphemes: MorphemeAuditSuggestion[];
      hasDiscrepancy: boolean;
      discrepancyType?: string;
      notes?: string;
    }) => {
      const originalWord = words.find(w => w.id === r.wordId);
      return {
        wordId: r.wordId,
        word: r.word,
        currentMorphemes: originalWord?.currentMorphemes || [],
        suggestedMorphemes: r.suggestedMorphemes,
        hasDiscrepancy: r.hasDiscrepancy,
        discrepancyType: r.discrepancyType as WordAuditResult['discrepancyType'],
        notes: r.notes,
      };
    });
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${content.text}`);
  }
}
