import React, { useState } from 'react';
import { Settings as SettingsIcon, Smartphone, Cpu, Download, CheckCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  const [pwaInstalled, setPwaInstalled] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <SettingsIcon size={26} color="var(--primary)" />
          <span>System Settings & TEE Attestation</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Mobile-first PWA configuration, confidential computing enclave verification, and encryption management.
        </p>
      </div>

      {/* PWA Section */}
      <div className="neu-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface)',
              boxShadow: 'var(--neu-shadow-btn)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Smartphone size={24} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Progressive Web App (PWA) Installability
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Install on Mobile or Desktop home screen for biometric authentication and offline resilience.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPwaInstalled(true)}
            className={pwaInstalled ? 'neu-btn' : 'neu-btn-primary'}
            style={{ color: pwaInstalled ? 'var(--success)' : '#ffffff' }}
          >
            {pwaInstalled ? <CheckCircle size={16} /> : <Download size={16} />}
            <span>{pwaInstalled ? 'PWA Ready / Installed' : 'Install App to Home Screen'}</span>
          </button>
        </div>
      </div>

      {/* TEE Attestation Verification Card */}
      <div className="neu-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface)',
              boxShadow: 'var(--neu-shadow-btn)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cpu size={24} color="var(--success)" className="animate-tee-pulse" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                TEE Hardware Attestation Certificate
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Hardware enclave identity & cryptographic memory measurement verification.
              </p>
            </div>
          </div>
          <span className="badge-tee" style={{ padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
            STATUS: ATTESTED_VALID (SGX)
          </span>
        </div>

        {/* Cryptographic Measurement Inset Well */}
        <div className="neu-inset" style={{
          padding: '1.25rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.82rem',
          color: 'var(--text-main)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          wordBreak: 'break-all'
        }}>
          <div><strong>Enclave ID:</strong> <span style={{ color: 'var(--primary)' }}>enclave-sgx-fintech-01</span></div>
          <div><strong>Security Version:</strong> ISV_SVN_2</div>
          <div><strong>MR_ENCLAVE:</strong> 7e4b901a8c90321ef9a87123490182c19a8fbc09</div>
          <div><strong>MR_SIGNER:</strong> a3f8c901e4b8120d9f82d1c071239845</div>
          <div><strong>Attestation Root:</strong> Intel SGX DCAP Quote Verifier (Root CA)</div>
          <div><strong>Custom NER Pipeline Version:</strong> v1.4.0-custom-fintech</div>
        </div>
      </div>
    </div>
  );
};
