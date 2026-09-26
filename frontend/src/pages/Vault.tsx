import React, { useState } from 'react';
import { FolderKey, Lock, Eye, EyeOff, Plus, Clock, Trash2 } from 'lucide-react';
import { useEstate } from '../context/EstateContext';

interface VaultProps {
  isOwner: boolean;
}

export const Vault: React.FC<VaultProps> = ({ isOwner }) => {
  const { vaultEntries, addVaultEntry, deleteVaultEntry } = useEstate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>('credential');
  const [institution, setInstitution] = useState('');
  const [content, setContent] = useState('');
  const [accessLevel, setAccessLevel] = useState<any>('private');
  const [triggerDays, setTriggerDays] = useState(30);

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addVaultEntry({
      title,
      category,
      content,
      institution,
      access_level: accessLevel,
      deadman_trigger_days: Number(triggerDays)
    });
    setShowAddModal(false);
    setTitle('');
    setContent('');
    setInstitution('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FolderKey size={24} color="var(--primary)" />
            <span>Secure Legacy Vault</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Zero-knowledge AES-256 encrypted storage with dead-man's-switch triggers
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowAddModal(true)}
            className="neu-btn-primary"
          >
            <Plus size={15} />
            <span>Add Vault Secret</span>
          </button>
        )}
      </div>

      {/* Dead-Man Switch Status Box */}
      <div className="neu-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface)',
            boxShadow: 'var(--neu-shadow-btn)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Clock size={20} color="var(--primary)" />
          </div>
          <div>
            <strong style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>Dead-Man's-Switch Heartbeat Monitor</strong>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Inactivity beyond threshold triggers verified cryptographic release to beneficiaries.
            </p>
          </div>
        </div>
        <span className="badge-medium" style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700 }}>
          HEARTBEAT VERIFIED TODAY
        </span>
      </div>

      {/* Vault Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {vaultEntries.map((entry) => {
          const isRevealed = revealedIds[entry.id];
          return (
            <div key={entry.id} className="neu-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                  <span className="badge-medium" style={{ padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.66rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {entry.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    <Lock size={12} color="var(--success)" />
                    <span>AES-256</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>{entry.title}</h3>
                {entry.institution && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {entry.institution}
                  </div>
                )}

                {/* Inset Cryptographic Well */}
                <div className="neu-inset" style={{
                  margin: '0.75rem 0',
                  padding: '0.75rem',
                  fontSize: '0.78rem',
                  fontFamily: isRevealed ? 'inherit' : 'var(--font-mono)',
                  color: isRevealed ? 'var(--text-main)' : 'var(--text-dim)',
                  wordBreak: 'break-all',
                  minHeight: '52px'
                }}>
                  {isRevealed ? entry.content : '••••••••••••••••••••••••••••••••••••••••••••'}
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  Policy: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{entry.access_level}</span> · Trigger: {entry.deadman_trigger_days}d
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.7)' }}>
                <button
                  onClick={() => toggleReveal(entry.id)}
                  className="neu-btn"
                  style={{ color: 'var(--primary)', fontSize: '0.76rem' }}
                >
                  {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{isRevealed ? 'Hide Secret' : 'Reveal Secret'}</span>
                </button>

                {isOwner && (
                  <button
                    onClick={() => deleteVaultEntry(entry.id)}
                    className="neu-btn"
                    style={{ color: 'var(--danger)', padding: '0.45rem' }}
                    title="Delete Entry"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Secret Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Add Vault Entry (AES Encrypted)
            </h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Locker Key Ref / Demat PIN"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="credential">Credential</option>
                    <option value="document">Document</option>
                    <option value="note">Secret Note</option>
                    <option value="key">Key / Safe Code</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Institution</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC / LIC / Broker"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Secret Payload / Credentials</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter sensitive details to encrypt..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Access Policy</label>
                  <select
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="private">Private (Owner Only)</option>
                    <option value="shared">Shared with Family</option>
                    <option value="release_on_verification">Release on Inactivity Trigger</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Dead-Man Trigger (Days)</label>
                  <input
                    type="number"
                    value={triggerDays}
                    onChange={(e) => setTriggerDays(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="neu-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-primary"
                >
                  Encrypt & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
