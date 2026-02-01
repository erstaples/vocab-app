import React, { useEffect, useState } from 'react';
import { useWordStore } from '../../stores/wordStore';
import { Card, Button, Input, Select, Modal, ConfirmModal, Badge } from '../../components/common';
import type { Morpheme, MorphemeType } from '@vocab-builder/shared';
import './Admin.css';

export default function AdminMorphemes() {
  const { morphemes, fetchMorphemes, createMorpheme, updateMorpheme, deleteMorpheme } = useWordStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMorpheme, setSelectedMorpheme] = useState<Morpheme | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    morpheme: '',
    type: 'root' as MorphemeType,
    meaning: '',
    origin: '',
  });

  useEffect(() => {
    fetchMorphemes();
  }, [fetchMorphemes]);

  const filteredMorphemes = morphemes.filter(m => {
    const matchesSearch = !search ||
      m.morpheme.toLowerCase().includes(search.toLowerCase()) ||
      m.meaning.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleOpenCreate = () => {
    setSelectedMorpheme(null);
    setFormData({
      morpheme: '',
      type: 'root',
      meaning: '',
      origin: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (morpheme: Morpheme) => {
    setSelectedMorpheme(morpheme);
    setFormData({
      morpheme: morpheme.morpheme,
      type: morpheme.type,
      meaning: morpheme.meaning,
      origin: morpheme.origin || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (morpheme: Morpheme) => {
    setSelectedMorpheme(morpheme);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedMorpheme) {
        await updateMorpheme(selectedMorpheme.id, formData);
      } else {
        await createMorpheme(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save morpheme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMorpheme) return;
    setIsLoading(true);

    try {
      await deleteMorpheme(selectedMorpheme.id);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete morpheme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'prefix', label: 'Prefix' },
    { value: 'root', label: 'Root' },
    { value: 'suffix', label: 'Suffix' },
  ];

  const formTypeOptions = [
    { value: 'prefix', label: 'Prefix' },
    { value: 'root', label: 'Root' },
    { value: 'suffix', label: 'Suffix' },
  ];

  const getTypeBadgeVariant = (type: MorphemeType) => {
    switch (type) {
      case 'prefix': return 'primary';
      case 'root': return 'success';
      case 'suffix': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Morphemes Management</h1>
          <p>Manage word roots, prefixes, and suffixes</p>
        </div>
        <Button onClick={handleOpenCreate}>Add Morpheme</Button>
      </header>

      <Card className="admin-toolbar">
        <div className="admin-search">
          <Input
            placeholder="Search morphemes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            options={typeOptions}
          />
        </div>
        <span className="admin-count">{filteredMorphemes.length} morphemes</span>
      </Card>

      <Card className="admin-table-card" padding="none">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Morpheme</th>
              <th>Type</th>
              <th>Meaning</th>
              <th>Origin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMorphemes.map(morpheme => (
              <tr key={morpheme.id}>
                <td>
                  <strong>{morpheme.morpheme}</strong>
                </td>
                <td>
                  <Badge variant={getTypeBadgeVariant(morpheme.type)}>
                    {morpheme.type}
                  </Badge>
                </td>
                <td>{morpheme.meaning}</td>
                <td>{morpheme.origin || '-'}</td>
                <td>
                  <div className="admin-table__actions">
                    <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(morpheme)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleOpenDelete(morpheme)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMorphemes.length === 0 && (
          <div className="admin-empty">
            No morphemes found. Add your first morpheme to get started.
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMorpheme ? 'Edit Morpheme' : 'Add Morpheme'}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <Input
            label="Morpheme"
            value={formData.morpheme}
            onChange={e => setFormData({ ...formData, morpheme: e.target.value })}
            placeholder="e.g., -tion, pre-, dict"
            required
          />

          <Select
            label="Type"
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value as MorphemeType })}
            options={formTypeOptions}
          />

          <Input
            label="Meaning"
            value={formData.meaning}
            onChange={e => setFormData({ ...formData, meaning: e.target.value })}
            placeholder="e.g., say, speak"
            required
          />

          <Input
            label="Origin"
            value={formData.origin}
            onChange={e => setFormData({ ...formData, origin: e.target.value })}
            placeholder="e.g., Latin, Greek"
          />

          <div className="admin-form__actions">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {selectedMorpheme ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Morpheme"
        message={`Are you sure you want to delete "${selectedMorpheme?.morpheme}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isLoading}
      />
    </div>
  );
}
