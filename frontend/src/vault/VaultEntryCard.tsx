import React from 'react';
import { Shield, Eye, Edit3, Trash2, Lock } from 'lucide-react';
import type { VaultEntry } from '../types';

interface VaultCardProps {
  entry: VaultEntry;
  onViewSecret: (entry: VaultEntry) => void;
  onEdit: (entry: VaultEntry) => void;
  onDelete: (id: string) => void;
}

export const VaultEntryCard: React.FC<VaultCardProps> = ({ entry, onViewSecret, onEdit, onDelete }) => {
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'will': return { label: 'Legal Will', bg: '#fef3c7', color: '#92400e' };
      case 'demat': return { label: 'Demat / Stocks', bg: '#e0f2fe', color: '#075985' };
      case 'bank': return { label: 'Bank Credentials', bg: '#dcfce7', color: '#166534' };
      case 'property': return { label: 'Property Deed', bg: '#f3e8ff', color: '#6b21a8' };
      case 'insurance': return { label: 'Insurance Policy', bg: '#fee2e2', color: '#991b1b' };
      default: return { label: 'Custom Document', bg: '#f1f5f9', color: '#475569' };
    }
  };

  const badge = getCategoryBadge(entry.category);

  return (
    <div className="neu-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          padding: '0.25rem 0.65rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.72rem',
          fontWeight: 700,
          background: badge.bg,
          color: badge.color,
          fontFamily: 'var(--font-mono)'
        }}>
          {badge.label}
        </span>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            onClick={() => onEdit(entry)}
            style={{ padding: '0.3rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            title="Edit Entry"
          >
            <Edit3 size={15} />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            style={{ padding: '0.3rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
            title="Delete Entry"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
          {entry.title}
        </h4>
        {entry.description && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.4 }}>
            {entry.description}
          </p>
        )}
      </div>

      <div className="neu-inset" style={{ padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <Lock size={14} color="var(--primary)" />
          <span>••••••••••••••••</span>
        </div>
        <button
          onClick={() => onViewSecret(entry)}
          className="neu-btn-primary"
          style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem' }}
        >
          <Eye size={13} />
          <span>Reveal Secret</span>
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-dim)', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.65rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Shield size={12} color="var(--success)" />
          {entry.access_level === 'shared_on_death' ? 'Released via Dead-Man Switch' : 'Private to Owner'}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>
          {new Date(entry.updated_at).toLocaleDateString('en-IN')}
        </span>
      </div>
    </div>
  );
};
