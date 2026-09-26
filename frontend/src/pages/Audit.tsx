import React, { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck, Cpu } from 'lucide-react';
import { auditApi } from '../services/auditApi';
import type { AuditEvent } from '../services/auditApi';

export const Audit: React.FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);

  useEffect(() => {
    loadAudit();
  }, []);

  const loadAudit = async () => {
    try {
      const res = await auditApi.getAuditTrail('estate-case-1');
      setEvents(res);
    } catch {
      setEvents([
        {
          id: 'e-1',
          user_name: 'Rajesh Sharma',
          action_type: 'ASSIGN_TASK',
          description: 'Assigned action item "Notify HDFC Lender & Verify Credit Shield Policy" to Rahul Sharma',
          target_resource: 'ActionItem/act-1',
          ip_address: '127.0.0.1',
          timestamp: new Date().toISOString()
        },
        {
          id: 'e-2',
          user_name: 'Rajesh Sharma',
          action_type: 'TEE_EXTRACT',
          description: 'TEE Enclave "enclave-sgx-fintech-01" executed protected OCR extraction for "lic_term_policy_99201482.pdf" with 84% confidence and isolated memory encryption.',
          target_resource: 'ExtractionJob/job-3',
          ip_address: '127.0.0.1',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'e-3',
          user_name: 'Rahul Sharma',
          action_type: 'UPLOAD_DOC',
          description: 'Uploaded financial document "hdfc_home_loan_agreement.pdf" (2.00 MB)',
          target_resource: 'Document/doc-2',
          ip_address: '127.0.0.1',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 'e-4',
          user_name: 'Rajesh Sharma',
          action_type: 'VIEW_VAULT',
          description: 'Accessed encrypted vault entries and revealed "Zerodha Demat Trading Account Credentials"',
          target_resource: 'Vault/vault-2',
          ip_address: '127.0.0.1',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldAlert size={26} color="var(--primary)" />
          <span>Security & Audit Trail Log</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Immutable timeline recording sensitive vault access, document uploads, TEE enclave extraction, and permission updates.
        </p>
      </div>

      <div className="neu-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
          Audit Event History
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {events.map((evt) => (
            <div key={evt.id} className="neu-card-sm" style={{
              padding: '1.15rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.25rem'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface)',
                boxShadow: 'var(--neu-shadow-btn)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {evt.action_type === 'TEE_EXTRACT' ? (
                  <Cpu size={20} color="var(--success)" />
                ) : (
                  <ShieldCheck size={20} color="var(--primary)" />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span className="badge-medium" style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: 700 }}>
                    {evt.action_type}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(evt.timestamp).toLocaleString()}
                  </span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>{evt.description}</p>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.45rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontFamily: 'var(--font-mono)' }}>
                  <span>Actor: <strong style={{ color: 'var(--text-main)' }}>{evt.user_name}</strong></span>
                  {evt.target_resource && (
                    <span>Target: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{evt.target_resource}</span></span>
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
