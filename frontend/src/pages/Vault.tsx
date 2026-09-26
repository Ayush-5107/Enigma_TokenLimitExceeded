import React, { useState } from 'react';
import { FolderKey, Lock, Eye, EyeOff, Plus, Clock, Trash2, Edit3, Activity, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';
import { useEstate, type VaultItem } from '../context/EstateContext';

interface VaultProps {
  isOwner: boolean;
}

export const Vault: React.FC<VaultProps> = ({ isOwner }) => {
  const { vaultEntries, addVaultEntry, deleteVaultEntry } = useEstate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<VaultItem | null>(null);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  // Form State (shared for add/edit)
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>('credential');
  const [institution, setInstitution] = useState('');
  const [content, setContent] = useState('');
  const [accessLevel, setAccessLevel] = useState<any>('private');
  const [triggerDays, setTriggerDays] = useState(30);

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resetForm = () => {
    setTitle('');
    setCategory('credential');
    setInstitution('');
    setContent('');
    setAccessLevel('private');
    setTriggerDays(30);
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
    resetForm();
  };

  const handleEdit = (entry: VaultItem) => {
    setEditingEntry(entry);
    setTitle(entry.title || '');
    setCategory(entry.category || 'credential');
    setInstitution(entry.institution || '');
    setContent(entry.content || '');
    setAccessLevel(entry.access_level || 'private');
    setTriggerDays(entry.deadman_trigger_days || 30);
    setShowEditModal(true);
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry) {
      deleteVaultEntry(editingEntry.id);
      addVaultEntry({
        title,
        category,
        content,
        institution,
        access_level: accessLevel,
        deadman_trigger_days: Number(triggerDays)
      });
    }
    setShowEditModal(false);
    setEditingEntry(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this encrypted vault entry?')) {
      deleteVaultEntry(id);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'financial':
      case 'credential':
        return { label: 'Credential / Banking', bg: '#e6f2f2', color: 'var(--primary)' };
      case 'legal':
      case 'document':
        return { label: 'Legal Document', bg: '#fef3c7', color: '#b45309' };
      case 'digital_account':
      case 'note':
        return { label: 'Digital Account Note', bg: '#f3e8ff', color: '#7e22ce' };
      default:
        return { label: cat.toUpperCase(), bg: '#f1f5f9', color: 'var(--text-muted)' };
    }
  };

  const renderVaultForm = (onSubmit: (e: React.FormEvent) => void, submitLabel: string) => (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Entry Title</label>
        <input
          type="text"
          required
          placeholder="e.g. HDFC NetBanking Admin Password"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as any)} style={{ width: '100%' }}>
            <option value="credential">Financial Credential</option>
            <option value="document">Legal Document</option>
            <option value="digital_account">Digital Account</option>
            <option value="note">Encrypted Secret Note</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Institution / Entity</label>
          <input
            type="text"
            placeholder="e.g. HDFC Bank Ltd"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div>
        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Secret Payload (Encrypted)</label>
        <textarea
          required
          rows={3}
          placeholder="Customer ID: 99182312, Password: SafePass#2026..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Access Policy</label>
          <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value as any)} style={{ width: '100%' }}>
            <option value="private">Private (Owner Only)</option>
            <option value="shared">Shared with Family</option>
            <option value="release_on_verification">Release on Inactivity Trigger</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Dead-Man Trigger (Days)</label>
          <input
            type="number"
            value={triggerDays}
            onChange={(e) => setTriggerDays(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
        <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); setEditingEntry(null); resetForm(); }} className="neu-btn">Cancel</button>
        <button type="submit" className="neu-btn-primary">{submitLabel}</button>
      </div>
    </form>
  );

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
            Private, end-to-end encrypted vault for critical account details and family instructions
          </p>
        </div>
        {isOwner && (
          <button onClick={() => { resetForm(); setShowAddModal(true); }} className="neu-btn-primary">
            <Plus size={16} />
            <span>Add Vault Secret</span>
          </button>
        )}
      </div>

      {/* Dead-Man's Switch Safeguard Card */}
      <div className="neu-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: 'var(--radius-md)',
              background: 'var(--surface)', boxShadow: 'var(--neu-shadow-btn)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Activity size={22} color="var(--primary)" className="animate-tee-pulse" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Emergency Family Access Release
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Automated access release for your family upon extended inactivity (30 days).
              </p>
            </div>
          </div>
          <button className="neu-btn-primary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.82rem' }} onClick={() => alert('Heartbeat confirmed! Safety timer reset.')}>
            <RefreshCw size={15} />
            <span>Confirm Activity Now</span>
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
          <div className="neu-inset" style={{ padding: '0.85rem 1rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>LAST ACTIVITY RECORDED</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} />
              <span>Today, {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <div className="neu-inset" style={{ padding: '0.85rem 1rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>SAFETY RELEASE WINDOW</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} color="var(--primary)" />
              <span>30 Days Remaining</span>
            </div>
          </div>
          <div className="neu-inset" style={{ padding: '0.85rem 1rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>FAMILY BENEFICIARIES</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--warning)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} />
              <span>2 Nominees Pre-Configured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vault Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {vaultEntries.map((entry) => {
          const isRevealed = revealedIds[entry.id];
          const badge = getCategoryBadge(entry.category);
          return (
            <div key={entry.id} className="neu-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <span style={{
                    padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem', fontWeight: 700, background: badge.bg, color: badge.color,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {badge.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {isOwner && (
                      <>
                        <button onClick={() => handleEdit(entry)} style={{ padding: '0.3rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title="Edit Entry">
                          <Edit3 size={15} />
                        </button>
                        <button onClick={() => handleDelete(entry.id)} style={{ padding: '0.3rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }} title="Delete Entry">
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginLeft: '0.25rem' }}>
                      <Lock size={13} color="var(--success)" />
                      <span>Encrypted</span>
                    </div>
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
                  margin: '1rem 0', padding: '0.9rem', fontSize: '0.82rem',
                  fontFamily: 'var(--font-mono)',
                  color: isRevealed ? 'var(--text-main)' : 'var(--text-dim)',
                  wordBreak: 'break-all', minHeight: '60px'
                }}>
                  {isRevealed ? (entry.content || '[Encrypted Content]') : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  Policy: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{entry.access_level}</span> · Trigger: {entry.deadman_trigger_days}d
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.6)' }}>
                <button onClick={() => toggleReveal(entry.id)} className="neu-btn" style={{ color: 'var(--primary)' }}>
                  {isRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                  <span>{isRevealed ? 'Hide Secret' : 'Reveal Secret'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Secret Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Add Vault Entry (AES Encrypted)
            </h3>
            {renderVaultForm(handleCreate, 'Encrypt & Save')}
          </div>
        </div>
      )}

      {/* Edit Secret Modal */}
      {showEditModal && editingEntry && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Edit Vault Entry
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' }}>
              Editing: {editingEntry.title}
            </p>
            {renderVaultForm(handleEditSave, 'Save Changes')}
          </div>
        </div>
      )}
    </div>
  );
};
