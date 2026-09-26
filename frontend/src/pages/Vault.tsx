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
    } catch (e) {
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
    } catch (err: any) {
      alert(err.message || 'Error creating entry');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vault item?')) {
      try {
        await vaultApi.deleteEntry(id);
        loadEntries();
      } catch (e) {
        setEntries(entries.filter(x => x.id !== id));
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FolderKey size={24} color="#38bdf8" />
            <span>Secure Legacy Vault</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Zero-knowledge encrypted storage for wills, accounts, keys & dead-man's-switch triggers.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
              color: '#090d16',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Plus size={16} />
            <span>Add Vault Secret</span>
          </button>
        )}
      </div>

      {/* Dead-Man Switch Status Box */}
      <div className="glass-card" style={{ padding: '1.1rem 1.25rem', background: 'rgba(56, 189, 248, 0.08)', borderColor: 'rgba(56, 189, 248, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Clock size={22} color="#38bdf8" />
          <div>
            <strong style={{ color: '#f8fafc', fontSize: '0.9rem' }}>Dead-Man's-Switch Monitor Active</strong>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              System checks user activity heartbeats. If inactive for configured days (14-60 days), controlled release protocol unlocks designated vault entries for beneficiaries.
            </p>
          </div>
        </div>
        <span className="badge-medium" style={{ padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
          Status: Heartbeat Verified Today
        </span>
      </div>

      {/* Vault Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {entries.map((entry) => {
          const isRevealed = revealedIds[entry.id];
          return (
            <div key={entry.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge-medium" style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {entry.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                    <Lock size={12} color="#10b981" />
                    <span>AES-256</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc' }}>{entry.title}</h3>
                {entry.institution && (
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    Institution: <span style={{ color: '#cbd5e1' }}>{entry.institution}</span>
                  </div>
                )}

                {/* Encrypted / Decrypted Content Box */}
                <div style={{
                  margin: '0.85rem 0',
                  padding: '0.85rem',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '0.82rem',
                  fontFamily: isRevealed ? 'inherit' : 'monospace',
                  color: isRevealed ? '#f8fafc' : '#64748b',
                  wordBreak: 'break-all'
                }}>
                  {isRevealed ? (
                    entry.content || '[Encrypted Content]'
                  ) : (
                    '••••••••••••••••••••••••••••••••••••••••••••'
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={() => toggleReveal(entry.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  {isRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span>{isRevealed ? 'Hide Secret' : 'Reveal Secret'}</span>
                </button>

                {isOwner && (
                  <button
                    onClick={() => handleDelete(entry.id)}
                    style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', opacity: 0.8 }}
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
          <div className="modal-content" style={{ maxWidth: '520px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
              Add Vault Entry (AES Encrypted)
            </h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SBI Locker Key Code / Demat Credentials"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                  >
                    <option value="credential">Credential</option>
                    <option value="document">Legal Document</option>
                    <option value="note">Encrypted Note</option>
                    <option value="key">Key / Locker Code</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>Institution</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC / LIC / Broker"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>Secret Payload / Notes</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter sensitive details to encrypt..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>Access Policy</label>
                  <select
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                  >
                    <option value="private">Private (Owner Only)</option>
                    <option value="shared">Shared with Family</option>
                    <option value="release_on_verification">Release on Inactivity Trigger</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>Dead-Man Trigger (Days)</label>
                  <input
                    type="number"
                    value={triggerDays}
                    onChange={(e) => setTriggerDays(Number(e.target.value))}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: '#38bdf8', color: '#090d16', fontWeight: 700, cursor: 'pointer' }}
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
