import React from 'react';
import { PieChart, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, FileText } from 'lucide-react';
import { useEstate } from '../context/EstateContext';

interface HomeProps {
  onNavigate: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const {
    totalAssetValue,
    totalLiabilityValue,
    netEstateValue,
    unconfirmedCount,
    closureProgressPercent,
    actions
  } = useEstate();

  const urgentActions = actions.filter(a => a.priority === 'critical' || a.priority === 'high');

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Active Estate Case Card */}
      <div className="neu-card" style={{ padding: '1.25rem 1.5rem', borderLeft: '5px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge-medium" style={{ padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.68rem', fontWeight: 700 }}>
                ACTIVE CASE #101
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Executor: <strong style={{ color: 'var(--text-main)' }}>Rajesh Sharma</strong>
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Late Suresh Sharma Estate Closure
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Deceased: <strong style={{ color: 'var(--text-main)' }}>Suresh Sharma</strong> · Family Closure & Liquidation Plan
            </p>
          </div>
          <button 
            onClick={() => onNavigate('documents')}
            className="neu-btn-primary"
          >
            <FileText size={15} />
            <span>Upload Documents</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.15rem' }}>
        <div className="neu-card" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700 }}>
            <span>EXTRACTED ASSETS</span>
            <TrendingUp size={16} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--success)', margin: '0.4rem 0 0.15rem 0', letterSpacing: '-0.02em' }}>
            {formatINR(totalAssetValue)}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bank, insurance, property & demat</span>
        </div>

        <div className="neu-card" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700 }}>
            <span>LIABILITIES & DEBT</span>
            <AlertTriangle size={16} color="var(--danger)" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--danger)', margin: '0.4rem 0 0.15rem 0', letterSpacing: '-0.02em' }}>
            {formatINR(totalLiabilityValue)}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Home loan principal & card balances</span>
        </div>

        <div className="neu-card" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700 }}>
            <span>NET ESTATE VALUATION</span>
            <PieChart size={16} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary)', margin: '0.4rem 0 0.15rem 0', letterSpacing: '-0.02em' }}>
            {formatINR(netEstateValue)}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Net distribution for heirs</span>
        </div>

        <div className="neu-card" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700 }}>
            <span>CLOSURE PROGRESS</span>
            <CheckCircle size={16} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--warning)', margin: '0.4rem 0 0.15rem 0', letterSpacing: '-0.02em' }}>
            {closureProgressPercent}%
          </div>
          <div style={{
            height: '7px',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-full)',
            marginTop: '0.4rem',
            overflow: 'hidden',
            boxShadow: 'var(--neu-shadow-inset)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            padding: '1px'
          }}>
            <div style={{
              width: `${closureProgressPercent}%`,
              height: '100%',
              background: 'var(--warning)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Unconfirmed Items Alert Banner */}
      {unconfirmedCount > 0 && (
        <div className="neu-card" style={{
          padding: '0.9rem 1.25rem',
          borderLeft: '4px solid var(--warning)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              background: '#fffbeb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--neu-shadow-btn)',
              flexShrink: 0
            }}>
              <AlertTriangle size={18} color="var(--warning)" />
            </div>
            <div>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>Human Verification Pending</strong>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                {unconfirmedCount} document extracted in TEE has low-confidence fields. Review to promote to inventory.
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('documents')}
            className="neu-btn"
            style={{ color: '#b45309', fontSize: '0.78rem' }}
          >
            Review Document
          </button>
        </div>
      )}

      {/* Urgent Actions Section */}
      <div className="neu-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Urgent Closure Actions
            </h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Prioritized by daily financial penalty risk and statutory claim deadlines
            </p>
          </div>
          <button 
            onClick={() => onNavigate('actions')}
            className="neu-btn"
            style={{ color: 'var(--primary)', fontSize: '0.78rem' }}
          >
            <span>View All ({actions.length})</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {urgentActions.slice(0, 3).map((action) => (
            <div 
              key={action.id}
              className="neu-card-sm"
              style={{
                padding: '0.95rem 1.15rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ flex: '1 1 400px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span className={`badge-${action.priority}`} style={{ padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-sm)', fontSize: '0.66rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {action.priority} (Score: {action.urgency_score})
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Due: {action.due_date}</span>
                </div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>{action.title}</h4>
                <div className="neu-inset" style={{ padding: '0.4rem 0.65rem', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-main)' }}>
                  <strong style={{ color: 'var(--primary)' }}>Reason: </strong>
                  {action.priority_reason}
                </div>
              </div>

              <div>
                <button
                  onClick={() => onNavigate('actions')}
                  className="neu-btn"
                  style={{ color: 'var(--primary)', fontSize: '0.78rem' }}
                >
                  Manage Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
