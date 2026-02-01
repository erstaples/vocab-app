import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Card, Button, Input, Select } from '../components/common';
import type { LearningMode } from '@vocab-builder/shared';
import './Settings.css';

export default function Settings() {
  const { preferences, updatePreferences } = useAuthStore();
  const [dailyGoal, setDailyGoal] = useState(10);
  const [learningMode, setLearningMode] = useState<LearningMode>('flashcard');
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (preferences) {
      setDailyGoal(preferences.dailyGoal);
      setLearningMode(preferences.preferredLearningMode);
      setNotifications(preferences.notificationsEnabled);
      setSound(preferences.soundEnabled);
    }
  }, [preferences]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      await updatePreferences({
        dailyGoal,
        preferredLearningMode: learningMode,
        notificationsEnabled: notifications,
        soundEnabled: sound,
      });
      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessage('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const learningModeOptions = [
    { value: 'flashcard', label: 'Flashcards' },
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'typing', label: 'Typing' },
    { value: 'word_construction', label: 'Word Construction' },
  ];

  const dailyGoalOptions = [
    { value: '5', label: '5 words' },
    { value: '10', label: '10 words' },
    { value: '15', label: '15 words' },
    { value: '20', label: '20 words' },
    { value: '30', label: '30 words' },
  ];

  return (
    <div className="settings">
      <header className="settings__header">
        <h1>Settings</h1>
        <p>Customize your learning experience</p>
      </header>

      <div className="settings__content">
        <Card className="settings__card">
          <h2>Learning Preferences</h2>

          <div className="settings__field">
            <Select
              label="Daily Goal"
              value={dailyGoal.toString()}
              onChange={e => setDailyGoal(parseInt(e.target.value, 10))}
              options={dailyGoalOptions}
            />
            <p className="settings__field-help">
              Number of words you want to review each day
            </p>
          </div>

          <div className="settings__field">
            <Select
              label="Preferred Learning Mode"
              value={learningMode}
              onChange={e => setLearningMode(e.target.value as LearningMode)}
              options={learningModeOptions}
            />
            <p className="settings__field-help">
              Your default study method
            </p>
          </div>
        </Card>

        <Card className="settings__card">
          <h2>Notifications</h2>

          <div className="settings__toggle">
            <div className="settings__toggle-info">
              <span className="settings__toggle-label">Push Notifications</span>
              <span className="settings__toggle-desc">
                Get reminders to study daily
              </span>
            </div>
            <button
              className={`settings__toggle-btn ${notifications ? 'settings__toggle-btn--active' : ''}`}
              onClick={() => setNotifications(!notifications)}
            >
              <span className="settings__toggle-knob" />
            </button>
          </div>

          <div className="settings__toggle">
            <div className="settings__toggle-info">
              <span className="settings__toggle-label">Sound Effects</span>
              <span className="settings__toggle-desc">
                Play sounds during reviews
              </span>
            </div>
            <button
              className={`settings__toggle-btn ${sound ? 'settings__toggle-btn--active' : ''}`}
              onClick={() => setSound(!sound)}
            >
              <span className="settings__toggle-knob" />
            </button>
          </div>
        </Card>

        <div className="settings__actions">
          {message && (
            <p className={`settings__message ${message.includes('Failed') ? 'settings__message--error' : ''}`}>
              {message}
            </p>
          )}
          <Button onClick={handleSave} isLoading={isSaving}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
