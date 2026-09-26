import React, { useState } from 'react';
import { PieChart, TrendingUp, AlertTriangle } from 'lucide-react';
import { useEstate } from '../context/EstateContext';

export const Estate: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assets' | 'liabilities'>('assets');
  const { assets, liabilities, totalAssetValue, totalLiabilityValue, netEstateValue } = useEstate();

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PieChart size={24} color="var(--primary)" />
          <span>Unified Estate Inventory</span>
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
          Consolidated inventory of confirmed assets and outstanding obligations
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.15rem' }}>
        <div className="neu-card" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700 }}>
            <span>TOTAL ASSETS ({assets.length})</span>
            <TrendingUp size={16} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.4rem', letterSpacing: '-0.02em' }}>
            {formatINR(totalAssetValue)}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Verified estate receivables</span>
        </div>

        <div className="neu-card" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700 }}>
            <span>TOTAL LIABILITIES ({liabilities.length})</span>
            <AlertTriangle size={16} color="var(--danger)" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--danger)', marginTop: '0.4rem', letterSpacing: '-0.02em' }}>
            {formatINR(totalLiabilityValue)}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Outstanding loans & debts</span>
        </div>

        <div className="neu-card" style={{ padding: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.74rem', fontWeight: 700 }}>
            <span>NET ESTATE VALUATION</span>
            <PieChart size={16} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary)', margin: '0.4rem 0 0.15rem 0', letterSpacing: '-0.02em' }}>
            {formatINR(netEstateValue)}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Available net inheritance</span>
        </div>
      </div>

      {/* Neumorphic Segmented Tabs */}
      <div style={{
        display: 'inline-flex',
        alignSelf: 'flex-start',
        background: 'var(--surface)',
        boxShadow: 'var(--neu-shadow-inset)',
        padding: '3px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        gap: '4px'
      }}>
        <button
          onClick={() => setActiveTab('assets')}
          style={{
            padding: '0.5rem 1.15rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: activeTab === 'assets' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'assets' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeTab === 'assets' ? '2px 2px 5px rgba(0, 102, 102, 0.35)' : 'none',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Assets & Receivables ({assets.length})
        </button>

        <button
          onClick={() => setActiveTab('liabilities')}
          style={{
            padding: '0.5rem 1.15rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: activeTab === 'liabilities' ? 'var(--danger)' : 'transparent',
            color: activeTab === 'liabilities' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeTab === 'liabilities' ? '2px 2px 5px rgba(225, 29, 72, 0.35)' : 'none',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Liabilities & Loans ({liabilities.length})
        </button>
      </div>

      {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.15rem' }}>
          {assets.map((asset) => (
            <div key={asset.id} className="neu-card" style={{ padding: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                <span className="badge-medium" style={{ padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.66rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {asset.category.replace('_', ' ')}
                </span>

                {asset.is_confirmed ? (
                  <span className="badge-medium" style={{ padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.66rem', fontWeight: 700, color: 'var(--success)' }}>
                    ✓ CONFIRMED
                  </span>
                ) : (
                  <span className="badge-high" style={{ padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.66rem', fontWeight: 700 }}>
                    ⚠️ UNCONFIRMED
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>{asset.name}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{asset.institution}</p>

              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--success)', margin: '0.65rem 0 0.4rem 0', letterSpacing: '-0.02em' }}>
                {formatINR(asset.estimated_value)}
              </div>

              {asset.account_number_masked && (
                <div className="neu-inset" style={{ padding: '0.35rem 0.65rem', fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Ref: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{asset.account_number_masked}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Liabilities Tab */}
      {activeTab === 'liabilities' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.15rem' }}>
          {liabilities.map((liab) => (
            <div key={liab.id} className="neu-card" style={{ padding: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                <span className="badge-critical" style={{ padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.66rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {liab.category.replace('_', ' ')}
                </span>

                <span className="badge-medium" style={{ padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.66rem', fontWeight: 700, color: 'var(--success)' }}>
                  ✓ CONFIRMED
                </span>
              </div>

              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>{liab.name}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Creditor: {liab.creditor}</p>

              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--danger)', margin: '0.65rem 0 0.35rem 0', letterSpacing: '-0.02em' }}>
                {formatINR(liab.total_amount)}
              </div>

              {liab.emi_amount > 0 && (
                <div className="neu-inset" style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem', color: '#b45309', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Ongoing EMI: {formatINR(liab.emi_amount)} / month
                </div>
              )}

              {liab.due_date && (
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Next Due: <strong style={{ color: 'var(--danger)' }}>{liab.due_date}</strong>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
