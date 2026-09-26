import React from 'react';
import { Activity, ShieldCheck, Clock, RefreshCw, AlertTriangle } from 'lucide-react';

interface DeadManSwitchProps {
  lastHeartbeat: string;
  inactivityThresholdDays: number;
  onSendHeartbeat: () => void;
}

export const DeadManSwitchCard: React.FC<DeadManSwitchProps> = ({
  lastHeartbeat,
  inactivityThresholdDays,
  onSendHeartbeat
}) => {
  return (
    <div className="neu-card" style={{ padding: '1.5rem', background: 'var(--surface)', borderLeft: '4px solid var(--primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface)',
            boxShadow: 'var(--neu-shadow-btn)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={22} color="var(--primary)" className="animate-tee-pulse" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Dead-Man's-Switch Safeguard
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Automated encrypted release trigger upon extended inactivity ({inactivityThresholdDays} days).
            </p>
          </div>
        </div>

        <button
          onClick={onSendHeartbeat}
          className="neu-btn-primary"
          style={{ padding: '0.55rem 1.1rem', fontSize: '0.82rem' }}
        >
          <RefreshCw size={15} />
          <span>Confirm Heartbeat Now</span>
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginTop: '1.25rem'
      }}>
        <div className="neu-inset" style={{ padding: '0.85rem 1rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            LAST HEARTBEAT RECORDED
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} />
            <span>{lastHeartbeat}</span>
          </div>
        </div>

        <div className="neu-inset" style={{ padding: '0.85rem 1rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            INACTIVITY TRIGGER WINDOW
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={16} color="var(--primary)" />
            <span>{inactivityThresholdDays} Days Remaining</span>
          </div>
        </div>

        <div className="neu-inset" style={{ padding: '0.85rem 1rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            BENEFICIARY NOTIFICATION
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--warning)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertTriangle size={16} />
            <span>2 Nominees Pre-Configured</span>
          </div>
        </div>
      </div>
    </div>
  );
};
