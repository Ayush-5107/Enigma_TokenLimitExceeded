import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { FamilyMember } from '../types';

interface PermissionsMatrixProps {
  members: FamilyMember[];
  onTogglePermission: (memberId: string, section: keyof FamilyMember['section_permissions']) => void;
}

export const PermissionsMatrix: React.FC<PermissionsMatrixProps> = ({ members, onTogglePermission }) => {
  const sections: { key: keyof FamilyMember['section_permissions']; label: string }[] = [
    { key: 'estate', label: 'Estate Inventory' },
    { key: 'vault', label: 'Legacy Vault (Wills)' },
    { key: 'documents', label: 'Documents & TEE' },
    { key: 'actions', label: 'Action Engine' },
    { key: 'audit', label: 'Audit Logs' }
  ];

  return (
    <div className="neu-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Least-Privilege Section Access Control
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
          Grant granular section access to family members and legal counsel without exposing private vault credentials.
        </p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid rgba(0, 102, 102, 0.15)' }}>
            <th style={{ padding: '0.75rem', fontSize: '0.76rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>MEMBER</th>
            <th style={{ padding: '0.75rem', fontSize: '0.76rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>ROLE</th>
            {sections.map((s) => (
              <th key={s.key} style={{ padding: '0.75rem', fontSize: '0.72rem', color: 'var(--text-dim)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <td style={{ padding: '0.85rem 0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>{m.full_name}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{m.email}</div>
              </td>
              <td style={{ padding: '0.85rem 0.75rem' }}>
                <span style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: m.access_role === 'owner' ? '#e0f2fe' : '#f1f5f9',
                  color: m.access_role === 'owner' ? '#0369a1' : '#334155',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {m.relationship}
                </span>
              </td>
              {sections.map((s) => {
                const isGranted = m.section_permissions[s.key];
                return (
                  <td key={s.key} style={{ padding: '0.85rem 0.75rem', textAlign: 'center' }}>
                    <button
                      onClick={() => onTogglePermission(m.id, s.key)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem'
                      }}
                      title={`Toggle ${s.label} for ${m.full_name}`}
                    >
                      {isGranted ? (
                        <CheckCircle2 size={18} color="var(--success)" />
                      ) : (
                        <XCircle size={18} color="var(--text-dim)" />
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
