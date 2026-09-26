import React from 'react';
import { ShieldCheck, User, Cpu } from 'lucide-react';

interface NavbarProps {
  currentUser: any;
  onSwitchUserRole: (role: 'owner' | 'family') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onSwitchUserRole }) => {
  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.85rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Brand & TEE Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #38bdf8 0%, #10b981 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
        }}>
          <ShieldCheck size={22} color="#090d16" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.2 }}>
            Digital Estate <span style={{ color: '#38bdf8', fontWeight: 400 }}>Assistant</span>
          </h1>
          <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            "Don't leave your family a scavenger hunt."
          </p>
        </div>
      </div>

      {/* TEE Enclave Security Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="badge-tee" style={{
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <Cpu size={14} className="animate-tee-pulse" />
          <span>TEE Protected Enclave: Active (SGX)</span>
        </div>

        {/* Demo Switch User Role Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '2px'
        }}>
          <button
            onClick={() => onSwitchUserRole('owner')}
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '16px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: currentUser?.role === 'owner' ? '#38bdf8' : 'transparent',
              color: currentUser?.role === 'owner' ? '#090d16' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            Owner View
          </button>
          <button
            onClick={() => onSwitchUserRole('family')}
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '16px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: currentUser?.role === 'family_member' ? '#10b981' : 'transparent',
              color: currentUser?.role === 'family_member' ? '#090d16' : '#94a3b8',
              transition: 'all 0.2s'
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
          background: 'rgba(255,255,255,0.05)',
          padding: '0.35rem 0.75rem',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <User size={16} color="#38bdf8" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>
            {currentUser?.full_name || 'Rajesh Sharma'}
          </span>
        </div>
      </div>
    </header>
  );
};
