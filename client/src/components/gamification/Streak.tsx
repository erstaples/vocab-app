import React from 'react';
import './Streak.css';

interface StreakProps {
  currentStreak: number;
  longestStreak: number;
  showLongest?: boolean;
}

export function Streak({ currentStreak, longestStreak, showLongest = true }: StreakProps) {
  const isOnFire = currentStreak >= 7;

  return (
    <div className={`streak ${isOnFire ? 'streak--on-fire' : ''}`}>
      <div className="streak__icon">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 23c-4.97 0-9-4.03-9-9 0-3.53 2.04-6.58 5-8.05V4c0-.55.45-1 1-1s1 .45 1 1v2.05c1.91-.93 3.97-.93 5.88 0C15.92 5.07 15.97 4.55 15.97 4c0-.55.45-1 1-1s1 .45 1 1v1.95c2.96 1.47 5 4.52 5 8.05 0 4.97-4.03 9-9 9zm0-16c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
        </svg>
      </div>
      <div className="streak__content">
        <div className="streak__current">
          <span className="streak__number">{currentStreak}</span>
          <span className="streak__label">Day Streak</span>
        </div>
        {showLongest && (
          <div className="streak__longest">
            Best: {longestStreak} days
          </div>
        )}
      </div>
    </div>
  );
}

interface StreakCalendarProps {
  activityDates: string[];
}

export function StreakCalendar({ activityDates }: StreakCalendarProps) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const dateStrings = new Set(activityDates);

  return (
    <div className="streak-calendar">
      {days.map(date => {
        const dateStr = date.toISOString().split('T')[0];
        const isActive = dateStrings.has(dateStr);
        const isToday = date.toDateString() === today.toDateString();

        return (
          <div
            key={dateStr}
            className={`streak-calendar__day ${isActive ? 'streak-calendar__day--active' : ''} ${isToday ? 'streak-calendar__day--today' : ''}`}
          >
            <span className="streak-calendar__day-name">
              {date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
