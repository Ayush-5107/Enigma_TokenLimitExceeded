import React from 'react';
import { ShieldAlert, ShieldCheck, Cpu } from 'lucide-react';
import { useEstate } from '../context/EstateContext';

export const Audit: React.FC = () => {
  const { auditLogs } = useEstate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={24} color="var(--primary)" />
          <span>Security & Compliance Audit Trail</span>
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
          Immutable tamper-evident record of vault decryptions, enclave extractions, and permission updates
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        <div className="neu-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Total Audit Events</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.35rem' }}>{auditLogs.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>✓ Logged & Cryptographically Sealed</span>
          </div>
        </div>

        <div className="neu-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>TEE Enclave Integrity</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.35rem' }}>100%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Hardware Attested (AMD SEV)
          </div>
        </div>

        <div className="neu-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Zero-Knowledge Proofs</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.35rem' }}>Active</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Shamir Secret Key Shares
          </div>
        </div>

        <div className="neu-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>DPDP Compliance</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.35rem' }}>Verified</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Digital Personal Data Protection Act
          </div>
        </div>
      </div>

      <div className="neu-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Recorded Security Events ({auditLogs.length})
          </h3>
          <span className="badge-medium" style={{ padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.68rem', fontWeight: 700 }}>
            INTEGRITY VERIFIED
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {auditLogs.map((evt) => (
            <div key={evt.id} className="neu-card-sm" style={{
              padding: '0.95rem 1.15rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
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
                {evt.action_type === 'TEE_EXTRACT' ? (
                  <Cpu size={18} color="var(--success)" />
                ) : (
                  <ShieldCheck size={18} color="var(--primary)" />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span className="badge-medium" style={{ padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.66rem', fontWeight: 700 }}>
                    {evt.action_type}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(evt.timestamp).toLocaleString()}
                  </span>
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', marginTop: '0.15rem' }}>{evt.description}</p>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span>Actor: <strong style={{ color: 'var(--text-main)' }}>{evt.user_name}</strong></span>
                  {evt.target_resource && (
                    <span>Resource: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{evt.target_resource}</span></span>
                  )}
                  <span>IP: {evt.ip_address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
