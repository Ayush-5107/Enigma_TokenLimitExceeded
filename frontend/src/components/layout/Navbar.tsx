import React from 'react';
import { ShieldCheck, User, Cpu } from 'lucide-react';

interface NavbarProps {
  currentUser: { full_name: string; role: string; email: string };
  onSwitchUserRole: (role: 'owner' | 'family') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onSwitchUserRole }) => {
  return (
    <header style={{
      background: 'var(--surface)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.8)',
      boxShadow: '0 4px 12px rgba(182, 192, 206, 0.35), 0 -2px 6px #ffffff',
      padding: '0.75rem 1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Brand & Project Name VIRASAT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--neu-shadow-btn)',
          border: '1px solid rgba(255, 255, 255, 0.9)'
        }}>
          <ShieldCheck size={22} color="var(--primary)" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              VIRASAT
            </h1>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', opacity: 0.85 }}>
              Digital Estate Assistant
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem', letterSpacing: '-0.01em' }}>
            "Don't leave your family a scavenger hunt."
          </p>
        </div>
      </div>

      {/* TEE Enclave Security Badge & Role Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div className="badge-tee" style={{
          padding: '0.35rem 0.8rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.72rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          letterSpacing: '-0.01em'
        }}>
          <Cpu size={14} className="animate-tee-pulse" color="var(--primary)" />
          <span>TEE Enclave: Active (SGX Attested)</span>
        </div>

        {/* Demo Switch User Role Segmented Control (Neumorphic Inset Tray) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--surface)',
          boxShadow: 'var(--neu-shadow-inset)',
          borderRadius: 'var(--radius-full)',
          padding: '3px',
          border: '1px solid rgba(255, 255, 255, 0.6)'
        }}>
          <button
            onClick={() => onSwitchUserRole('owner')}
            style={{
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: currentUser?.role === 'owner' ? 'var(--primary)' : 'transparent',
              color: currentUser?.role === 'owner' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: currentUser?.role === 'owner' ? '2px 2px 6px rgba(0, 102, 102, 0.35)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Owner View
          </button>
          <button
            onClick={() => onSwitchUserRole('family')}
            style={{
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: currentUser?.role === 'family_member' ? 'var(--primary)' : 'transparent',
              color: currentUser?.role === 'family_member' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: currentUser?.role === 'family_member' ? '2px 2px 6px rgba(0, 102, 102, 0.35)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Family View
          </button>
        </div>

        {/* Profile Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--surface)',
          padding: '0.35rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--neu-shadow-btn)',
          border: '1px solid rgba(255, 255, 255, 0.85)'
        }}>
          <User size={15} color="var(--primary)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
            {currentUser?.full_name || 'Rajesh Sharma'}
          </span>
        </div>
      </div>
    </header>
  );
};
