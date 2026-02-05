import React, { useEffect, useState, useMemo } from 'react';
import { useWordStore } from '../../stores/wordStore';
import { useAdminStore } from '../../stores/adminStore';
import { Card, Button, Input, Select, Modal, ConfirmModal, Badge, Textarea } from '../../components/common';
import { MorphemeChip } from '../../components/admin/MorphemeChip';
import type { WordWithDetails, PartOfSpeech, Morpheme } from '@vocab-builder/shared';
import './Admin.css';

export default function AdminWords() {
  const { words, fetchWords, createWord, updateWord, deleteWord, isLoading, totalWords, currentPage, morphemes, fetchMorphemes } = useWordStore();
  const { populateWord, isGenerating, aiConfigured, checkAIConfig, aiError, clearError, updateWordMorphemes } = useAdminStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordWithDetails | null>(null);
  const [formData, setFormData] = useState({
    word: '',
    partOfSpeech: 'noun' as PartOfSpeech,
    pronunciation: '',
    etymology: '',
    difficulty: 2,
    definition: '',
    exampleSentence: '',
  });
  const [populateError, setPopulateError] = useState<string | null>(null);

  // Morpheme editing state
  const [selectedMorphemeIds, setSelectedMorphemeIds] = useState<number[]>([]);
  const [morphemeSearch, setMorphemeSearch] = useState('');
  const [noMorphemes, setNoMorphemes] = useState(false); // Flag for words that intentionally have no morphemes

  useEffect(() => {
    fetchWords(1, { search: search || undefined });
    checkAIConfig();
    fetchMorphemes();
  }, [fetchWords, checkAIConfig, fetchMorphemes]);

  // Filter morphemes based on search
  const filteredMorphemes = useMemo(() => {
    if (!morphemeSearch) return morphemes;
    const searchLower = morphemeSearch.toLowerCase();
    return morphemes.filter(
      m => m.morpheme.toLowerCase().includes(searchLower) || m.meaning.toLowerCase().includes(searchLower)
    );
  }, [morphemes, morphemeSearch]);

  // Get selected morphemes with details
  const selectedMorphemes = useMemo(() => {
    return selectedMorphemeIds
      .map(id => morphemes.find(m => m.id === id))
      .filter((m): m is Morpheme => m !== undefined);
  }, [selectedMorphemeIds, morphemes]);

  const handlePopulateWithAI = async () => {
    if (!formData.word.trim()) {
      setPopulateError('Enter a word first');
      return;
    }

    setPopulateError(null);
    try {
      const data = await populateWord(formData.word.trim());
      setFormData({
        ...formData,
        word: data.word,
        partOfSpeech: data.partOfSpeech,
        pronunciation: data.pronunciation,
        definition: data.definition,
        exampleSentence: data.exampleSentence,
        etymology: data.etymology,
        difficulty: data.difficulty,
      });
    } catch (error) {
      setPopulateError(error instanceof Error ? error.message : 'Failed to populate');
    }
  };

  const handleSearch = () => {
    fetchWords(1, { search: search || undefined });
  };

  const handleOpenCreate = () => {
    setSelectedWord(null);
    setFormData({
      word: '',
      partOfSpeech: 'noun',
      pronunciation: '',
      etymology: '',
      difficulty: 2,
      definition: '',
      exampleSentence: '',
    });
    setSelectedMorphemeIds([]);
    setNoMorphemes(false);
    setMorphemeSearch('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (word: WordWithDetails) => {
    setSelectedWord(word);
    const primaryDef = word.definitions.find(d => d.isPrimary) || word.definitions[0];
    setFormData({
      word: word.word,
      partOfSpeech: word.partOfSpeech,
      pronunciation: word.pronunciation || '',
      etymology: word.etymology || '',
      difficulty: word.difficulty,
      definition: primaryDef?.definition || '',
      exampleSentence: primaryDef?.exampleSentence || '',
    });
    // Load word's current morphemes
    const morphemeIds = word.morphemes
      .sort((a, b) => a.position - b.position)
      .map(m => m.id);
    setSelectedMorphemeIds(morphemeIds);
    setNoMorphemes(false);
    setMorphemeSearch('');
    setIsModalOpen(true);
  };

  const handleOpenDelete = (word: WordWithDetails) => {
    setSelectedWord(word);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const wordData = {
      word: formData.word,
      partOfSpeech: formData.partOfSpeech,
      pronunciation: formData.pronunciation || undefined,
      etymology: formData.etymology || undefined,
      difficulty: formData.difficulty,
      definitions: [{
        definition: formData.definition,
        exampleSentence: formData.exampleSentence || undefined,
        isPrimary: true,
      }],
    };

    try {
      if (selectedWord) {
        await updateWord(selectedWord.id, wordData);
        // Update morpheme associations
        await updateWordMorphemes(selectedWord.id, noMorphemes ? [] : selectedMorphemeIds);
      } else {
        const newWord = await createWord(wordData);
        // Set morpheme associations for new word
        if (selectedMorphemeIds.length > 0 && !noMorphemes) {
          await updateWordMorphemes(newWord.id, selectedMorphemeIds);
        }
      }
      setIsModalOpen(false);
      fetchWords(currentPage);
    } catch (error) {
      console.error('Failed to save word:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedWord) return;

    try {
      await deleteWord(selectedWord.id);
      setIsDeleteModalOpen(false);
      fetchWords(currentPage);
    } catch (error) {
      console.error('Failed to delete word:', error);
    }
  };

  const partOfSpeechOptions = [
    { value: 'noun', label: 'Noun' },
    { value: 'verb', label: 'Verb' },
    { value: 'adjective', label: 'Adjective' },
    { value: 'adverb', label: 'Adverb' },
    { value: 'preposition', label: 'Preposition' },
    { value: 'conjunction', label: 'Conjunction' },
    { value: 'interjection', label: 'Interjection' },
  ];

  const difficultyOptions = [
    { value: '1', label: '1 - Easy' },
    { value: '2', label: '2 - Medium' },
    { value: '3', label: '3 - Hard' },
    { value: '4', label: '4 - Very Hard' },
    { value: '5', label: '5 - Expert' },
  ];

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Words Management</h1>
          <p>Manage vocabulary words in the database</p>
        </div>
        <Button onClick={handleOpenCreate}>Add Word</Button>
      </header>

      <Card className="admin-toolbar">
        <div className="admin-search">
          <Input
            placeholder="Search words..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="secondary" onClick={handleSearch}>
            Search
          </Button>
        </div>
        <span className="admin-count">{totalWords} words total</span>
      </Card>

      <Card className="admin-table-card" padding="none">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Word</th>
              <th>Part of Speech</th>
              <th>Morphemes</th>
              <th>Difficulty</th>
              <th>Definition</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {words.map(word => {
              const primaryDef = word.definitions.find(d => d.isPrimary) || word.definitions[0];
              return (
                <tr key={word.id}>
                  <td className="admin-table__word">
                    <strong>{word.word}</strong>
                    {word.pronunciation && (
                      <span className="admin-table__pronunciation">/{word.pronunciation}/</span>
                    )}
                  </td>
                  <td>
                    <Badge variant="default">{word.partOfSpeech}</Badge>
                  </td>
                  <td>
                    {word.morphemes.length === 0 ? (
                      <span className="admin-table__no-morphemes">-</span>
                    ) : (
                      <div className="admin-table__morphemes">
                        {word.morphemes
                          .sort((a, b) => a.position - b.position)
                          .map(m => (
                            <MorphemeChip
                              key={m.id}
                              morpheme={m}
                              allMorphemes={morphemes}
                              size="sm"
                            />
                          ))}
                      </div>
                    )}
                  </td>
                  <td>{'*'.repeat(word.difficulty)}</td>
                  <td className="admin-table__definition">
                    {primaryDef?.definition.substring(0, 80)}
                    {primaryDef && primaryDef.definition.length > 80 ? '...' : ''}
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(word)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleOpenDelete(word)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {words.length === 0 && (
          <div className="admin-empty">
            No words found. Add your first word to get started.
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedWord ? 'Edit Word' : 'Add Word'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form__word-row">
            <Input
              label="Word"
              value={formData.word}
              onChange={e => setFormData({ ...formData, word: e.target.value })}
              required
            />
            {!selectedWord && aiConfigured && (
              <Button
                type="button"
                variant="secondary"
                onClick={handlePopulateWithAI}
                isLoading={isGenerating}
                disabled={!formData.word.trim()}
                className="admin-form__ai-btn"
              >
                Populate with AI
              </Button>
            )}
          </div>

          {populateError && (
            <div className="admin-form__error">{populateError}</div>
          )}

          {!selectedWord && !aiConfigured && (
            <div className="admin-form__ai-hint">
              Configure AI in <a href="/admin/ai-tools">AI Tools</a> to auto-populate fields
            </div>
          )}

          <div className="admin-form__row">
            <Select
              label="Part of Speech"
              value={formData.partOfSpeech}
              onChange={e => setFormData({ ...formData, partOfSpeech: e.target.value as PartOfSpeech })}
              options={partOfSpeechOptions}
            />
            <Select
              label="Difficulty"
              value={formData.difficulty.toString()}
              onChange={e => setFormData({ ...formData, difficulty: parseInt(e.target.value, 10) })}
              options={difficultyOptions}
            />
          </div>

          <Input
            label="Pronunciation"
            value={formData.pronunciation}
            onChange={e => setFormData({ ...formData, pronunciation: e.target.value })}
            placeholder="e.g., uh-BER-uhnt"
          />

          <Textarea
            label="Definition"
            value={formData.definition}
            onChange={e => setFormData({ ...formData, definition: e.target.value })}
            required
          />

          <Textarea
            label="Example Sentence"
            value={formData.exampleSentence}
            onChange={e => setFormData({ ...formData, exampleSentence: e.target.value })}
          />

          <Textarea
            label="Etymology"
            value={formData.etymology}
            onChange={e => setFormData({ ...formData, etymology: e.target.value })}
          />

          {/* Morpheme Management Section */}
          <div className="admin-form__morphemes">
            <div className="admin-form__morphemes-header">
              <label className="admin-form__label">Morphemes</label>
              <label className="admin-form__no-morphemes-toggle">
                <input
                  type="checkbox"
                  checked={noMorphemes}
                  onChange={e => {
                    setNoMorphemes(e.target.checked);
                    if (e.target.checked) setSelectedMorphemeIds([]);
                  }}
                />
                <span>No morphemes (simple word)</span>
              </label>
            </div>

            {!noMorphemes && (
              <>
                {/* Current morphemes */}
                {selectedMorphemes.length > 0 && (
                  <div className="admin-form__selected-morphemes">
                    {selectedMorphemes.map((m, index) => (
                      <div key={m.id} className="admin-form__morpheme-tag">
                        <MorphemeChip
                          morpheme={m}
                          allMorphemes={morphemes}
                          size="sm"
                          showMeaning
                        />
                        <button
                          type="button"
                          className="admin-form__morpheme-remove"
                          onClick={() => {
                            setSelectedMorphemeIds(ids => ids.filter((_, i) => i !== index));
                          }}
                          title="Remove morpheme"
                        >
                          ×
                        </button>
                        {index < selectedMorphemes.length - 1 && (
                          <button
                            type="button"
                            className="admin-form__morpheme-move"
                            onClick={() => {
                              setSelectedMorphemeIds(ids => {
                                const newIds = [...ids];
                                [newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]];
                                return newIds;
                              });
                            }}
                            title="Move right"
                          >
                            →
                          </button>
                        )}
                      </div>
                    ))}
                    {selectedMorphemes.length > 0 && (
                      <button
                        type="button"
                        className="admin-form__clear-morphemes"
                        onClick={() => setSelectedMorphemeIds([])}
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                )}

                {/* Add morpheme search */}
                <div className="admin-form__morpheme-picker">
                  <Input
                    placeholder="Search morphemes to add..."
                    value={morphemeSearch}
                    onChange={e => setMorphemeSearch(e.target.value)}
                  />
                  {morphemeSearch && (
                    <div className="admin-form__morpheme-list">
                      {filteredMorphemes.slice(0, 10).map(m => {
                        const isVariant = m.canonicalId != null;
                        const canonical = isVariant ? morphemes.find(cm => cm.id === m.canonicalId) : null;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            className={`admin-form__morpheme-option ${selectedMorphemeIds.includes(m.id) ? 'admin-form__morpheme-option--selected' : ''}`}
                            onClick={() => {
                              if (!selectedMorphemeIds.includes(m.id)) {
                                setSelectedMorphemeIds(ids => [...ids, m.id]);
                              }
                              setMorphemeSearch('');
                            }}
                            disabled={selectedMorphemeIds.includes(m.id)}
                          >
                            <MorphemeChip morpheme={m} allMorphemes={morphemes} size="sm" />
                            <span className="admin-form__morpheme-option-meaning">
                              {m.meaning}
                              {isVariant && canonical && (
                                <span className="admin-form__morpheme-option-variant"> (variant of {canonical.morpheme})</span>
                              )}
                            </span>
                            {selectedMorphemeIds.includes(m.id) && <span className="admin-form__morpheme-option-added">✓</span>}
                          </button>
                        );
                      })}
                      {filteredMorphemes.length === 0 && (
                        <div className="admin-form__morpheme-empty">No morphemes found</div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="admin-form__actions">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {selectedWord ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Word"
        message={`Are you sure you want to delete "${selectedWord?.word}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isLoading}
      />
    </div>
  );
}
