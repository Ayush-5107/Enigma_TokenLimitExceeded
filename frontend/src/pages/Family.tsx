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
    } catch (e) {
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
    } catch (e) {
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
    } catch (err: any) {
      alert(err.message || 'Invite failed');
    }
  };

  const sections = [
    { key: 'vault', label: 'Legacy Vault Secrets' },
    { key: 'documents', label: 'Documents & TEE OCR' },
    { key: 'estate', label: 'Estate Inventory & Assets' },
    { key: 'actions', label: 'Action Engine & Tasks' },
    { key: 'audit', label: 'Security & Audit Logs' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={24} color="#38bdf8" />
            <span>Family Access & Section-Level Permissions</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Least-privilege authorization matrix. Assign work to family without exposing private vault credentials.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowInviteModal(true)}
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
            <UserPlus size={16} />
            <span>Invite Family Member</span>
          </button>
        )}
      </div>

      {/* Permissions Matrix Table */}
      <div className="glass-card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', marginBottom: '1rem' }}>
          Section Access Control Matrix
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Family Member</th>
              <th style={{ padding: '0.75rem 1rem' }}>Relationship / Role</th>
              {sections.map(s => (
                <th key={s.key} style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>{s.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <strong style={{ color: '#f8fafc', display: 'block' }}>{m.name}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{m.email}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>
                  {m.relationship_type}
                </td>
                {sections.map(s => {
                  const hasPerm = m.role === 'owner' || m.permissions_json[s.key as keyof typeof m.permissions_json];
                  return (
                    <td key={s.key} style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                      <button
                        disabled={!isOwner || m.role === 'owner'}
                        onClick={() => handleTogglePermission(m.id, s.key, hasPerm)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: hasPerm ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)',
                          background: hasPerm ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                          color: hasPerm ? '#6ee7b7' : '#fda4af',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: isOwner && m.role !== 'owner' ? 'pointer' : 'default'
                        }}
                      >
                        {hasPerm ? <Check size={16} /> : <X size={16} />}
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
          <div className="modal-content" style={{ maxWidth: '480px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
              Invite Member & Set Scoped Access
            </h3>
            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '0.2rem' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '0.2rem' }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="priya@estate.demo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '0.2rem' }}>Relationship</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spouse / Daughter"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '0.2rem' }}>Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                  >
                    <option value="family_member">Family Member</option>
                    <option value="executor">Co-Executor</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  style={{ padding: '0.55rem 1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.55rem 1.1rem', borderRadius: '6px', border: 'none', background: '#38bdf8', color: '#090d16', fontWeight: 700, cursor: 'pointer' }}
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
