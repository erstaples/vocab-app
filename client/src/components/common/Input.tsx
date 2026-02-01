import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substring(7)}`;

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input ${error ? 'input--error' : ''}`}
        {...props}
      />
      {error && <span className="input__error">{error}</span>}
      {helperText && !error && <span className="input__helper">{helperText}</span>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({
  label,
  error,
  options,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substring(7)}`;

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={selectId} className="input__label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`input select ${error ? 'input--error' : ''}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="input__error">{error}</span>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substring(7)}`;

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="input__label">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`input textarea ${error ? 'input--error' : ''}`}
        {...props}
      />
      {error && <span className="input__error">{error}</span>}
    </div>
  );
}
