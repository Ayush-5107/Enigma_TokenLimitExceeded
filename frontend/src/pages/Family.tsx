import React, { useEffect, useState } from 'react';
import { Users, Check, X, UserPlus } from 'lucide-react';
import { familyApi } from '../services/familyApi';
import type { FamilyMember } from '../services/familyApi';

interface FamilyProps {
  isOwner: boolean;
}

export const Family: React.FC<FamilyProps> = ({ isOwner }) => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('Child');
  const [role, setRole] = useState('family_member');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const res = await familyApi.getMembers('estate-case-1');
      setMembers(res);
    } catch {
      setMembers([
        {
          id: 'member-1',
          estate_id: 'estate-case-1',
          name: 'Rajesh Sharma',
          email: 'owner@estate.demo',
          relationship_type: 'Primary Executor',
          role: 'owner',
          permissions_json: { vault: true, documents: true, estate: true, actions: true, audit: true },
          status: 'active',
          joined_at: new Date().toISOString()
        },
        {
          id: 'member-2',
          estate_id: 'estate-case-1',
          name: 'Rahul Sharma',
          email: 'rahul@estate.demo',
          relationship_type: 'Son / Beneficiary',
          role: 'family_member',
          permissions_json: { vault: false, documents: true, estate: true, actions: true, audit: false },
          status: 'active',
          joined_at: new Date().toISOString()
        },
        {
          id: 'member-3',
          estate_id: 'estate-case-1',
          name: 'Adv. Anita Mehta',
          email: 'anita@estate.demo',
          relationship_type: 'Legal Counsel',
          role: 'executor',
          permissions_json: { vault: true, documents: true, estate: true, actions: true, audit: true },
          status: 'active',
          joined_at: new Date().toISOString()
        }
      ]);
    }
  };

  const handleTogglePermission = async (memberId: string, sectionKey: string, currentVal: boolean) => {
    if (!isOwner) return;
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const newPerms = { ...member.permissions_json, [sectionKey]: !currentVal };
    try {
      await familyApi.updatePermissions(memberId, newPerms);
      loadMembers();
    } catch {
      setMembers(members.map(m => m.id === memberId ? { ...m, permissions_json: newPerms } : m));
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await familyApi.addMember('estate-case-1', {
        name,
        email,
        relationship_type: relationship,
        role,
        permissions: {
          vault: false,
          documents: true,
          estate: true,
          actions: true,
          audit: false
        }
      });
      setShowInviteModal(false);
      setName('');
      setEmail('');
      loadMembers();
    } catch {
      setMembers([
        ...members,
        {
          id: 'member-' + Date.now(),
          estate_id: 'estate-case-1',
          name,
          email,
          relationship_type: relationship,
          role,
          permissions_json: { vault: false, documents: true, estate: true, actions: true, audit: false },
          status: 'active',
          joined_at: new Date().toISOString()
        }
      ]);
      setShowInviteModal(false);
      setName('');
      setEmail('');
    }
  };

  const sections = [
    { key: 'vault', label: 'Vault Secrets' },
    { key: 'documents', label: 'Documents & OCR' },
    { key: 'estate', label: 'Estate Inventory' },
    { key: 'actions', label: 'Action Checklists' },
    { key: 'audit', label: 'Audit Logs' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={26} color="var(--primary)" />
            <span>Family Access & Section-Level Permissions</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Least-privilege authorization matrix. Assign work to family without exposing private vault credentials.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="neu-btn-primary"
          >
            <UserPlus size={16} />
            <span>Invite Family Member</span>
          </button>
        )}
      </div>

      {/* Permissions Matrix Table */}
      <div className="neu-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
          Section Access Control Matrix
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.7)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>FAMILY MEMBER</th>
              <th style={{ padding: '0.75rem 1rem' }}>ROLE</th>
              {sections.map(s => (
                <th key={s.key} style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>{s.label.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
                <td style={{ padding: '1rem' }}>
                  <strong style={{ color: 'var(--text-main)', display: 'block' }}>{m.name}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{m.email}</span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  {m.relationship_type}
                </td>
                {sections.map(s => {
                  const hasPerm = m.role === 'owner' || m.permissions_json[s.key as keyof typeof m.permissions_json];
                  return (
                    <td key={s.key} style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                      <button
                        disabled={!isOwner || m.role === 'owner'}
                        onClick={() => handleTogglePermission(m.id, s.key, hasPerm)}
                        className="neu-btn"
                        style={{
                          width: '36px',
                          height: '36px',
                          padding: 0,
                          borderRadius: 'var(--radius-sm)',
                          color: hasPerm ? 'var(--success)' : 'var(--danger)',
                          boxShadow: hasPerm ? 'var(--neu-shadow-btn)' : 'var(--neu-shadow-inset)',
                          cursor: isOwner && m.role !== 'owner' ? 'pointer' : 'default',
                          opacity: m.role === 'owner' ? 0.7 : 1
                        }}
                        title={hasPerm ? 'Access Granted' : 'Access Restricted'}
                      >
                        {hasPerm ? <Check size={18} /> : <X size={18} />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              Invite Member & Set Scoped Access
            </h3>
            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="priya@estate.demo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Relationship</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spouse / Daughter"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="family_member">Family Member</option>
                    <option value="executor">Co-Executor</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="neu-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-primary"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
