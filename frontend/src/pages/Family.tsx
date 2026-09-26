import React, { useState } from 'react';
import { Users, Check, X, UserPlus, ShieldCheck, ShieldAlert, Lock, Unlock, ChevronDown, ChevronUp } from 'lucide-react';
import { useEstate } from '../context/EstateContext';
import type { ToastData } from '../components/Toast';

interface FamilyProps {
  isOwner: boolean;
  onToast?: (toast: Omit<ToastData, 'id'>) => void;
}

interface ConfirmAction {
  memberId: string;
  memberName: string;
  sectionKey: string;
  sectionLabel: string;
  currentValue: boolean;
}

export const Family: React.FC<FamilyProps> = ({ isOwner, onToast }) => {
  const { familyMembers, updateMemberPermissions, addFamilyMember } = useEstate();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [recentlyToggled, setRecentlyToggled] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('Child');
  const [role, setRole] = useState<'family_member' | 'executor'>('family_member');

  const sections = [
    { key: 'vault', label: 'Vault', icon: Lock, description: 'Encrypted secrets, credentials & keys' },
    { key: 'documents', label: 'Documents', icon: ShieldCheck, description: 'TEE-extracted financial documents' },
    { key: 'estate', label: 'Inventory', icon: ShieldCheck, description: 'Assets & liabilities overview' },
    { key: 'actions', label: 'Actions', icon: ShieldCheck, description: 'Priority closure checklist items' },
    { key: 'audit', label: 'Audit', icon: ShieldAlert, description: 'Security & compliance audit trail' }
  ];

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    addFamilyMember({ name, email, relationship, role });
    setShowInviteModal(false);
    setName('');
    setEmail('');
    onToast?.({
      type: 'success',
      title: `${name} invited successfully`,
      message: `Invitation sent to ${email} as ${role === 'executor' ? 'Co-Executor' : 'Family Member'}`
    });
  };

  const handlePermissionClick = (memberId: string, memberName: string, sectionKey: string, sectionLabel: string, currentValue: boolean) => {
    if (!isOwner) return;
    setConfirmAction({ memberId, memberName, sectionKey, sectionLabel, currentValue });
  };

  const confirmPermissionChange = () => {
    if (!confirmAction) return;
    const { memberId, memberName, sectionKey, sectionLabel, currentValue } = confirmAction;
    const newValue = !currentValue;

    updateMemberPermissions(memberId, sectionKey, newValue);

    // Trigger toggle animation
    const toggleKey = `${memberId}-${sectionKey}`;
    setRecentlyToggled(toggleKey);
    setTimeout(() => setRecentlyToggled(null), 300);

    // Fire toast notification
    onToast?.({
      type: newValue ? 'success' : 'warning',
      title: `${sectionLabel} ${newValue ? 'Granted' : 'Revoked'}`,
      message: `${memberName} can ${newValue ? 'now access' : 'no longer access'} the ${sectionLabel} section`
    });

    setConfirmAction(null);
  };

  const toggleMemberExpand = (id: string) => {
    setExpandedMemberId(prev => prev === id ? null : id);
  };

  const getPermissionCount = (perms: Record<string, boolean>) => {
    return Object.values(perms).filter(Boolean).length;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={24} color="var(--primary)" />
            <span>Family Access Control</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Grant or revoke section-level access for each nominee
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="neu-btn-primary"
          >
            <UserPlus size={15} />
            <span>Invite Member</span>
          </button>
        )}
      </div>

      {/* Permissions Matrix Table */}
      <div className="neu-card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
          Section-Level Authorization Matrix
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.7)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <th style={{ padding: '0.65rem 0.85rem' }}>MEMBER</th>
              <th style={{ padding: '0.65rem 0.85rem' }}>ROLE</th>
              {sections.map(s => (
                <th key={s.key} style={{ padding: '0.65rem 0.4rem', textAlign: 'center' }}>{s.label.toUpperCase()}</th>
              ))}
              <th style={{ padding: '0.65rem 0.4rem', textAlign: 'center' }}>DETAIL</th>
            </tr>
          </thead>
          <tbody>
            {familyMembers.map((m) => {
              const isExpanded = expandedMemberId === m.id;
              const permCount = getPermissionCount(m.permissions_json);
              const totalSections = sections.length;

              return (
                <React.Fragment key={m.id}>
                  <tr style={{ borderBottom: isExpanded ? 'none' : '1px solid rgba(255,255,255,0.6)' }}>
                    <td style={{ padding: '0.75rem 0.85rem' }}>
                      <strong style={{ color: 'var(--text-main)', display: 'block' }}>{m.name}</strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{m.email}</span>
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                          {m.relationship_type}
                        </span>
                        <span style={{
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-mono)',
                          color: m.status === 'active' ? 'var(--success)' : 'var(--warning)',
                          fontWeight: 700
                        }}>
                          {m.status.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    {sections.map(s => {
                      const hasPerm = m.role === 'owner' || m.permissions_json[s.key as keyof typeof m.permissions_json];
                      const isOwnerRow = m.role === 'owner';
                      const toggleKey = `${m.id}-${s.key}`;
                      const justToggled = recentlyToggled === toggleKey;

                      return (
                        <td key={s.key} style={{ padding: '0.75rem 0.4rem', textAlign: 'center' }}>
                          <button
                            disabled={!isOwner || isOwnerRow}
                            onClick={() => handlePermissionClick(m.id, m.name, s.key, s.label, hasPerm)}
                            className={`neu-btn ${justToggled ? 'perm-toggled' : ''}`}
                            style={{
                              width: '36px',
                              height: '36px',
                              padding: 0,
                              borderRadius: 'var(--radius-md)',
                              color: hasPerm ? 'var(--success)' : 'var(--danger)',
                              boxShadow: hasPerm ? 'var(--neu-shadow-btn)' : 'var(--neu-shadow-inset)',
                              background: hasPerm ? '#ecfdf5' : '#fff1f2',
                              cursor: isOwner && !isOwnerRow ? 'pointer' : 'default',
                              opacity: isOwnerRow ? 0.6 : 1,
                              transition: 'all 0.2s ease',
                              border: hasPerm ? '1px solid rgba(0, 166, 61, 0.2)' : '1px solid rgba(225, 29, 72, 0.15)'
                            }}
                            title={
                              isOwnerRow
                                ? 'Owner has full access'
                                : hasPerm
                                  ? `Click to revoke ${s.label} access`
                                  : `Click to grant ${s.label} access`
                            }
                          >
                            {hasPerm ? <Check size={16} /> : <X size={16} />}
                          </button>
                        </td>
                      );
                    })}
                    <td style={{ padding: '0.75rem 0.4rem', textAlign: 'center' }}>
                      {m.role !== 'owner' && (
                        <button
                          onClick={() => toggleMemberExpand(m.id)}
                          className="neu-btn"
                          style={{ width: '36px', height: '36px', padding: 0, borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}
                          title="View permission details"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Detail Row */}
                  {isExpanded && m.role !== 'owner' && (
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.6)' }}>
                      <td colSpan={sections.length + 3} style={{ padding: '0 0.85rem 1rem 0.85rem' }}>
                        <div className="neu-inset" style={{ padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                              Permission Details — {m.name}
                            </div>
                            <span style={{
                              fontSize: '0.72rem',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 700,
                              color: permCount === totalSections ? 'var(--success)' : permCount === 0 ? 'var(--danger)' : 'var(--warning)'
                            }}>
                              {permCount}/{totalSections} SECTIONS
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div style={{
                            height: '6px',
                            background: 'var(--surface)',
                            borderRadius: 'var(--radius-full)',
                            overflow: 'hidden',
                            boxShadow: 'var(--neu-shadow-inset)',
                            border: '1px solid rgba(255, 255, 255, 0.6)',
                            padding: '1px',
                            marginBottom: '1rem'
                          }}>
                            <div style={{
                              width: `${(permCount / totalSections) * 100}%`,
                              height: '100%',
                              background: permCount === totalSections ? 'var(--success)' : 'var(--warning)',
                              borderRadius: 'var(--radius-full)',
                              transition: 'width 0.4s ease'
                            }} />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                            {sections.map(s => {
                              const hasPerm = m.permissions_json[s.key as keyof typeof m.permissions_json];
                              return (
                                <div
                                  key={s.key}
                                  className="neu-card-sm"
                                  style={{
                                    padding: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    borderLeft: `3px solid ${hasPerm ? 'var(--success)' : 'var(--danger)'}`
                                  }}
                                >
                                  <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: hasPerm ? '#ecfdf5' : '#fff1f2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: 'var(--neu-shadow-btn)'
                                  }}>
                                    {hasPerm
                                      ? <Unlock size={14} color="var(--success)" />
                                      : <Lock size={14} color="var(--danger)" />
                                    }
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                      {s.label}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                      {hasPerm ? 'Access Granted' : 'Access Restricted'}
                                    </div>
                                  </div>

                                  {isOwner && (
                                    <button
                                      onClick={() => handlePermissionClick(m.id, m.name, s.key, s.label, hasPerm)}
                                      className="neu-btn"
                                      style={{
                                        marginLeft: 'auto',
                                        fontSize: '0.72rem',
                                        padding: '0.35rem 0.65rem',
                                        color: hasPerm ? 'var(--danger)' : 'var(--success)',
                                        fontWeight: 700
                                      }}
                                    >
                                      {hasPerm ? 'Revoke' : 'Grant'}
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Permission Confirmation Dialog */}
      {confirmAction && (
        <div className="confirm-overlay" onClick={() => setConfirmAction(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                background: confirmAction.currentValue ? '#fff1f2' : '#ecfdf5',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--neu-shadow-btn)',
                marginBottom: '0.85rem'
              }}>
                {confirmAction.currentValue
                  ? <ShieldAlert size={24} color="var(--danger)" />
                  : <ShieldCheck size={24} color="var(--success)" />
                }
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                {confirmAction.currentValue ? 'Revoke Access' : 'Grant Access'}
              </h3>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {confirmAction.currentValue
                  ? <>Are you sure you want to <strong style={{ color: 'var(--danger)' }}>revoke</strong> <strong>{confirmAction.memberName}'s</strong> access to the <strong>{confirmAction.sectionLabel}</strong> section?</>
                  : <>Are you sure you want to <strong style={{ color: 'var(--success)' }}>grant</strong> <strong>{confirmAction.memberName}</strong> access to the <strong>{confirmAction.sectionLabel}</strong> section?</>
                }
              </p>
            </div>

            {/* Impact Notice */}
            <div className="neu-inset" style={{
              padding: '0.75rem',
              marginBottom: '1.25rem',
              fontSize: '0.78rem',
              color: 'var(--text-main)',
              borderLeft: `3px solid ${confirmAction.currentValue ? 'var(--danger)' : 'var(--success)'}`
            }}>
              {confirmAction.currentValue
                ? <>
                    <strong>Impact:</strong> {confirmAction.memberName} will immediately lose the ability to view or interact with the {confirmAction.sectionLabel} section.
                    {confirmAction.sectionKey === 'vault' && ' All encrypted vault entries will become inaccessible.'}
                    {confirmAction.sectionKey === 'audit' && ' Compliance audit trail will be hidden from this member.'}
                  </>
                : <>
                    <strong>Impact:</strong> {confirmAction.memberName} will gain access to the {confirmAction.sectionLabel} section effective immediately.
                    {confirmAction.sectionKey === 'vault' && ' They will be able to view encrypted vault secrets.'}
                    {confirmAction.sectionKey === 'audit' && ' They will see all security audit events.'}
                  </>
              }
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button
                onClick={() => setConfirmAction(null)}
                className="neu-btn"
              >
                Cancel
              </button>
              <button
                onClick={confirmPermissionChange}
                className={confirmAction.currentValue ? 'neu-btn-danger' : 'neu-btn-primary'}
              >
                {confirmAction.currentValue ? 'Revoke Access' : 'Grant Access'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '460px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Invite Family Member
            </h3>
            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Geeta Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="geeta@estate.demo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Relationship</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spouse / Sibling"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    style={{ width: '100%' }}
                  >
                    <option value="family_member">Family Member</option>
                    <option value="executor">Co-Executor</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
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
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
