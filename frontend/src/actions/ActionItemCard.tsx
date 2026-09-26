import React from 'react';
import { AlertTriangle, Clock, CheckCircle2, UserPlus, HelpCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { ActionItem } from '../types';

interface ActionItemCardProps {
  action: ActionItem;
  onExplainPriority: (action: ActionItem) => void;
  onAssignTask: (action: ActionItem) => void;
  onUpdateStatus: (actionId: string, status: ActionItem['status']) => void;
}

export const ActionItemCard: React.FC<ActionItemCardProps> = ({
  action,
  onExplainPriority,
  onAssignTask,
  onUpdateStatus
}) => {
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'URGENT': return { label: 'Urgent Action', bg: '#fee2e2', color: '#991b1b' };
      case 'HIGH': return { label: 'High Priority', bg: '#ffedd5', color: '#9a3412' };
      case 'MEDIUM': return { label: 'Medium Priority', bg: '#fef3c7', color: '#92400e' };
      default: return { label: 'Standard', bg: '#f1f5f9', color: '#475569' };
    }
  };

  const badge = getUrgencyBadge(action.urgency);

  return (
    <div className="neu-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 700,
            background: badge.bg,
            color: badge.color,
            fontFamily: 'var(--font-mono)'
          }}>
            {badge.label}
          </span>
          <button
            onClick={() => onExplainPriority(action)}
            style={{
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--surface)',
              boxShadow: 'var(--neu-shadow-btn)',
              border: 'none',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <HelpCircle size={12} />
            Explain Score ({action.priority_score}/100)
          </button>
        </div>

        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Clock size={13} />
          Due: {action.due_date}
        </span>
      </div>

      <div>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          {action.title}
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.4 }}>
          {action.priority_reason}
        </p>
      </div>

      {action.required_documents.length > 0 && (
        <div className="neu-inset" style={{ padding: '0.65rem 0.85rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.25rem' }}>
            REQUIRED DOCUMENTS & EVIDENCE
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {action.required_documents.map((doc, i) => (
              <span key={i} style={{ padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', fontSize: '0.72rem', color: 'var(--text-main)', fontWeight: 600 }}>
                {doc}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem' }}>
        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          Assigned to: <strong style={{ color: 'var(--primary)' }}>{action.assigned_to || 'Unassigned'}</strong>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onAssignTask(action)}
            className="neu-card"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <UserPlus size={13} color="var(--primary)" />
            <span>Assign</span>
          </button>

          {action.status !== 'COMPLETED' ? (
            <button
              onClick={() => onUpdateStatus(action.id, 'COMPLETED')}
              className="neu-btn-primary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.74rem' }}
            >
              <CheckCircle2 size={13} />
              <span>Mark Done</span>
            </button>
          ) : (
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={14} /> Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
