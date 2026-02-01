import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  variant = 'primary',
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const classes = ['progress-bar', `progress-bar--${variant}`, `progress-bar--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {(label || showValue) && (
        <div className="progress-bar__header">
          {label && <span className="progress-bar__label">{label}</span>}
          {showValue && (
            <span className="progress-bar__value">
              {value} / {max}
            </span>
          )}
        </div>
      )}
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
