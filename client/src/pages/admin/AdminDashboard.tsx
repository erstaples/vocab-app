import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../../stores/adminStore';
import { StatCard } from '../../components/admin';
import { Card, Button, Input, Badge } from '../../components/common';
import './Admin.css';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const {
    stats,
    unlinkedWords,
    totalUnlinkedWords,
    isLoadingStats,
    isLoadingUnlinkedWords,
    fetchStats,
    fetchUnlinkedWords,
  } = useAdminStore();

  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStats();
    fetchUnlinkedWords(1);
  }, [fetchStats, fetchUnlinkedWords]);

  const handleSearch = () => {
    fetchUnlinkedWords(1, search || undefined);
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Overview of your vocabulary database</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="admin-dashboard__stats">
        <StatCard
          title="Total Words"
          value={stats?.totalWords ?? '-'}
          subtitle="in vocabulary database"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          }
        />
        <StatCard
          title="Total Morphemes"
          value={stats?.totalMorphemes ?? '-'}
          subtitle="prefixes, roots, suffixes"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
            </svg>
          }
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? '-'}
          subtitle="registered users"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatCard
          title="Morpheme Coverage"
          value={stats ? `${stats.morphemeCoverage}%` : '-'}
          subtitle={stats ? `${stats.wordsWithMorphemes} of ${stats.totalWords} words linked` : 'calculating...'}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <Card className="admin-dashboard__actions">
        <h3 className="admin-dashboard__section-title">Quick Actions</h3>
        <div className="admin-dashboard__action-buttons">
          <Link to="/admin/words">
            <Button variant="secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Word
            </Button>
          </Link>
          <Link to="/admin/morphemes">
            <Button variant="secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Morpheme
            </Button>
          </Link>
          <Link to="/admin/word-morphemes">
            <Button variant="secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Link Morphemes
            </Button>
          </Link>
          <Link to="/admin/ai-tools">
            <Button>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13a1.5 1.5 0 0 0-1.5 1.5 1.5 1.5 0 0 0 1.5 1.5 1.5 1.5 0 0 0 1.5-1.5 1.5 1.5 0 0 0-1.5-1.5m9 0a1.5 1.5 0 0 0-1.5 1.5 1.5 1.5 0 0 0 1.5 1.5 1.5 1.5 0 0 0 1.5-1.5 1.5 1.5 0 0 0-1.5-1.5" />
              </svg>
              AI Tools
            </Button>
          </Link>
        </div>
      </Card>

      {/* Unlinked Words */}
      <Card className="admin-dashboard__unlinked">
        <div className="admin-dashboard__unlinked-header">
          <h3 className="admin-dashboard__section-title">
            Words Without Morphemes
            <Badge variant="warning" size="sm">{totalUnlinkedWords}</Badge>
          </h3>
          <div className="admin-dashboard__unlinked-search">
            <Input
              placeholder="Search unlinked words..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="secondary" size="sm" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>

        {isLoadingUnlinkedWords ? (
          <div className="admin-dashboard__loading">Loading...</div>
        ) : unlinkedWords.length === 0 ? (
          <div className="admin-dashboard__empty">
            {search ? 'No unlinked words match your search.' : 'All words have morpheme associations!'}
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Word</th>
                <th>Part of Speech</th>
                <th>Definition</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {unlinkedWords.map(word => (
                <tr key={word.id}>
                  <td>
                    <strong>{word.word}</strong>
                  </td>
                  <td>
                    <Badge variant="default">{word.partOfSpeech}</Badge>
                  </td>
                  <td className="admin-table__definition">
                    {word.definition.substring(0, 60)}
                    {word.definition.length > 60 ? '...' : ''}
                  </td>
                  <td>
                    <Link to={`/admin/word-morphemes?wordId=${word.id}`}>
                      <Button size="sm" variant="ghost">
                        Link Morphemes
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalUnlinkedWords > 20 && (
          <div className="admin-dashboard__view-all">
            <Link to="/admin/word-morphemes">
              <Button variant="ghost" size="sm">
                View all {totalUnlinkedWords} unlinked words
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
