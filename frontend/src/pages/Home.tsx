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
    } catch (e) {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Banner / Header */}
      <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7))', borderLeft: '4px solid #38bdf8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span className="badge-medium" style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>ACTIVE ESTATE CASE</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: estate-case-1</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
              {summary?.title || 'Late Suresh Sharma Estate Closure'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Deceased: <strong style={{ color: '#f8fafc' }}>{summary?.deceased_name || 'Suresh Sharma'}</strong> | Primary Executor: <span style={{ color: '#38bdf8' }}>Rajesh Sharma</span>
            </p>
          </div>
          <button 
            onClick={() => onNavigate('documents')}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
              color: '#090d16',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)'
            }}
          >
            <FileText size={16} />
            <span>Upload Documents (TEE Protected)</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem' }}>
            <span>Total Extracted Assets</span>
            <TrendingUp size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#10b981', margin: '0.5rem 0 0.2rem 0' }}>
            {formatINR(summary?.total_asset_value || 18345200.50)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Bank accounts, insurance, property & investments</span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem' }}>
            <span>Total Outstanding Liabilities</span>
            <AlertTriangle size={18} color="#f43f5e" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f43f5e', margin: '0.5rem 0 0.2rem 0' }}>
            {formatINR(summary?.total_liability_value || 4250000.00)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Home loan principal & ongoing EMI obligations</span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem' }}>
            <span>Net Estate Valuation</span>
            <PieChart size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#38bdf8', margin: '0.5rem 0 0.2rem 0' }}>
            {formatINR(summary?.net_estate_value || 14095200.50)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Estimated net distribution to beneficiaries</span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem' }}>
            <span>Closure Plan Progress</span>
            <CheckCircle size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f59e0b', margin: '0.5rem 0 0.2rem 0' }}>
            {summary?.closure_progress_percent || 25}%
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ width: `${summary?.closure_progress_percent || 25}%`, height: '100%', background: '#f59e0b' }} />
          </div>
        </div>
      </div>

      {/* Unconfirmed Items Alert Banner */}
      {summary?.unconfirmed_items_count ? (
        <div className="glass-card" style={{ padding: '1rem 1.25rem', background: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={22} color="#f59e0b" />
            <div>
              <strong style={{ color: '#fcd34d', fontSize: '0.92rem' }}>Human Confirmation Required</strong>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                1 document extracted by TEE model contains low-confidence fields (LIC Term Policy Nominee). Confirm fields to promote into official estate inventory.
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('documents')}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#fcd34d',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Review Document
          </button>
        </div>
      ) : null}

      {/* Urgent Actions Section */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc' }}>
            Urgent Closure Actions (Explainable Priority)
          </h3>
          <button 
            onClick={() => onNavigate('actions')}
            style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <span>View All Action Plan</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {urgentActions.slice(0, 3).map((action) => (
            <div 
              key={action.id}
              style={{
                padding: '1rem',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ maxWidth: '75%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                  <span className={`badge-${action.priority}`} style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {action.priority} Priority (Score: {action.urgency_score})
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Due: {action.due_date}</span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>{action.title}</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  <strong style={{ color: '#cbd5e1' }}>Why Prioritized:</strong> {action.priority_reason}
                </p>
              </div>

              <div>
                <button
                  onClick={() => onNavigate('actions')}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: '#38bdf8',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
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
