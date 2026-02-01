import React from 'react';
import './phases.css';

interface RatePhasesProps {
  onRate: (rating: number) => void;
  isSubmitting: boolean;
}

const RATING_LABELS = [
  { value: 0, label: 'Forgot', description: 'Complete blackout' },
  { value: 1, label: 'Hard', description: 'Incorrect, but remembered after seeing answer' },
  { value: 2, label: 'Difficult', description: 'Correct with serious difficulty' },
  { value: 3, label: 'Good', description: 'Correct with some hesitation' },
  { value: 4, label: 'Easy', description: 'Correct with little thought' },
  { value: 5, label: 'Perfect', description: 'Instant recall' },
];

export function RatePhase({ onRate, isSubmitting }: RatePhasesProps) {
  return (
    <div className="phase phase--rate">
      <div className="phase__indicator">
        <span className="phase__indicator-dot phase__indicator-dot--rate" />
        <span className="phase__indicator-text">Rate</span>
      </div>

      <div className="phase__content">
        <p className="rate-phase__prompt">How well did you know this?</p>
        <div className="rate-phase__buttons">
          {RATING_LABELS.map(({ value, label, description }) => (
            <button
              key={value}
              className={`rate-phase__btn rate-phase__btn--${value}`}
              onClick={() => onRate(value)}
              disabled={isSubmitting}
              title={description}
            >
              <span className="rate-phase__btn-value">{value}</span>
              <span className="rate-phase__btn-label">{label}</span>
            </button>
          ))}
        </div>
        <p className="rate-phase__hint">Press 0-5 to rate quickly</p>
      </div>
    </div>
  );
}
