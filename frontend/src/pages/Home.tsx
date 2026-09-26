import React, { useEffect, useState } from 'react';
import { PieChart, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, FileText } from 'lucide-react';
import { estateApi } from '../services/estateApi';
import type { EstateSummary } from '../services/estateApi';
import { actionApi } from '../services/actionApi';
import type { ActionItem } from '../services/actionApi';

interface HomeProps {
  onNavigate: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [summary, setSummary] = useState<EstateSummary | null>(null);
  const [urgentActions, setUrgentActions] = useState<ActionItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const sum = await estateApi.getSummary('estate-case-1');
      setSummary(sum);
      const actions = await actionApi.getActions('estate-case-1');
      setUrgentActions(actions.filter(a => a.priority === 'critical' || a.priority === 'high'));
    } catch {
      setSummary({
        estate_id: 'estate-case-1',
        title: 'Late Suresh Sharma Estate Closure',
        deceased_name: 'Suresh Sharma',
        total_asset_value: 18345200.50,
        total_liability_value: 4250000.00,
        net_estate_value: 14095200.50,
        unconfirmed_items_count: 1,
        pending_actions_count: 3,
        completed_actions_count: 1,
        total_actions_count: 4,
        closure_progress_percent: 25
      });
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Banner / Header */}
      <div className="neu-card" style={{ padding: '1.25rem 1.5rem', borderLeft: '5px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge-medium" style={{ padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.68rem', fontWeight: 700 }}>
                ACTIVE ESTATE CASE
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                CASE ID: estate-case-1
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {summary?.title || 'Late Suresh Sharma Estate Closure'}
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Deceased: <strong style={{ color: 'var(--text-main)' }}>{summary?.deceased_name || 'Suresh Sharma'}</strong> | Primary Executor: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Rajesh Sharma</span>
            </p>
          </div>
          <button 
            onClick={() => onNavigate('documents')}
            className="neu-btn-primary"
          >
            <FileText size={15} />
            <span>Upload Documents (TEE Protected)</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.15rem' }}>
        <div className="neu-card" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.02em' }}>
            <span>TOTAL EXTRACTED ASSETS</span>
            <TrendingUp size={16} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--success)', margin: '0.4rem 0 0.2rem 0', letterSpacing: '-0.03em' }}>
            {formatINR(summary?.total_asset_value || 18345200.50)}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bank accounts, insurance & properties</span>
        </div>

        <div className="neu-card" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.02em' }}>
            <span>TOTAL LIABILITIES</span>
            <AlertTriangle size={16} color="var(--danger)" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--danger)', margin: '0.4rem 0 0.2rem 0', letterSpacing: '-0.03em' }}>
            {formatINR(summary?.total_liability_value || 4250000.00)}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Home loan principal & EMI obligations</span>
        </div>

        <div className="neu-card" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.02em' }}>
            <span>NET ESTATE VALUE</span>
            <PieChart size={16} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary)', margin: '0.4rem 0 0.2rem 0', letterSpacing: '-0.03em' }}>
            {formatINR(summary?.net_estate_value || 14095200.50)}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Calculated net estate distribution</span>
        </div>

        <div className="neu-card" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.02em' }}>
            <span>CLOSURE PROGRESS</span>
            <CheckCircle size={16} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--warning)', margin: '0.4rem 0 0.2rem 0', letterSpacing: '-0.03em' }}>
            {summary?.closure_progress_percent || 25}%
          </div>
          {/* Neumorphic Inset Progress Well */}
          <div style={{
            height: '8px',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-full)',
            marginTop: '0.45rem',
            overflow: 'hidden',
            boxShadow: 'var(--neu-shadow-inset)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            padding: '1px'
          }}>
            <div style={{
              width: `${summary?.closure_progress_percent || 25}%`,
              height: '100%',
              background: 'var(--warning)',
              borderRadius: 'var(--radius-full)',
              boxShadow: '1px 1px 3px rgba(0,0,0,0.15)'
            }} />
          </div>
        </div>
      </div>

      {/* Unconfirmed Items Alert Banner */}
      {summary?.unconfirmed_items_count ? (
        <div className="neu-card" style={{
          padding: '1rem 1.25rem',
          borderLeft: '4px solid var(--warning)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
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
              <strong style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>Human Confirmation Required</strong>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                1 document extracted by TEE custom model contains low-confidence fields (LIC Term Policy Nominee). Confirm fields to promote into official estate inventory.
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('documents')}
            className="neu-btn"
            style={{ color: '#b45309' }}
          >
            Review Document
          </button>
        </div>
      ) : null}

      {/* Urgent Actions Section */}
      <div className="neu-card" style={{ padding: '1.35rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Urgent Closure Actions
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Explainable priority calculation based on daily financial exposure & deadlines
            </p>
          </div>
          <button 
            onClick={() => onNavigate('actions')}
            className="neu-btn"
            style={{ color: 'var(--primary)' }}
          >
            <span>View Full Action Plan</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {urgentActions.slice(0, 3).map((action) => (
            <div 
              key={action.id}
              className="neu-card-sm"
              style={{
                padding: '1rem 1.15rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.85rem'
              }}
            >
              <div style={{ maxWidth: '75%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className={`badge-${action.priority}`} style={{ padding: '0.12rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {action.priority} Priority (Score: {action.urgency_score})
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Due: {action.due_date}</span>
                </div>
                <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-main)' }}>{action.title}</h4>
                <div className="neu-inset" style={{ padding: '0.45rem 0.75rem', marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--text-main)' }}>
                  <strong style={{ color: 'var(--primary)' }}>WHY PRIORITIZED: </strong>
                  {action.priority_reason}
                </div>
              </div>

              <div>
                <button
                  onClick={() => onNavigate('actions')}
                  className="neu-btn"
                  style={{ color: 'var(--primary)' }}
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
