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
    } catch (e) {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldAlert size={24} color="#38bdf8" />
          <span>Security & Audit Trail Log</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
          Immutable timeline recording sensitive vault access, document uploads, TEE enclave extraction, and permission updates.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', marginBottom: '1rem' }}>
          Audit Event History
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {events.map((evt) => (
            <div key={evt.id} style={{
              padding: '1rem',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: evt.action_type === 'TEE_EXTRACT' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {evt.action_type === 'TEE_EXTRACT' ? <Cpu size={18} color="#10b981" /> : <ShieldCheck size={18} color="#38bdf8" />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <span className="badge-medium" style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
                    {evt.action_type}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {new Date(evt.timestamp).toLocaleString()}
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#f8fafc', marginTop: '0.2rem' }}>{evt.description}</p>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.3rem', display: 'flex', gap: '1rem' }}>
                  <span>Actor: <strong style={{ color: '#cbd5e1' }}>{evt.user_name}</strong></span>
                  {evt.target_resource && <span>Target: <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{evt.target_resource}</span></span>}
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
