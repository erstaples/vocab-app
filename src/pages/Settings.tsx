// src/pages/Settings.tsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { LearningMode } from '../models';

const Settings: React.FC = () => {
  const { user, updatePreferences } = useContext(AppContext);
  const navigate = useNavigate();

  const [dailyGoal, setDailyGoal] = useState(user?.preferences.dailyGoal || 10);
  const [newWordsPerDay, setNewWordsPerDay] = useState(user?.preferences.newWordsPerDay || 5);
  const [selectedModes, setSelectedModes] = useState<LearningMode[]>(
    user?.preferences.learningModes || [LearningMode.FLASHCARD]
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!user) {
    return <div className="loading">Loading settings...</div>;
  }

  // Handle saving preferences
  const handleSave = () => {
    updatePreferences({
      dailyGoal,
      newWordsPerDay,
      learningModes: selectedModes
    });

    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  // Handle returning to dashboard
  const handleBack = () => {
    navigate('/dashboard');
  };

  // Toggle a learning mode on/off
  const toggleLearningMode = (mode: LearningMode) => {
    if (selectedModes.includes(mode)) {
      // Remove mode if already selected (but ensure at least one mode remains selected)
      if (selectedModes.length > 1) {
        setSelectedModes(selectedModes.filter(m => m !== mode));
      }
    } else {
      // Add mode if not selected
      setSelectedModes([...selectedModes, mode]);
    }
  };

  // Check if a mode is selected
  const isModeSelected = (mode: LearningMode) => selectedModes.includes(mode);

  return (
    <div className="settings-page">
      <header className="settings-header">
        <button className="back-button" onClick={handleBack}>Back</button>
        <h1>Settings</h1>
      </header>

      <div className="settings-content">
        <section className="setting-section">
          <h2>Daily Goals</h2>

          <div className="setting-item">
            <label htmlFor="daily-goal">Words to review daily:</label>
            <input
              id="daily-goal"
              type="range"
              min="5"
              max="50"
              step="5"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(parseInt(e.target.value))}
            />
            <span className="setting-value">{dailyGoal}</span>
          </div>

          <div className="setting-item">
            <label htmlFor="new-words">New words per day:</label>
            <input
              id="new-words"
              type="range"
              min="1"
              max="20"
              value={newWordsPerDay}
              onChange={(e) => setNewWordsPerDay(parseInt(e.target.value))}
            />
            <span className="setting-value">{newWordsPerDay}</span>
          </div>
        </section>

        <section className="setting-section">
          <h2>Learning Modes</h2>
          <p className="setting-description">
            Select which learning modes you want to use in your review sessions.
          </p>

          <div className="learning-modes-grid">
            <div
              className={`mode-item ${isModeSelected(LearningMode.FLASHCARD) ? 'selected' : ''}`}
              onClick={() => toggleLearningMode(LearningMode.FLASHCARD)}
            >
              <div className="mode-icon">🃏</div>
              <h3>Flashcards</h3>
              <p>Traditional front/back card learning</p>
            </div>

            <div
              className={`mode-item ${isModeSelected(LearningMode.CONTEXT_GUESS) ? 'selected' : ''}`}
              onClick={() => toggleLearningMode(LearningMode.CONTEXT_GUESS)}
            >
              <div className="mode-icon">🔍</div>
              <h3>Context Guess</h3>
              <p>Fill in the blank in a sentence</p>
            </div>

            <div
              className={`mode-item ${isModeSelected(LearningMode.WORD_CONNECTIONS) ? 'selected' : ''}`}
              onClick={() => toggleLearningMode(LearningMode.WORD_CONNECTIONS)}
            >
              <div className="mode-icon">🔗</div>
              <h3>Word Connections</h3>
              <p>Identify related words and synonyms</p>
            </div>

            <div
              className={`mode-item ${isModeSelected(LearningMode.SENTENCE_FORMATION) ? 'selected' : ''}`}
              onClick={() => toggleLearningMode(LearningMode.SENTENCE_FORMATION)}
            >
              <div className="mode-icon">✏️</div>
              <h3>Sentence Formation</h3>
              <p>Create your own sentences using the word</p>
            </div>

            <div
              className={`mode-item ${isModeSelected(LearningMode.SYNONYM_ANTONYM) ? 'selected' : ''}`}
              onClick={() => toggleLearningMode(LearningMode.SYNONYM_ANTONYM)}
            >
              <div className="mode-icon">⚖️</div>
              <h3>Synonyms & Antonyms</h3>
              <p>Match words with their synonyms or antonyms</p>
            </div>

            <div
              className={`mode-item ${isModeSelected(LearningMode.DEFINITION_MATCH) ? 'selected' : ''}`}
              onClick={() => toggleLearningMode(LearningMode.DEFINITION_MATCH)}
            >
              <div className="mode-icon">📖</div>
              <h3>Definition Match</h3>
              <p>Match words with their definitions</p>
            </div>
          </div>
        </section>

        <section className="setting-section">
          <h2>Account</h2>
          <div className="account-info">
            <p>Username: {user.username}</p>
            <button className="secondary-button">Change Username</button>
          </div>

          <div className="danger-zone">
            <h3>Danger Zone</h3>
            <button className="danger-button">Reset Progress</button>
            <p className="warning-text">
              This will delete all your progress and reset your account.
              This action cannot be undone.
            </p>
          </div>
        </section>

        <div className="settings-actions">
          <button className="primary-button" onClick={handleSave}>
            Save Settings
          </button>
        </div>

        {showConfirmation && (
          <div className="confirmation-toast">
            Settings saved successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;