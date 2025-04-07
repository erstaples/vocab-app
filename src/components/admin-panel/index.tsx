import React, { useState, useCallback, ChangeEvent, useEffect } from 'react';
import wordService, { WordWithMorphemes } from '../../services/word-service';
import morphemeService, { MorphemeCreate } from '../../services/morpheme-service';
import { MorphemeType } from '../../models/Morpheme';
import { Morpheme } from '../../models/Morpheme';
import { Word } from '../../models/Word';

const AdminPanel: React.FC = () => {
  // API interaction states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('words');
  const [words, setWords] = useState<Word[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [view, setView] = useState<'list' | 'add'>('list');
  const [wordForm, setWordForm] = useState({
    text: '',
    partOfSpeech: 'noun',
    definition: '',
    pronunciation: '',
    origin: 'latin',
    period: 'ancient',
    etymologyNotes: ''
  });
  
  const [morphemes, setMorphemes] = useState<Array<{
    id: number;
    text: string;
    type: string;
    meaning: string;
  }>>([
    { id: 1, text: 'in', type: 'prefix', meaning: 'not, without' },
    { id: 2, text: 'sipid', type: 'root', meaning: 'taste (Latin)' }
  ]);
  
  const [newMorpheme, setNewMorpheme] = useState({
    text: '',
    type: 'prefix' as MorphemeType,
    meaning: '',
    examples: ''
  });

  // Load words on component mount
  useEffect(() => {
    const loadWords = async () => {
      setIsLoading(true);
      try {
        const fetchedWords = await wordService.getAllWords();
        setWords(fetchedWords);
      } catch (err) {
        setError('Failed to load words');
        console.error('Error loading words:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadWords();
  }, []);

  // Handle word search
  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await wordService.searchWords(searchQuery);
      setWords(results);
    } catch (err) {
      setError('Failed to search words');
      console.error('Error searching words:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  // Handle word deletion
  const handleDeleteWord = async (wordId: string) => {
    if (!window.confirm('Are you sure you want to delete this word?')) return;
    
    setIsLoading(true);
    try {
      await wordService.deleteWord(wordId);
      setWords(words.filter(w => w.id !== wordId));
      setSuccessMessage('Word deleted successfully');
    } catch (err) {
      setError('Failed to delete word');
      console.error('Error deleting word:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit mode toggle
  const handleEditWord = (word: Word) => {
    setSelectedWord(word);
    setIsEditMode(true);
    setView('add');
    setWordForm({
      text: word.value,
      partOfSpeech: word.partOfSpeech,
      definition: word.definition,
      pronunciation: word.pronunciation,
      origin: word.etymology?.origin || 'latin',
      period: word.etymology?.period || 'ancient',
      etymologyNotes: word.etymology?.development?.[0] || ''
    });
  };

  // Handle word update
  const handleUpdateWord = async () => {
    if (!selectedWord) return;
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const wordData: Partial<WordWithMorphemes> = {
        value: wordForm.text,
        partOfSpeech: wordForm.partOfSpeech,
        definition: wordForm.definition,
        pronunciation: wordForm.pronunciation,
        etymology: {
          origin: wordForm.origin,
          period: wordForm.period,
          development: wordForm.etymologyNotes ? [wordForm.etymologyNotes] : []
        },
        morphemes: morphemes.map((m, idx) => ({
          id: m.id,
          position: idx
        }))
      };

      const updatedWord = await wordService.updateWord(selectedWord.id, wordData);
      setWords(words.map(w => w.id === updatedWord.id ? updatedWord : w));
      setSuccessMessage('Word updated successfully');
      setIsEditMode(false);
      setSelectedWord(null);
      setView('list');
      
      // Reset form
      setWordForm({
        text: '',
        partOfSpeech: 'noun',
        definition: '',
        pronunciation: '',
        origin: 'latin',
        period: 'ancient',
        etymologyNotes: ''
      });
      setMorphemes([]);
    } catch (err) {
      setError('Failed to update word');
      console.error('Error updating word:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setWordForm({
      ...wordForm,
      [id.replace('word-', '')]: value
    });
  };
  
  const handleMorphemeChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewMorpheme({
      ...newMorpheme,
      [id.replace('morpheme-', '')]: value
    });
  };
  
  const handleRemoveMorpheme = (id: number) => {
    setMorphemes(morphemes.filter(m => m.id !== id));
  };
  
  const handleSaveWord = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Prepare word data with morphemes
      const wordData: WordWithMorphemes = {
        value: wordForm.text,
        partOfSpeech: wordForm.partOfSpeech,
        definition: wordForm.definition,
        pronunciation: wordForm.pronunciation,
        etymology: {
          origin: wordForm.origin,
          period: wordForm.period,
          development: wordForm.etymologyNotes ? [wordForm.etymologyNotes] : []
        },
        morphemes: morphemes.map((m, idx) => ({
          id: m.id,
          position: idx
        })),
        synonyms: [],
        difficulty: 1,
        example: ''
      };

      // Create the word with associated morphemes
      await wordService.createWord(wordData);
      setSuccessMessage('Word saved successfully!');
      setView('list');

      // Reset form
      setWordForm({
        text: '',
        partOfSpeech: 'noun',
        definition: '',
        pronunciation: '',
        origin: 'latin',
        period: 'ancient',
        etymologyNotes: ''
      });
      setMorphemes([]);
    } catch (err) {
      setError('Failed to save word. Please try again.');
      console.error('Error saving word:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMorpheme = async () => {
    if (!newMorpheme.text || !newMorpheme.meaning) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create new morpheme
      const morphemeData: MorphemeCreate = {
        value: newMorpheme.text,
        type: newMorpheme.type,
        meaning: newMorpheme.meaning,
        languageOrigin: 'latin', // Default value
        examples: newMorpheme.examples ? [newMorpheme.examples] : []
      };

      const createdMorpheme = await morphemeService.createMorpheme(morphemeData);
      
      // Add to local state
      setMorphemes([
        ...morphemes,
        {
          id: createdMorpheme.id,
          text: createdMorpheme.value,
          type: createdMorpheme.type,
          meaning: createdMorpheme.meaning
        }
      ]);
      
      // Reset form
      setNewMorpheme({
        text: '',
        type: 'prefix',
        meaning: '',
        examples: ''
      });
    } catch (err) {
      setError('Failed to create morpheme. Please try again.');
      console.error('Error creating morpheme:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add feedback message display
  const renderFeedback = () => {
    if (error) {
      return <div className="error-message">{error}</div>;
    }
    if (successMessage) {
      return <div className="success-message">{successMessage}</div>;
    }
    return null;
  };

  const renderWordList = () => (
    <div className="admin-form-card">
      <h3>Word List</h3>
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search words..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="search-button"
            onClick={handleSearch}
            disabled={isLoading}
          >
            Search
          </button>
        </div>
      </div>

      <div className="word-list">
        {words.map(word => (
          <div key={word.id} className="word-item">
            <div className="word-info">
              <h4>{word.value}</h4>
              <p className="word-details">
                <span className="part-of-speech">{word.partOfSpeech}</span>
                <span className="definition">{word.definition}</span>
              </p>
            </div>
            <div className="word-actions">
              <button
                className="edit-button"
                onClick={() => handleEditWord(word)}
                disabled={isLoading}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteWord(word.id)}
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {words.length === 0 && (
          <div className="no-words">
            No words found. Add your first word below.
          </div>
        )}
      </div>
    </div>
  );

  const renderWordForm = () => (
    <div className="admin-form-card">
      <h3>{isEditMode ? 'Edit Word' : 'Add New Word'}</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="word-text">Word</label>
          <input 
            type="text" 
            id="word-text" 
            className="form-control" 
            placeholder="Enter word"
            value={wordForm.text}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="word-partOfSpeech">Part of Speech</label>
          <select 
            id="word-partOfSpeech" 
            className="form-control"
            value={wordForm.partOfSpeech}
            onChange={handleInputChange}
          >
            <option value="noun">Noun</option>
            <option value="verb">Verb</option>
            <option value="adjective">Adjective</option>
            <option value="adverb">Adverb</option>
          </select>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="word-definition">Definition</label>
        <textarea 
          id="word-definition" 
          className="form-control" 
          placeholder="Enter definition"
          rows={3}
          value={wordForm.definition}
          onChange={handleInputChange}
        ></textarea>
      </div>
      
      <div className="form-group">
        <label htmlFor="word-pronunciation">Pronunciation</label>
        <input 
          type="text" 
          id="word-pronunciation" 
          className="form-control" 
          placeholder="e.g., in-SIP-id"
          value={wordForm.pronunciation}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="form-section">
        <h4>Etymology</h4>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="word-origin">Origin Language</label>
            <select 
              id="word-origin" 
              className="form-control"
              value={wordForm.origin}
              onChange={handleInputChange}
            >
              <option value="latin">Latin</option>
              <option value="greek">Greek</option>
              <option value="french">French</option>
              <option value="germanic">Germanic</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="word-period">Time Period</label>
            <select 
              id="word-period" 
              className="form-control"
              value={wordForm.period}
              onChange={handleInputChange}
            >
              <option value="ancient">Ancient</option>
              <option value="medieval">Medieval</option>
              <option value="early-modern">Early Modern</option>
              <option value="modern">Modern</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="word-etymologyNotes">Etymology Notes</label>
          <textarea 
            id="word-etymologyNotes" 
            className="form-control" 
            placeholder="Enter etymology details"
            rows={2}
            value={wordForm.etymologyNotes}
            onChange={handleInputChange}
          ></textarea>
        </div>
      </div>
      
      <div className="form-section">
        <h4>Morphemes</h4>
        
        <div className="morpheme-list">
          {morphemes.map(morpheme => (
            <div className="morpheme-item" key={morpheme.id}>
              <span className={`morpheme-${morpheme.type}`}>
                {morpheme.text}
              </span>
              <span className="morpheme-info">
                {morpheme.type}: "{morpheme.meaning}"
              </span>
              <button 
                className="morpheme-remove"
                onClick={() => handleRemoveMorpheme(morpheme.id)}
              >
                ×
              </button>
            </div>
          ))}
          
          {morphemes.length === 0 && (
            <div className="morpheme-empty">
              No morphemes added yet. Add the first one below.
            </div>
          )}
        </div>
        
        <div className="morpheme-add-section">
          <h5>Add Morpheme</h5>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="morpheme-text">Morpheme</label>
              <input 
                type="text" 
                id="morpheme-text" 
                className="form-control"
                placeholder="e.g., bio"
                value={newMorpheme.text}
                onChange={handleMorphemeChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="morpheme-type">Type</label>
              <select 
                id="morpheme-type" 
                className="form-control"
                value={newMorpheme.type}
                onChange={handleMorphemeChange}
              >
                <option value="prefix">Prefix</option>
                <option value="root">Root</option>
                <option value="suffix">Suffix</option>
                <option value="infix">Infix</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="morpheme-meaning">Meaning</label>
              <input 
                type="text" 
                id="morpheme-meaning" 
                className="form-control"
                placeholder="e.g., life"
                value={newMorpheme.meaning}
                onChange={handleMorphemeChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="morpheme-examples">Example Words</label>
            <input 
              type="text" 
              id="morpheme-examples" 
              className="form-control"
              placeholder="e.g., biology, biosphere"
              value={newMorpheme.examples}
              onChange={handleMorphemeChange}
            />
          </div>
          
          <button 
            className="secondary-button"
            onClick={handleAddMorpheme}
          >
            Add Morpheme
          </button>
        </div>
      </div>
      
      <div className="form-actions">
        <button
          className="primary-button"
          onClick={isEditMode ? handleUpdateWord : handleSaveWord}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : isEditMode ? 'Update Word' : 'Save Word'}
        </button>
        <button 
          className="text-button"
          onClick={() => {
            setView('list');
            setIsEditMode(false);
            setSelectedWord(null);
            setWordForm({
              text: '',
              partOfSpeech: 'noun',
              definition: '',
              pronunciation: '',
              origin: 'latin',
              period: 'ancient',
              etymologyNotes: ''
            });
            setMorphemes([]);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Vocabulary Admin</h1>
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'words' ? 'active' : ''}`}
            onClick={() => setActiveTab('words')}
          >
            Words
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'morphemes' ? 'active' : ''}`}
            onClick={() => setActiveTab('morphemes')}
          >
            Morphemes
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'etymologies' ? 'active' : ''}`}
            onClick={() => setActiveTab('etymologies')}
          >
            Etymologies
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'relationships' ? 'active' : ''}`}
            onClick={() => setActiveTab('relationships')}
          >
            Relationships
          </button>
        </nav>
      </header>
      
      <div className="admin-content">
        {activeTab === 'words' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Word Management</h2>
              <div className="header-actions">
                {view === 'list' ? (
                  <button 
                    className="primary-button"
                    onClick={() => setView('add')}
                  >
                    Add New Word
                  </button>
                ) : (
                  <button 
                    className="secondary-button"
                    onClick={() => {
                      setView('list');
                      setIsEditMode(false);
                      setSelectedWord(null);
                      setWordForm({
                        text: '',
                        partOfSpeech: 'noun',
                        definition: '',
                        pronunciation: '',
                        origin: 'latin',
                        period: 'ancient',
                        etymologyNotes: ''
                      });
                      setMorphemes([]);
                    }}
                  >
                    Back to List
                  </button>
                )}
              </div>
            </div>
            {renderFeedback()}
            {view === 'list' ? renderWordList() : renderWordForm()}
          </div>
        )}
        
        {activeTab === 'morphemes' && (
          <div className="admin-section">
            <h2>Morpheme Management</h2>
            <p>Morpheme management interface will be implemented here</p>
          </div>
        )}
        
        {activeTab === 'etymologies' && (
          <div className="admin-section">
            <h2>Etymology Management</h2>
            <p>Etymology management interface will be implemented here</p>
          </div>
        )}
        
        {activeTab === 'relationships' && (
          <div className="admin-section">
            <h2>Relationship Management</h2>
            <p>Word relationship management interface will be implemented here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;