import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWordStore } from '../../stores/wordStore';
import { useAdminStore } from '../../stores/adminStore';
import { MorphemeBuilder } from '../../components/admin';
import { Card, Button, Input, Select, Modal, Badge } from '../../components/common';
import type { WordWithDetails, Morpheme, MorphemeType } from '@vocab-builder/shared';
import './Admin.css';
import './WordMorphemeEditor.css';

interface MorphemeWithPosition {
  id: number;
  morpheme: string;
  type: MorphemeType;
  meaning: string;
  position: number;
}

export default function WordMorphemeEditor() {
  const [searchParams] = useSearchParams();
  const { words, morphemes, fetchWords, fetchMorphemes, isLoading } = useWordStore();
  const { updateWordMorphemes, getWordMorphemes } = useAdminStore();

  const [search, setSearch] = useState('');
  const [selectedWord, setSelectedWord] = useState<WordWithDetails | null>(null);
  const [selectedMorphemes, setSelectedMorphemes] = useState<MorphemeWithPosition[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchWords(1);
    fetchMorphemes();
  }, [fetchWords, fetchMorphemes]);

  // Handle wordId from URL params
  useEffect(() => {
    const wordIdParam = searchParams.get('wordId');
    if (wordIdParam && words.length > 0) {
      const wordId = parseInt(wordIdParam);
      const word = words.find(w => w.id === wordId);
      if (word) {
        handleSelectWord(word);
      }
    }
  }, [searchParams, words]);

  const handleSearch = () => {
    fetchWords(1, { search: search || undefined });
  };

  const handleSelectWord = async (word: WordWithDetails) => {
    setSelectedWord(word);
    setSuccessMessage(null);

    // Load existing morpheme associations
    try {
      const existingMorphemes = await getWordMorphemes(word.id);
      setSelectedMorphemes(existingMorphemes.map(m => ({
        id: m.id,
        morpheme: m.morpheme,
        type: m.type as MorphemeType,
        meaning: m.meaning,
        position: m.position,
      })));
    } catch (error) {
      // No existing associations
      setSelectedMorphemes([]);
    }

    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedWord) return;

    setIsSaving(true);
    try {
      const morphemeIds = selectedMorphemes
        .sort((a, b) => a.position - b.position)
        .map(m => m.id);

      await updateWordMorphemes(selectedWord.id, morphemeIds);

      setSuccessMessage(`Updated morpheme associations for "${selectedWord.word}"`);
      setIsModalOpen(false);

      // Refresh the words list to update the UI
      fetchWords(1, { search: search || undefined });
    } catch (error) {
      console.error('Failed to save morpheme associations:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMorphemesChange = (newMorphemes: MorphemeWithPosition[]) => {
    setSelectedMorphemes(newMorphemes);
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Word-Morpheme Editor</h1>
          <p>Associate words with their morpheme components</p>
        </div>
      </header>

      {successMessage && (
        <div className="admin-success-message">
          {successMessage}
        </div>
      )}

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
        <span className="admin-count">{words.length} words</span>
      </Card>

      <Card className="admin-table-card" padding="none">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Word</th>
              <th>Part of Speech</th>
              <th>Morphemes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {words.map(word => (
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
                <td className="word-morpheme-editor__morphemes">
                  {word.morphemes.length === 0 ? (
                    <span className="word-morpheme-editor__no-morphemes">None</span>
                  ) : (
                    word.morphemes
                      .sort((a, b) => a.position - b.position)
                      .map((m, index) => (
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
                <td>
                  <Button size="sm" variant="ghost" onClick={() => handleSelectWord(word)}>
                    {word.morphemes.length === 0 ? 'Add' : 'Edit'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {words.length === 0 && (
          <div className="admin-empty">
            {isLoading ? 'Loading words...' : 'No words found. Try a different search.'}
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Edit Morphemes: ${selectedWord?.word || ''}`}
        size="lg"
      >
        {selectedWord && (
          <div className="word-morpheme-editor__modal">
            <MorphemeBuilder
              word={selectedWord.word}
              selectedMorphemes={selectedMorphemes}
              availableMorphemes={morphemes}
              onChange={handleMorphemesChange}
              isLoading={isLoading}
            />

            <div className="word-morpheme-editor__modal-actions">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} isLoading={isSaving}>
                Save Associations
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
