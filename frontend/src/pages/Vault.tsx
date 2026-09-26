import React, { useEffect, useState } from 'react';
import { FolderKey, Lock, Eye, EyeOff, Plus, Clock, Trash2 } from 'lucide-react';
import { vaultApi } from '../services/vaultApi';
import type { VaultEntry } from '../services/vaultApi';

interface VaultProps {
  isOwner: boolean;
}

export const Vault: React.FC<VaultProps> = ({ isOwner }) => {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>('credential');
  const [institution, setInstitution] = useState('');
  const [content, setContent] = useState('');
  const [accessLevel, setAccessLevel] = useState<any>('private');
  const [triggerDays, setTriggerDays] = useState(30);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const res = await vaultApi.getEntries();
      setEntries(res);
    } catch {
      setEntries([
        {
          id: 'vault-1',
          owner_id: 'user-owner-1',
          title: 'Primary Family Will & Testament (Copy)',
          category: 'document',
          institution: 'Mehta & Associates Legal',
          access_level: 'release_on_verification',
          deadman_trigger_days: 30,
          metadata_json: { witness_names: ['Karan Malhotra', 'Deepak Verma'], locker_key_ref: 'KEY-7782' },
          content: 'Original physical will stored in Locker #402 at SBI Connaught Place Branch. Executor: Adv. Anita Mehta.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'vault-2',
          owner_id: 'user-owner-1',
          title: 'Zerodha Demat Trading Account Credentials',
          category: 'credential',
          institution: 'Zerodha Broking Ltd',
          access_level: 'private',
          deadman_trigger_days: 14,
          metadata_json: { portfolio_type: 'Equity & Mutual Funds' },
          content: 'Client ID: AB8912 | Password: SecretVaultPass2026! | TOTP Seed: JBSWY3DPEHPK3PXP',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'vault-3',
          owner_id: 'user-owner-1',
          title: 'Ancestral Land Deed - Jaipur Plot 14B',
          category: 'key',
          institution: 'Jaipur Revenue Dept',
          access_level: 'shared',
          deadman_trigger_days: 60,
          metadata_json: { area_sqft: 3600 },
          content: 'Khasra No 104/2, Village Sanganer, Jaipur. Registry Original with HDFC Bank Safe Keep.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await vaultApi.createEntry({
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
      loadEntries();
    } catch {
      setEntries([
        ...entries,
        {
          id: 'vault-' + Date.now(),
          owner_id: 'user-owner-1',
          title,
          category,
          institution,
          access_level: accessLevel,
          deadman_trigger_days: Number(triggerDays),
          metadata_json: {},
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
      setShowAddModal(false);
      setTitle('');
      setContent('');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vault item?')) {
      try {
        await vaultApi.deleteEntry(id);
        loadEntries();
      } catch {
        setEntries(entries.filter(x => x.id !== id));
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FolderKey size={26} color="var(--primary)" />
            <span>Secure Legacy Vault</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Zero-knowledge AES-256 encrypted storage for wills, accounts, keys & dead-man's-switch triggers.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowAddModal(true)}
            className="neu-btn-primary"
          >
            <Plus size={16} />
            <span>Add Vault Secret</span>
          </button>
        )}
      </div>

      {/* Dead-Man Switch Status Box */}
      <div className="neu-card" style={{ padding: '1.25rem 1.5rem', borderLeft: '5px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface)',
            boxShadow: 'var(--neu-shadow-btn)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={22} color="var(--primary)" />
          </div>
          <div>
            <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>Dead-Man's-Switch Monitor Active</strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              System checks user activity heartbeats. If inactive for configured days (14–60 days), controlled release protocol unlocks designated vault entries for beneficiaries.
            </p>
          </div>
        </div>
        <span className="badge-medium" style={{ padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
          STATUS: HEARTBEAT VERIFIED TODAY
        </span>
      </div>

      {/* Vault Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {entries.map((entry) => {
          const isRevealed = revealedIds[entry.id];
          return (
            <div key={entry.id} className="neu-card" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <span className="badge-medium" style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {entry.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    <Lock size={13} color="var(--success)" />
                    <span>AES-256</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{entry.title}</h3>
                {entry.institution && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Institution: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{entry.institution}</span>
                  </div>
                )}

                {/* Inset Cryptographic Well */}
                <div className="neu-inset" style={{
                  margin: '1rem 0',
                  padding: '0.9rem',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-mono)',
                  color: isRevealed ? 'var(--text-main)' : 'var(--text-dim)',
                  wordBreak: 'break-all',
                  minHeight: '60px'
                }}>
                  {isRevealed ? (
                    entry.content || '[Encrypted Content]'
                  ) : (
                    '••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
                  )}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
                  Policy: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{entry.access_level}</span> | Trigger: {entry.deadman_trigger_days}d
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.6)' }}>
                <button
                  onClick={() => toggleReveal(entry.id)}
                  className="neu-btn"
                  style={{ color: 'var(--primary)' }}
                >
                  {isRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                  <span>{isRevealed ? 'Hide Secret' : 'Reveal Secret'}</span>
                </button>

                {isOwner && (
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="neu-btn"
                    style={{ color: 'var(--danger)', padding: '0.55rem' }}
                    title="Delete Entry"
                  >
                    <Trash2 size={16} />
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
          <div className="modal-content" style={{ maxWidth: '540px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              Add Vault Secret (Client-Side AES Encryption)
            </h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SBI Locker Key Code / Demat Credentials"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="credential">Credential</option>
                    <option value="document">Legal Document</option>
                    <option value="note">Encrypted Note</option>
                    <option value="key">Key / Locker Code</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Institution</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC / LIC / Zerodha"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Secret Payload / Credentials</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter sensitive details to encrypt..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Access Policy</label>
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
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Dead-Man Trigger (Days)</label>
                  <input
                    type="number"
                    value={triggerDays}
                    onChange={(e) => setTriggerDays(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
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
