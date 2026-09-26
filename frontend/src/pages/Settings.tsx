import React, { useState } from 'react';
import { Settings as SettingsIcon, Smartphone, Cpu, Download, CheckCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  const [pwaInstalled, setPwaInstalled] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SettingsIcon size={24} color="var(--primary)" />
          <span>System Settings & TEE Attestation</span>
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
          Mobile-first PWA configuration and confidential enclave cryptographic verification
        </p>
      </div>

      {/* PWA Section */}
      <div className="neu-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
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
              <Smartphone size={22} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Progressive Web App (PWA)
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Install to Home Screen for offline access and local biometrics
              </p>
            </div>
          </div>
          <button
            onClick={() => setPwaInstalled(true)}
            className={pwaInstalled ? 'neu-btn' : 'neu-btn-primary'}
            style={{ color: pwaInstalled ? 'var(--success)' : '#ffffff', fontSize: '0.78rem' }}
          >
            {pwaInstalled ? <CheckCircle size={15} /> : <Download size={15} />}
            <span>{pwaInstalled ? 'PWA Installed' : 'Install to Home Screen'}</span>
          </button>
        </div>
      </div>

      {/* TEE Attestation Verification Card */}
      <div className="neu-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
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
              <Cpu size={22} color="var(--success)" className="animate-tee-pulse" />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>
                TEE Hardware Attestation Certificate
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Intel SGX remote attestation quote and cryptographic measurements
              </p>
            </div>
          </div>
          <span className="badge-tee" style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700 }}>
            ATTESTATION: VALID (SGX DCAP)
          </span>
        </div>

        {/* Cryptographic Measurement Inset Well */}
        <div className="neu-inset" style={{
          padding: '1rem 1.25rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.76rem',
          color: 'var(--text-main)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          wordBreak: 'break-all'
        }}>
          <div><strong>Enclave ID:</strong> <span style={{ color: 'var(--primary)' }}>enclave-sgx-fintech-01</span></div>
          <div><strong>Security SVN:</strong> ISV_SVN_2</div>
          <div><strong>MR_ENCLAVE:</strong> 7e4b901a8c90321ef9a87123490182c19a8fbc09</div>
          <div><strong>MR_SIGNER:</strong> a3f8c901e4b8120d9f82d1c071239845</div>
          <div><strong>Root CA:</strong> Intel SGX DCAP Quote Verifier Root CA</div>
          <div><strong>Pipeline Model:</strong> v1.4.0-custom-fintech-ner</div>
        </div>
      </div>
    </div>
  );
};
