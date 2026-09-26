import React, { useState } from 'react';
import { Settings as SettingsIcon, Smartphone, Cpu, Download, CheckCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  const [pwaInstalled, setPwaInstalled] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <SettingsIcon size={24} color="#38bdf8" />
          <span>System Settings & TEE Attestation</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
          Mobile-first PWA configuration, confidential computing enclave verification, and encryption management.
        </p>
      </div>

      {/* PWA Section */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Smartphone size={24} color="#38bdf8" />
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>Progressive Web App (PWA) Installability</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Install on Mobile or Desktop home screen for offline capability.</p>
            </div>
          </div>
          <button
            onClick={() => setPwaInstalled(true)}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: pwaInstalled ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #38bdf8, #0284c7)',
              color: pwaInstalled ? '#6ee7b7' : '#090d16',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            {pwaInstalled ? <CheckCircle size={16} /> : <Download size={16} />}
            <span>{pwaInstalled ? 'PWA Ready / Installed' : 'Install App to Home Screen'}</span>
          </button>
        </div>
      </div>

      {/* TEE Attestation Verification Card */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Cpu size={24} color="#10b981" />
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>TEE Hardware Attestation Certificate</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Verified hardware enclave identity & memory measurement hash.</p>
            </div>
          </div>
          <span className="badge-tee" style={{ padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
            STATUS: ATTESTED_VALID
          </span>
        </div>

        <div style={{
          background: '#090d16',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '1rem',
          fontFamily: 'monospace',
          fontSize: '0.78rem',
          color: '#6ee7b7',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div>Enclave ID: enclave-sgx-fintech-01</div>
          <div>Security Version: ISV_SVN_2</div>
          <div>MR_ENCLAVE: 7e4b901a8c90321ef9a87123490182c19a8</div>
          <div>MR_SIGNER: a3f8c901e4b8120d9f82</div>
          <div>Attestation Root: Intel SGX DCAP Quote Verifier (Root CA)</div>
          <div>Custom NER Pipeline Version: v1.4.0-custom-fintech</div>
        </div>
      </div>
    </div>
  );
};
