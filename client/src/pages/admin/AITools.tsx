import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../stores/adminStore';
import { useWordStore } from '../../stores/wordStore';
import { AIPreviewCard } from '../../components/admin';
import { Card, Button, Input, Select, Badge, Textarea, Modal } from '../../components/common';
import type {
  MorphemeBreakdown,
  WordSuggestion,
  DefinitionData,
  WordFamilyData,
  PartOfSpeech,
} from '@vocab-builder/shared';
import './Admin.css';
import './AITools.css';

type ActiveTab = 'config' | 'analyzer' | 'suggester' | 'definition' | 'family' | 'history';

export default function AITools() {
  const {
    aiConfigured,
    aiProvider,
    isConfiguringAI,
    isGenerating,
    currentPreview,
    aiError,
    aiHistory,
    totalAiHistory,
    isLoadingHistory,
    checkAIConfig,
    configureAI,
    clearAIConfig,
    analyzeWord,
    populateWord,
    suggestWords,
    generateDefinition,
    generateWordFamily,
    applyPreview,
    setPreview,
    fetchAIHistory,
    clearError,
  } = useAdminStore();

  const { morphemes, fetchMorphemes, words, fetchWords, createWord } = useWordStore();

  const [activeTab, setActiveTab] = useState<ActiveTab>('config');
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'anthropic' | 'openai'>('anthropic');

  // Word Analyzer state
  const [analyzerWord, setAnalyzerWord] = useState('');
  const [analyzerWordId, setAnalyzerWordId] = useState<number | null>(null);

  // Word Suggester state
  const [selectedMorphemeId, setSelectedMorphemeId] = useState<number | null>(null);
  const [suggestionLimit, setSuggestionLimit] = useState(10);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(new Set());

  // Definition Generator state
  const [defWord, setDefWord] = useState('');
  const [defPartOfSpeech, setDefPartOfSpeech] = useState<PartOfSpeech>('noun');

  // Family Builder state
  const [familyRoot, setFamilyRoot] = useState('');
  const [familyMeaning, setFamilyMeaning] = useState('');
  const [selectedFamilyWords, setSelectedFamilyWords] = useState<Set<number>>(new Set());

  // Add Word Modal state (for creating word from analyzer)
  const [isAddWordModalOpen, setIsAddWordModalOpen] = useState(false);
  const [pendingMorphemes, setPendingMorphemes] = useState<MorphemeBreakdown | null>(null);
  const [isPopulatingWord, setIsPopulatingWord] = useState(false);
  const [isCreatingWord, setIsCreatingWord] = useState(false);
  const [wordFormData, setWordFormData] = useState({
    word: '',
    partOfSpeech: 'noun' as PartOfSpeech,
    pronunciation: '',
    etymology: '',
    difficulty: 2,
    definition: '',
    exampleSentence: '',
  });

  useEffect(() => {
    checkAIConfig();
    fetchMorphemes();
    fetchWords(1);
  }, [checkAIConfig, fetchMorphemes, fetchWords]);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchAIHistory(1);
    }
  }, [activeTab, fetchAIHistory]);

  const handleConfigure = async () => {
    try {
      await configureAI(provider, apiKey);
      setApiKey('');
      setActiveTab('analyzer');
    } catch (error) {
      // Error is handled in store
    }
  };

  const handleAnalyzeWord = async () => {
    if (!analyzerWord.trim()) return;

    // Find the word ID if it exists
    const existingWord = words.find(w => w.word.toLowerCase() === analyzerWord.toLowerCase());
    setAnalyzerWordId(existingWord?.id || null);

    await analyzeWord(analyzerWord);
  };

  const handleSuggestWords = async () => {
    if (!selectedMorphemeId) return;
    setSelectedSuggestions(new Set());
    await suggestWords(selectedMorphemeId, suggestionLimit);
  };

  const handleGenerateDefinition = async () => {
    if (!defWord.trim()) return;
    await generateDefinition(defWord, defPartOfSpeech);
  };

  const handleGenerateFamily = async () => {
    if (!familyRoot.trim() || !familyMeaning.trim()) return;
    setSelectedFamilyWords(new Set());
    await generateWordFamily(familyRoot, familyMeaning);
  };

  const handleApplyMorphemeBreakdown = async () => {
    if (!currentPreview || currentPreview.type !== 'morpheme-breakdown') return;

    const breakdown = currentPreview.data as MorphemeBreakdown;

    if (analyzerWordId) {
      // Word exists - just apply morphemes directly
      await applyPreview('morpheme-breakdown', {
        wordId: analyzerWordId,
        morphemes: breakdown.morphemes,
      });
      setAnalyzerWord('');
      setAnalyzerWordId(null);
      setPreview(null);
      fetchWords(1);
    } else {
      // Word doesn't exist - populate form and show modal
      setIsPopulatingWord(true);
      setPendingMorphemes(breakdown);

      try {
        const wordData = await populateWord(breakdown.word);
        setWordFormData({
          word: wordData.word,
          partOfSpeech: wordData.partOfSpeech,
          pronunciation: wordData.pronunciation,
          etymology: breakdown.etymology || wordData.etymology,
          difficulty: wordData.difficulty,
          definition: wordData.definition,
          exampleSentence: wordData.exampleSentence,
        });
        setIsAddWordModalOpen(true);
      } catch (error) {
        // If AI population fails, still show modal with basic data
        setWordFormData({
          word: breakdown.word,
          partOfSpeech: 'noun',
          pronunciation: '',
          etymology: breakdown.etymology || '',
          difficulty: 2,
          definition: '',
          exampleSentence: '',
        });
        setIsAddWordModalOpen(true);
      } finally {
        setIsPopulatingWord(false);
      }
    }
  };

  const handleCreateWordAndApplyMorphemes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingMorphemes) return;

    setIsCreatingWord(true);
    try {
      // Create the word
      const newWord = await createWord({
        word: wordFormData.word,
        partOfSpeech: wordFormData.partOfSpeech,
        pronunciation: wordFormData.pronunciation || undefined,
        etymology: wordFormData.etymology || undefined,
        difficulty: wordFormData.difficulty,
        definitions: [{
          definition: wordFormData.definition,
          exampleSentence: wordFormData.exampleSentence || undefined,
          isPrimary: true,
        }],
      });

      // Apply morpheme associations
      await applyPreview('morpheme-breakdown', {
        wordId: newWord.id,
        morphemes: pendingMorphemes.morphemes,
      });

      // Clean up
      setIsAddWordModalOpen(false);
      setPendingMorphemes(null);
      setAnalyzerWord('');
      setAnalyzerWordId(null);
      setPreview(null);
      fetchWords(1);
    } catch (error) {
      console.error('Failed to create word:', error);
    } finally {
      setIsCreatingWord(false);
    }
  };

  const handleCloseAddWordModal = () => {
    setIsAddWordModalOpen(false);
    setPendingMorphemes(null);
  };

  const handleApplySuggestions = async () => {
    if (!currentPreview || currentPreview.type !== 'word-suggestions' || !selectedMorphemeId) return;

    const suggestions = currentPreview.data as WordSuggestion[];
    const selectedWords = suggestions.filter((_, index) => selectedSuggestions.has(index));

    await applyPreview('word-suggestions', {
      morphemeId: selectedMorphemeId,
      words: selectedWords,
    });

    setSelectedSuggestions(new Set());
  };

  const handleApplyFamily = async () => {
    if (!currentPreview || currentPreview.type !== 'word-family') return;

    const family = currentPreview.data as WordFamilyData;
    const selectedWords = family.words.filter((_, index) => selectedFamilyWords.has(index));

    await applyPreview('word-family', {
      root: family.root,
      words: selectedWords,
    });

    setSelectedFamilyWords(new Set());
    setFamilyRoot('');
    setFamilyMeaning('');
  };

  const toggleSuggestionSelection = (index: number) => {
    const newSelection = new Set(selectedSuggestions);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedSuggestions(newSelection);
  };

  const toggleFamilyWordSelection = (index: number) => {
    const newSelection = new Set(selectedFamilyWords);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedFamilyWords(newSelection);
  };

  const partOfSpeechOptions = [
    { value: 'noun', label: 'Noun' },
    { value: 'verb', label: 'Verb' },
    { value: 'adjective', label: 'Adjective' },
    { value: 'adverb', label: 'Adverb' },
  ];

  const tabs: { id: ActiveTab; label: string; requiresConfig?: boolean }[] = [
    { id: 'config', label: 'Configuration' },
    { id: 'analyzer', label: 'Word Analyzer', requiresConfig: true },
    { id: 'suggester', label: 'Word Suggester', requiresConfig: true },
    { id: 'definition', label: 'Definition Generator', requiresConfig: true },
    { id: 'family', label: 'Family Builder', requiresConfig: true },
    { id: 'history', label: 'History' },
  ];

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>AI Tools</h1>
          <p>AI-powered content generation for vocabulary building</p>
        </div>
        {aiConfigured && (
          <Badge variant="success">
            Connected: {aiProvider}
          </Badge>
        )}
      </header>

      {aiError && (
        <div className="ai-tools__error">
          {aiError}
          <button onClick={clearError}>&times;</button>
        </div>
      )}

      <div className="ai-tools__tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`ai-tools__tab ${activeTab === tab.id ? 'ai-tools__tab--active' : ''} ${
              tab.requiresConfig && !aiConfigured ? 'ai-tools__tab--disabled' : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
            disabled={tab.requiresConfig && !aiConfigured}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="ai-tools__content">
        {/* Configuration Tab */}
        {activeTab === 'config' && (
          <Card className="ai-tools__section">
            <h3>AI Configuration</h3>
            <p className="ai-tools__description">
              Enter your API key to enable AI-powered features. The key is stored in memory only
              and will be cleared when the server restarts.
            </p>

            {aiConfigured ? (
              <div className="ai-tools__configured">
                <div className="ai-tools__configured-status">
                  <Badge variant="success" size="lg">Connected</Badge>
                  <span>Provider: {aiProvider}</span>
                </div>
                <Button variant="danger" onClick={clearAIConfig}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="ai-tools__config-form">
                <Select
                  label="Provider"
                  value={provider}
                  onChange={e => setProvider(e.target.value as 'anthropic' | 'openai')}
                  options={[
                    { value: 'anthropic', label: 'Anthropic (Claude)' },
                    { value: 'openai', label: 'OpenAI (GPT-4) - Coming Soon' },
                  ]}
                />
                <Input
                  label="API Key"
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                />
                <Button
                  onClick={handleConfigure}
                  isLoading={isConfiguringAI}
                  disabled={!apiKey || provider === 'openai'}
                >
                  Connect
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Word Analyzer Tab */}
        {activeTab === 'analyzer' && (
          <Card className="ai-tools__section">
            <h3>Word Analyzer</h3>
            <p className="ai-tools__description">
              Enter a word to get its morpheme breakdown. The AI will identify prefixes, roots,
              and suffixes along with their meanings and origins.
            </p>

            <div className="ai-tools__form">
              <div className="ai-tools__form-row">
                <Input
                  label="Word to analyze"
                  value={analyzerWord}
                  onChange={e => setAnalyzerWord(e.target.value)}
                  placeholder="e.g., magnanimous"
                  onKeyDown={e => e.key === 'Enter' && handleAnalyzeWord()}
                />
                <Button
                  onClick={handleAnalyzeWord}
                  isLoading={isGenerating}
                  disabled={!analyzerWord.trim()}
                >
                  Analyze
                </Button>
              </div>
            </div>

            {currentPreview?.type === 'morpheme-breakdown' && (
              <div className="ai-tools__preview">
                <AIPreviewCard
                  type="morpheme-breakdown"
                  data={currentPreview.data}
                  onApply={handleApplyMorphemeBreakdown}
                  onCancel={() => setPreview(null)}
                  isApplying={isGenerating}
                />
                {!analyzerWordId && currentPreview && (
                  <div className="ai-tools__info">
                    "{analyzerWord}" doesn't exist yet. Click "Apply to Database" to open the Add Word form with AI-populated data, then create the word with these morphemes attached.
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Word Suggester Tab */}
        {activeTab === 'suggester' && (
          <Card className="ai-tools__section">
            <h3>Word Suggester</h3>
            <p className="ai-tools__description">
              Select a morpheme to get word suggestions that contain it. Great for building
              out word families.
            </p>

            <div className="ai-tools__form">
              <div className="ai-tools__form-row">
                <Select
                  label="Select Morpheme"
                  value={selectedMorphemeId?.toString() || ''}
                  onChange={e => setSelectedMorphemeId(parseInt(e.target.value) || null)}
                  options={[
                    { value: '', label: 'Select a morpheme...' },
                    ...morphemes.map(m => ({
                      value: m.id.toString(),
                      label: `${m.morpheme} (${m.type}) - ${m.meaning}`,
                    })),
                  ]}
                />
                <Select
                  label="Number of suggestions"
                  value={suggestionLimit.toString()}
                  onChange={e => setSuggestionLimit(parseInt(e.target.value))}
                  options={[
                    { value: '5', label: '5' },
                    { value: '10', label: '10' },
                    { value: '15', label: '15' },
                    { value: '20', label: '20' },
                  ]}
                />
                <Button
                  onClick={handleSuggestWords}
                  isLoading={isGenerating}
                  disabled={!selectedMorphemeId}
                >
                  Generate
                </Button>
              </div>
            </div>

            {currentPreview?.type === 'word-suggestions' && (
              <div className="ai-tools__preview">
                <AIPreviewCard
                  type="word-suggestions"
                  data={currentPreview.data}
                  onApply={handleApplySuggestions}
                  onCancel={() => setPreview(null)}
                  isApplying={isGenerating}
                  selectedItems={selectedSuggestions}
                  onToggleItem={toggleSuggestionSelection}
                />
              </div>
            )}
          </Card>
        )}

        {/* Definition Generator Tab */}
        {activeTab === 'definition' && (
          <Card className="ai-tools__section">
            <h3>Definition Generator</h3>
            <p className="ai-tools__description">
              Generate a definition, example sentence, and etymology for a word.
            </p>

            <div className="ai-tools__form">
              <div className="ai-tools__form-row">
                <Input
                  label="Word"
                  value={defWord}
                  onChange={e => setDefWord(e.target.value)}
                  placeholder="e.g., ephemeral"
                />
                <Select
                  label="Part of Speech"
                  value={defPartOfSpeech}
                  onChange={e => setDefPartOfSpeech(e.target.value as PartOfSpeech)}
                  options={partOfSpeechOptions}
                />
                <Button
                  onClick={handleGenerateDefinition}
                  isLoading={isGenerating}
                  disabled={!defWord.trim()}
                >
                  Generate
                </Button>
              </div>
            </div>

            {currentPreview?.type === 'definition' && (
              <div className="ai-tools__preview">
                <AIPreviewCard
                  type="definition"
                  data={currentPreview.data}
                  onApply={() => {
                    // Copy to clipboard or integrate with word creation
                    setPreview(null);
                  }}
                  onCancel={() => setPreview(null)}
                  isApplying={isGenerating}
                />
              </div>
            )}
          </Card>
        )}

        {/* Family Builder Tab */}
        {activeTab === 'family' && (
          <Card className="ai-tools__section">
            <h3>Word Family Builder</h3>
            <p className="ai-tools__description">
              Enter a root morpheme and its meaning to generate an entire word family.
              This will create the root morpheme and multiple related words.
            </p>

            <div className="ai-tools__form">
              <div className="ai-tools__form-row">
                <Input
                  label="Root Morpheme"
                  value={familyRoot}
                  onChange={e => setFamilyRoot(e.target.value)}
                  placeholder="e.g., aud"
                />
                <Input
                  label="Meaning"
                  value={familyMeaning}
                  onChange={e => setFamilyMeaning(e.target.value)}
                  placeholder="e.g., to hear"
                />
                <Button
                  onClick={handleGenerateFamily}
                  isLoading={isGenerating}
                  disabled={!familyRoot.trim() || !familyMeaning.trim()}
                >
                  Generate Family
                </Button>
              </div>
            </div>

            {currentPreview?.type === 'word-family' && (
              <div className="ai-tools__preview">
                <AIPreviewCard
                  type="word-family"
                  data={currentPreview.data}
                  onApply={handleApplyFamily}
                  onCancel={() => setPreview(null)}
                  isApplying={isGenerating}
                  selectedItems={selectedFamilyWords}
                  onToggleItem={toggleFamilyWordSelection}
                />
              </div>
            )}
          </Card>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <Card className="ai-tools__section">
            <h3>Generation History</h3>
            <p className="ai-tools__description">
              View past AI generation requests and their results.
            </p>

            {isLoadingHistory ? (
              <div className="ai-tools__loading">Loading history...</div>
            ) : aiHistory.length === 0 ? (
              <div className="ai-tools__empty">No generation history yet.</div>
            ) : (
              <div className="ai-tools__history">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Operation</th>
                      <th>Input</th>
                      <th>Status</th>
                      <th>User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiHistory.map(log => (
                      <tr key={log.id}>
                        <td>{new Date(log.createdAt).toLocaleString()}</td>
                        <td>
                          <Badge variant="default">{log.operationType}</Badge>
                        </td>
                        <td className="ai-tools__history-input">
                          {JSON.stringify(log.inputData).substring(0, 50)}...
                        </td>
                        <td>
                          <Badge
                            variant={
                              log.status === 'completed'
                                ? 'success'
                                : log.status === 'failed'
                                ? 'danger'
                                : 'warning'
                            }
                          >
                            {log.status}
                          </Badge>
                        </td>
                        <td>{log.username || 'Unknown'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Add Word Modal (for creating word from analyzer) */}
      <Modal
        isOpen={isAddWordModalOpen}
        onClose={handleCloseAddWordModal}
        title="Add Word & Apply Morphemes"
        size="lg"
      >
        <form onSubmit={handleCreateWordAndApplyMorphemes} className="admin-form">
          <div className="ai-tools__modal-info">
            This word will be created with the morpheme breakdown you analyzed.
            Review and edit the AI-generated data below before creating.
          </div>

          {pendingMorphemes && (
            <div className="ai-tools__modal-morphemes">
              <span className="ai-tools__modal-morphemes-label">Morphemes to apply:</span>
              <div className="ai-tools__modal-morphemes-list">
                {pendingMorphemes.morphemes.map((m, i) => (
                  <Badge
                    key={i}
                    variant={m.type === 'prefix' ? 'primary' : m.type === 'root' ? 'success' : 'secondary'}
                    size="sm"
                  >
                    {m.text} ({m.meaning})
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Input
            label="Word"
            value={wordFormData.word}
            onChange={e => setWordFormData({ ...wordFormData, word: e.target.value })}
            required
            disabled
          />

          <div className="admin-form__row">
            <Select
              label="Part of Speech"
              value={wordFormData.partOfSpeech}
              onChange={e => setWordFormData({ ...wordFormData, partOfSpeech: e.target.value as PartOfSpeech })}
              options={[
                { value: 'noun', label: 'Noun' },
                { value: 'verb', label: 'Verb' },
                { value: 'adjective', label: 'Adjective' },
                { value: 'adverb', label: 'Adverb' },
                { value: 'preposition', label: 'Preposition' },
                { value: 'conjunction', label: 'Conjunction' },
                { value: 'interjection', label: 'Interjection' },
              ]}
            />
            <Select
              label="Difficulty"
              value={wordFormData.difficulty.toString()}
              onChange={e => setWordFormData({ ...wordFormData, difficulty: parseInt(e.target.value, 10) })}
              options={[
                { value: '1', label: '1 - Easy' },
                { value: '2', label: '2 - Medium' },
                { value: '3', label: '3 - Hard' },
                { value: '4', label: '4 - Very Hard' },
                { value: '5', label: '5 - Expert' },
              ]}
            />
          </div>

          <Input
            label="Pronunciation"
            value={wordFormData.pronunciation}
            onChange={e => setWordFormData({ ...wordFormData, pronunciation: e.target.value })}
            placeholder="e.g., in-SOO-see-uhnt"
          />

          <Textarea
            label="Definition"
            value={wordFormData.definition}
            onChange={e => setWordFormData({ ...wordFormData, definition: e.target.value })}
            required
          />

          <Textarea
            label="Example Sentence"
            value={wordFormData.exampleSentence}
            onChange={e => setWordFormData({ ...wordFormData, exampleSentence: e.target.value })}
          />

          <Textarea
            label="Etymology"
            value={wordFormData.etymology}
            onChange={e => setWordFormData({ ...wordFormData, etymology: e.target.value })}
          />

          <div className="admin-form__actions">
            <Button variant="ghost" type="button" onClick={handleCloseAddWordModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreatingWord}>
              Create Word & Apply Morphemes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
