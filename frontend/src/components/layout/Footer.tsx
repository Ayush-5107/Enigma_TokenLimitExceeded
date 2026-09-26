import React from 'react';
import { Shield, Cpu, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      background: 'var(--surface)',
      borderTop: '1px solid rgba(255, 255, 255, 0.8)',
      boxShadow: '0 -4px 12px rgba(182, 192, 206, 0.25)',
      padding: '1rem 1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem',
      fontSize: '0.76rem'
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Shield size={14} color="#ffffff" />
        </div>
        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
          VIRASAT <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>विरासत</span>
        </span>
      </div>

      {/* Center */}
      <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <span>© 2026 Team Enigma</span>
        <span style={{ margin: '0 0.25rem' }}>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          Built with <Heart size={11} color="var(--danger)" fill="var(--danger)" /> for Indian Families
        </span>
      </div>

      {/* Right */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem'
      }}>
        <span className="badge-tee" style={{
          padding: '0.2rem 0.6rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.68rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <Cpu size={11} color="var(--primary)" />
          Vault Protected
        </span>
        <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          Privacy Protected
        </span>
      </div>
    </footer>
  );
};
