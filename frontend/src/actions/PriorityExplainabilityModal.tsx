import React from 'react';
import { HelpCircle, ShieldAlert, X, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { ActionItem } from '../types';

interface PriorityExplainabilityModalProps {
  action: ActionItem;
  onClose: () => void;
}

export const PriorityExplainabilityModal: React.FC<PriorityExplainabilityModalProps> = ({ action, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(9, 13, 22, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1.5rem'
    }}>
      <div className="neu-card" style={{ maxWidth: '540px', width: '100%', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
              <TrendingUp size={22} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Priority Explainability Breakdown
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem', fontFamily: 'var(--font-mono)' }}>
                Action: {action.title}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="neu-inset" style={{ padding: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>PRIORITY ENGINE SCORE</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
              {action.priority_score} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
          </div>
          <span style={{
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: 700,
            background: '#fee2e2',
            color: '#991b1b',
            fontFamily: 'var(--font-mono)'
          }}>
            {action.urgency}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
          <div className="neu-card" style={{ padding: '0.85rem 1rem', background: 'var(--surface)' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <Calendar size={14} color="var(--primary)" />
              1. Financial Loss Prevention (EMI Interest Accrual)
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Delays in informing the lender trigger monthly auto-debit bounces or high penalty interest. Immediate notice stops compounding charges.
            </p>
          </div>

          <div className="neu-card" style={{ padding: '0.85rem 1rem', background: 'var(--surface)' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <ShieldAlert size={14} color="var(--warning)" />
              2. Credit Shield Insurance Coverage Window
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              The policy features a 90-day post-demise claim window. Submitting the claim early ensures full principal waiver by the insurer.
            </p>
          </div>
        </div>

        <button onClick={onClose} className="neu-btn-primary" style={{ width: '100%', padding: '0.7rem' }}>
          Got It
        </button>
      </div>
    </div>
  );
};
