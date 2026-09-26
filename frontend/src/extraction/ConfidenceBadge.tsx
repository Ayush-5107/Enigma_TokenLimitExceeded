import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface ConfidenceBadgeProps {
  score: number; // 0 to 1 or 0 to 100
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score }) => {
  const percentage = score <= 1 ? Math.round(score * 100) : Math.round(score);

  if (percentage >= 85) {
    return (
      <span style={{
        padding: '0.2rem 0.55rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.72rem',
        fontWeight: 700,
        background: '#dcfce7',
        color: '#15803d',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        fontFamily: 'var(--font-mono)'
      }}>
        <CheckCircle2 size={12} />
        {percentage}% High Confidence
      </span>
    );
  }

  if (percentage >= 60) {
    return (
      <span style={{
        padding: '0.2rem 0.55rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.72rem',
        fontWeight: 700,
        background: '#fef3c7',
        color: '#b45309',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        fontFamily: 'var(--font-mono)'
      }}>
        <AlertTriangle size={12} />
        {percentage}% Needs Review
      </span>
    );
  }

  return (
    <span style={{
      padding: '0.2rem 0.55rem',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.72rem',
      fontWeight: 700,
      background: '#fee2e2',
      color: '#b91c1c',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      fontFamily: 'var(--font-mono)'
    }}>
      <HelpCircle size={12} />
      {percentage}% Low Confidence
    </span>
  );
};
