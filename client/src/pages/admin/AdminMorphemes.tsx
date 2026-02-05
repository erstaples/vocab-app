import React, { useEffect, useState, useMemo } from 'react';
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
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [formData, setFormData] = useState({
    morpheme: '',
    type: 'root' as MorphemeType,
    meaning: '',
    origin: '',
    canonicalId: null as number | null,
  });

  useEffect(() => {
    fetchMorphemes();
  }, [fetchMorphemes]);

  // Group morphemes: canonical morphemes with their variants
  const groupedMorphemes = useMemo(() => {
    const canonical = morphemes.filter(m => !m.canonicalId);
    const variants = morphemes.filter(m => m.canonicalId);

    return canonical.map(c => ({
      ...c,
      variants: variants.filter(v => v.canonicalId === c.id),
    }));
  }, [morphemes]);

  // Filter grouped morphemes
  const filteredMorphemes = useMemo(() => {
    return groupedMorphemes.filter(m => {
      const variantTexts = m.variants?.map(v => v.morpheme).join(' ') || '';
      const matchesSearch = !search ||
        m.morpheme.toLowerCase().includes(search.toLowerCase()) ||
        m.meaning.toLowerCase().includes(search.toLowerCase()) ||
        variantTexts.toLowerCase().includes(search.toLowerCase());
      const matchesType = !typeFilter || m.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [groupedMorphemes, search, typeFilter]);

  // Get canonical morphemes for the dropdown (only prefixes since they have variants)
  const canonicalPrefixes = useMemo(() => {
    return morphemes
      .filter(m => m.type === 'prefix' && !m.canonicalId)
      .map(m => ({ value: m.id.toString(), label: `${m.morpheme} (${m.meaning})` }));
  }, [morphemes]);

  const handleOpenCreate = () => {
    setSelectedMorpheme(null);
    setIsAddingVariant(false);
    setFormData({
      morpheme: '',
      type: 'root',
      meaning: '',
      origin: '',
      canonicalId: null,
    });
    setIsModalOpen(true);
  };

  const handleOpenAddVariant = (canonical: Morpheme) => {
    setSelectedMorpheme(null);
    setIsAddingVariant(true);
    setFormData({
      morpheme: '',
      type: canonical.type,
      meaning: canonical.meaning,
      origin: canonical.origin || '',
      canonicalId: canonical.id,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (morpheme: Morpheme) => {
    setSelectedMorpheme(morpheme);
    setIsAddingVariant(false);
    setFormData({
      morpheme: morpheme.morpheme,
      type: morpheme.type,
      meaning: morpheme.meaning,
      origin: morpheme.origin || '',
      canonicalId: morpheme.canonicalId || null,
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

    const morphemeData = {
      morpheme: formData.morpheme,
      type: formData.type,
      meaning: formData.meaning,
      origin: formData.origin || undefined,
      canonicalId: formData.canonicalId,
    };

    try {
      if (selectedMorpheme) {
        await updateMorpheme(selectedMorpheme.id, morphemeData);
      } else {
        await createMorpheme(morphemeData);
      }
      setIsModalOpen(false);
      fetchMorphemes(); // Refresh to get updated groupings
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
        <table className="admin-table admin-table--morphemes">
          <thead>
            <tr>
              <th>Canonical Morpheme</th>
              <th>Type</th>
              <th>Meaning</th>
              <th>Variants (Assimilation Forms)</th>
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
                <td>
                  {morpheme.variants && morpheme.variants.length > 0 ? (
                    <div className="admin-table__variants">
                      {morpheme.variants.map(v => (
                        <span
                          key={v.id}
                          className="admin-table__variant"
                          onClick={() => handleOpenEdit(v)}
                          title="Click to edit"
                        >
                          {v.morpheme}
                        </span>
                      ))}
                      <button
                        className="admin-table__add-variant"
                        onClick={() => handleOpenAddVariant(morpheme)}
                        title="Add variant"
                      >
                        +
                      </button>
                    </div>
                  ) : morpheme.type === 'prefix' ? (
                    <button
                      className="admin-table__add-variant-btn"
                      onClick={() => handleOpenAddVariant(morpheme)}
                    >
                      + Add variants
                    </button>
                  ) : (
                    <span className="admin-table__no-morphemes">-</span>
                  )}
                </td>
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
        title={
          isAddingVariant
            ? 'Add Variant (Assimilation Form)'
            : selectedMorpheme
              ? 'Edit Morpheme'
              : 'Add Morpheme'
        }
        size="sm"
      >
        <form onSubmit={handleSubmit} className="admin-form">
          {isAddingVariant && formData.canonicalId && (
            <div className="admin-form__info">
              Adding variant for: <strong>{morphemes.find(m => m.id === formData.canonicalId)?.morpheme}</strong>
            </div>
          )}

          <Input
            label={isAddingVariant ? 'Variant Form' : 'Morpheme'}
            value={formData.morpheme}
            onChange={e => setFormData({ ...formData, morpheme: e.target.value })}
            placeholder={isAddingVariant ? 'e.g., ac-, af-, ag-' : 'e.g., -tion, pre-, dict'}
            required
          />

          {!isAddingVariant && (
            <Select
              label="Type"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as MorphemeType })}
              options={formTypeOptions}
            />
          )}

          {!isAddingVariant && (
            <Input
              label="Meaning"
              value={formData.meaning}
              onChange={e => setFormData({ ...formData, meaning: e.target.value })}
              placeholder="e.g., say, speak"
              required
            />
          )}

          <Input
            label="Origin"
            value={formData.origin}
            onChange={e => setFormData({ ...formData, origin: e.target.value })}
            placeholder="e.g., Latin, Greek"
          />

          {!isAddingVariant && formData.type === 'prefix' && !selectedMorpheme?.canonicalId && (
            <Select
              label="Canonical Form (if this is a variant)"
              value={formData.canonicalId?.toString() || ''}
              onChange={e => setFormData({ ...formData, canonicalId: e.target.value ? parseInt(e.target.value) : null })}
              options={[{ value: '', label: 'None (this is a canonical form)' }, ...canonicalPrefixes.filter(p => p.value !== selectedMorpheme?.id.toString())]}
            />
          )}

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
