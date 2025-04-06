import React, { useState, useEffect } from 'react';
import { Word, LearningMode } from '../../models';

// Interfaces
interface LearningModeProps {
  word: Word;
  onComplete: (score: 0 | 1 | 2 | 3 | 4 | 5, timeSpent: number) => void;
}

// ===== Flashcard Mode Component =====
export const FlashcardMode: React.FC<LearningModeProps> = ({ word, onComplete }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    // Reset the timer when a new word is presented
    setStartTime(Date.now());
    setShowAnswer(false);
  }, [word]);

  const handleReveal = () => {
    setShowAnswer(true);
  };

  const handleScore = (score: 0 | 1 | 2 | 3 | 4 | 5) => {
    const timeSpent = Date.now() - startTime;
    onComplete(score, timeSpent);
  };

  // Instead of using CSS flipping, we'll conditionally render the front or back
  return (
    <div className="flashcard-container">
      <div className="flashcard">
        {!showAnswer ? (
          // Front of card
          <div className="flashcard-front">
            <h2>{word.value}</h2>
            <p className="part-of-speech">{word.partOfSpeech}</p>
            <p className="pronunciation">{word.pronunciation}</p>

            <button onClick={handleReveal} className="reveal-button">
              Reveal Answer
            </button>
          </div>
        ) : (
          // Back of card (answer)
          <div className="flashcard-back" style={{ transform: 'none' }}>
            <h3>Definition:</h3>
            <p>{word.definition}</p>

            <h3>Example:</h3>
            <p>{word.example}</p>

            <h3>Synonyms:</h3>
            <p>{word.synonyms.join(', ')}</p>

            {word.etymology && (
              <>
                <h3>Etymology:</h3>
                <p><strong>Origin:</strong> {word.etymology.origin}</p>
                <p><strong>Period:</strong> {word.etymology.period}</p>
                {word.etymology.development.length > 0 && (
                  <>
                    <p><strong>Development:</strong></p>
                    <ul>
                      {word.etymology.development.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}

            <div className="score-buttons">
              <button onClick={() => handleScore(0)}>Again (0)</button>
              <button onClick={() => handleScore(1)}>Hard (1)</button>
              <button onClick={() => handleScore(2)}>Difficult (2)</button>
              <button onClick={() => handleScore(3)}>Good (3)</button>
              <button onClick={() => handleScore(4)}>Easy (4)</button>
              <button onClick={() => handleScore(5)}>Perfect (5)</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== Context Guess Mode Component =====
export const ContextGuessMode: React.FC<LearningModeProps> = ({ word, onComplete }) => {
  const [userGuess, setUserGuess] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  // Create a context sentence with the word blanked out
  const createBlankSentence = () => {
    const regex = new RegExp(`\\b${word.value}\\b`, 'i');
    return word.example.replace(regex, '________');
  };

  useEffect(() => {
    setStartTime(Date.now());
    setUserGuess('');
    setHasSubmitted(false);
  }, [word]);

  const handleSubmit = () => {
    setHasSubmitted(true);
  };

  const handleRate = (score: 0 | 1 | 2 | 3 | 4 | 5) => {
    const timeSpent = Date.now() - startTime;
    onComplete(score, timeSpent);
  };

  return (
    <div className="context-guess-container">
      <h2>Fill in the blank:</h2>
      <p className="context-sentence">{createBlankSentence()}</p>

      {!hasSubmitted ? (
        <div className="guess-input-container">
          <input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            className="guess-input"
            placeholder="Type your guess..."
          />
          <button onClick={handleSubmit} className="submit-button">
            Submit
          </button>
        </div>
      ) : (
        <div className="result-container">
          <div className="correct-answer">
            <h3>The correct word was:</h3>
            <p className="word">{word.value}</p>
            <p className="definition">{word.definition}</p>
          </div>

          <h3>Your answer: {userGuess}</h3>
          <p>How well did you know this?</p>

          <div className="score-buttons">
            <button onClick={() => handleRate(0)}>Not at all (0)</button>
            <button onClick={() => handleRate(1)}>Barely (1)</button>
            <button onClick={() => handleRate(2)}>Somewhat (2)</button>
            <button onClick={() => handleRate(3)}>Well (3)</button>
            <button onClick={() => handleRate(4)}>Very well (4)</button>
            <button onClick={() => handleRate(5)}>Perfectly (5)</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== Word Connections Mode Component =====
export const WordConnectionsMode: React.FC<LearningModeProps> = ({ word, onComplete }) => {
  const [connections, setConnections] = useState<{ word: string; isCorrect: boolean; selected: boolean }[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    // Reset state when word changes
    setStartTime(Date.now());
    setShowResults(false);

    // Create a mix of correct and incorrect connections
    const correctConnections = [...word.synonyms].slice(0, 3).map(syn => ({
      word: syn,
      isCorrect: true,
      selected: false
    }));

    // Add some incorrect options (could come from a larger dictionary in a real app)
    const incorrectOptions = [
      'ambivalent', 'cacophony', 'diatribe', 'ephemeral', 'fastidious',
      'garrulous', 'harangue', 'intrepid', 'juxtapose', 'loquacious'
    ].filter(w =>
      w !== word.value &&
      !word.synonyms.includes(w)
    ).slice(0, 4).map(w => ({
      word: w,
      isCorrect: false,
      selected: false
    }));

    // Combine and shuffle
    setConnections([...correctConnections, ...incorrectOptions].sort(() => Math.random() - 0.5));
  }, [word]);

  const toggleSelection = (index: number) => {
    const newConnections = [...connections];
    newConnections[index].selected = !newConnections[index].selected;
    setConnections(newConnections);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = (): 0 | 1 | 2 | 3 | 4 | 5 => {
    const totalCorrect = connections.filter(c => c.isCorrect).length;
    const totalSelected = connections.filter(c => c.selected).length;

    if (totalSelected === 0) return 0;

    // Count correct selections
    const correctSelections = connections.filter(c => c.selected && c.isCorrect).length;
    // Count incorrect selections
    const incorrectSelections = connections.filter(c => c.selected && !c.isCorrect).length;

    // Calculate score based on selections
    const rawScore = (correctSelections / totalCorrect) - (incorrectSelections / (connections.length - totalCorrect));

    // Normalize to 0-5 scale
    const normalizedScore = Math.round(rawScore * 5);
    return Math.max(0, Math.min(5, normalizedScore)) as 0 | 1 | 2 | 3 | 4 | 5;
  };

  const handleComplete = () => {
    const timeSpent = Date.now() - startTime;
    onComplete(calculateScore(), timeSpent);
  };

  return (
    <div className="word-connections-container">
      <h2>Select words related to: {word.value}</h2>
      <p className="definition">{word.definition}</p>

      <div className="connections-grid">
        {connections.map((connection, index) => (
          <div
            key={index}
            className={`connection-item ${connection.selected ? 'selected' : ''} ${showResults ? (connection.isCorrect ? 'correct' : 'incorrect') : ''
              }`}
            onClick={() => !showResults && toggleSelection(index)}
          >
            {connection.word}
          </div>
        ))}
      </div>

      {!showResults ? (
        <button onClick={handleSubmit} className="submit-button">
          Check Answers
        </button>
      ) : (
        <div className="results-container">
          <h3>Results</h3>
          <p>
            You selected {connections.filter(c => c.selected && c.isCorrect).length} correct connections
            and {connections.filter(c => c.selected && !c.isCorrect).length} incorrect ones.
          </p>
          <button onClick={handleComplete} className="continue-button">
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

// ===== Sentence Formation Mode Component =====
export const SentenceFormationMode: React.FC<LearningModeProps> = ({ word, onComplete }) => {
  const [sentence, setSentence] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    setStartTime(Date.now());
    setSentence('');
    setSubmitted(false);
  }, [word]);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleSelfRate = (score: 0 | 1 | 2 | 3 | 4 | 5) => {
    const timeSpent = Date.now() - startTime;
    onComplete(score, timeSpent);
  };

  // In a real app, this could use NLP to evaluate the sentence quality
  const isWordInSentence = () => {
    return sentence.toLowerCase().includes(word.value.toLowerCase());
  };

  return (
    <div className="sentence-formation-container">
      <h2>Create a sentence using the word:</h2>
      <div className="word-container">
        <h3>{word.value}</h3>
        <p className="part-of-speech">{word.partOfSpeech}</p>
        <p className="definition">{word.definition}</p>
      </div>

      <div className="sentence-input-container">
        <textarea
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          disabled={submitted}
          placeholder="Write your sentence here..."
          rows={4}
          className="sentence-textarea"
        />
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={sentence.trim() === ''}
          className="submit-button"
        >
          Submit
        </button>
      ) : (
        <div className="self-assessment">
          <h3>Your sentence:</h3>
          <p className="user-sentence">{sentence}</p>

          {!isWordInSentence() && (
            <p className="warning">Warning: Your sentence doesn't appear to contain the word "{word.value}".</p>
          )}

          <h3>Example correct usage:</h3>
          <p className="example-sentence">{word.example}</p>

          <h3>Rate how well you used the word:</h3>
          <div className="score-buttons">
            <button onClick={() => handleSelfRate(0)}>Incorrect (0)</button>
            <button onClick={() => handleSelfRate(1)}>Poor (1)</button>
            <button onClick={() => handleSelfRate(2)}>Fair (2)</button>
            <button onClick={() => handleSelfRate(3)}>Good (3)</button>
            <button onClick={() => handleSelfRate(4)}>Very Good (4)</button>
            <button onClick={() => handleSelfRate(5)}>Excellent (5)</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Import the new WordConstructionLab component
import { WordConstructionLab } from './WordConstructionLab';

// Factory function to get the appropriate learning mode component
export const getLearningModeComponent = (
  mode: LearningMode,
  word: Word,
  onComplete: (score: 0 | 1 | 2 | 3 | 4 | 5, timeSpent: number) => void
) => {
  switch (mode) {
    case LearningMode.FLASHCARD:
      return <FlashcardMode word={word} onComplete={onComplete} />;
    case LearningMode.CONTEXT_GUESS:
      return <ContextGuessMode word={word} onComplete={onComplete} />;
    case LearningMode.WORD_CONNECTIONS:
      return <WordConnectionsMode word={word} onComplete={onComplete} />;
    case LearningMode.SENTENCE_FORMATION:
      return <SentenceFormationMode word={word} onComplete={onComplete} />;
    case LearningMode.WORD_CONSTRUCTION:
      return <WordConstructionLab word={word} onComplete={onComplete} />;
    default:
      return <FlashcardMode word={word} onComplete={onComplete} />;
  }
};
