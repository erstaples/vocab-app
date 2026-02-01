import React from 'react';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, className = '' }: StatCardProps) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-card__header">
        <span className="stat-card__title">{title}</span>
        {icon && <span className="stat-card__icon">{icon}</span>}
      </div>
      <div className="stat-card__value">{value}</div>
      {(subtitle || trend) && (
        <div className="stat-card__footer">
          {subtitle && <span className="stat-card__subtitle">{subtitle}</span>}
          {trend && (
            <span className={`stat-card__trend stat-card__trend--${trend.isPositive ? 'positive' : 'negative'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}
