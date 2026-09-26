import React from 'react';
import { ShieldCheck, Cpu, Eye, FileText, UserCheck } from 'lucide-react';
import type { AuditEvent } from '../types';

interface AuditTimelineProps {
  events: AuditEvent[];
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ events }) => {
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'TEE_EXTRACT': return Cpu;
      case 'VIEW_VAULT': return Eye;
      case 'CONFIRM_DATA': return FileText;
      case 'UPDATE_PERMISSION': return UserCheck;
      default: return ShieldCheck;
    }
  };

  return (
    <div className="neu-card" style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Immutable Security Audit Trail
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
          Tamper-evident, cryptographically chained event log for zero-trust compliance.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {events.map((ev) => {
          const Icon = getActionIcon(ev.action_type);
          const isSuccess = ev.status === 'SUCCESS';

          return (
            <div key={ev.id} className="neu-card" style={{ padding: '1rem 1.25rem', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface)',
                  boxShadow: 'var(--neu-shadow-btn)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={18} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {ev.action_type.replace(/_/g, ' ')}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      ({ev.resource_name})
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Triggered by <strong>{ev.actor_name}</strong> ({ev.actor_email})
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                <span style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  background: isSuccess ? '#dcfce7' : '#fee2e2',
                  color: isSuccess ? '#15803d' : '#b91c1c'
                }}>
                  {ev.status}
                </span>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                  {ev.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
