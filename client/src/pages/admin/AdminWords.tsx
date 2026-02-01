import React, { useEffect, useState } from 'react';
import { useWordStore } from '../../stores/wordStore';
import { useAdminStore } from '../../stores/adminStore';
import { Card, Button, Input, Select, Modal, ConfirmModal, Badge, Textarea } from '../../components/common';
import type { WordWithDetails, PartOfSpeech } from '@vocab-builder/shared';
import './Admin.css';

export default function AdminWords() {
  const { words, fetchWords, createWord, updateWord, deleteWord, isLoading, totalWords, currentPage } = useWordStore();
  const { populateWord, isGenerating, aiConfigured, checkAIConfig, aiError, clearError } = useAdminStore();
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

  useEffect(() => {
    fetchWords(1, { search: search || undefined });
    checkAIConfig();
  }, [fetchWords, checkAIConfig]);

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
      } else {
        await createWord(wordData);
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
                  <td className="admin-table__morphemes">
                    {word.morphemes.length === 0 ? (
                      <span className="admin-table__no-morphemes">-</span>
                    ) : (
                      word.morphemes
                        .sort((a, b) => a.position - b.position)
                        .map(m => (
                          <Badge
                            key={m.id}
                            variant={m.type === 'prefix' ? 'primary' : m.type === 'root' ? 'success' : 'secondary'}
                            size="sm"
                          >
                            {m.morpheme}
                          </Badge>
                        ))
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
