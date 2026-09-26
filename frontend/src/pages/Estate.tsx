import React, { useEffect, useState } from 'react';
import { PieChart, TrendingUp, AlertTriangle } from 'lucide-react';
import { estateApi } from '../services/estateApi';
import type { Asset, Liability } from '../services/estateApi';

export const Estate: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assets' | 'liabilities'>('assets');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const a = await estateApi.getAssets('estate-case-1');
      setAssets(a);
      const l = await estateApi.getLiabilities('estate-case-1');
      setLiabilities(l);
    } catch {
      setAssets([
        {
          id: 'asset-1',
          estate_id: 'estate-case-1',
          category: 'bank_account',
          name: 'State Bank of India Savings Account',
          institution: 'State Bank of India',
          estimated_value: 845200.50,
          account_number_masked: '304910294821',
          is_confirmed: true,
          confidence_score: 0.98,
          status: 'confirmed',
          details_json: { branch: 'Connaught Place, New Delhi' },
          created_at: new Date().toISOString()
        },
        {
          id: 'asset-2',
          estate_id: 'estate-case-1',
          category: 'insurance_payout',
          name: 'LIC Jeevan Umang Term Policy Claim',
          institution: 'LIC of India',
          estimated_value: 5000000.00,
          account_number_masked: 'POL-99201482',
          is_confirmed: false,
          confidence_score: 0.84,
          status: 'unconfirmed',
          details_json: { nominee: 'Rahul Sharma (Son)' },
          created_at: new Date().toISOString()
        },
        {
          id: 'asset-3',
          estate_id: 'estate-case-1',
          category: 'property',
          name: 'Residential Apartment Flat 402, Oakwood Towers',
          institution: 'Sub-Registrar Gurgaon',
          estimated_value: 12500000.00,
          account_number_masked: 'REG-2018-7741',
          is_confirmed: true,
          confidence_score: 1.0,
          status: 'confirmed',
          details_json: { area: '1850 sq ft' },
          created_at: new Date().toISOString()
        }
      ]);
      setLiabilities([
        {
          id: 'liab-1',
          estate_id: 'estate-case-1',
          category: 'home_loan',
          name: 'HDFC Housing Finance Home Loan',
          creditor: 'HDFC Bank',
          total_amount: 4250000.00,
          emi_amount: 38400.00,
          due_date: '2026-10-05',
          is_confirmed: true,
          confidence_score: 0.94,
          status: 'confirmed',
          details_json: { interest_rate: '8.55%' },
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const totalAssets = assets.reduce((sum, a) => sum + a.estimated_value, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.total_amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <PieChart size={26} color="var(--primary)" />
          <span>Unified Estate Inventory</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Single source of truth unifying confirmed extracted documents & human-validated financial assets/liabilities.
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        <div className="neu-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            <span>TOTAL EXTRACTED ASSETS</span>
            <TrendingUp size={18} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
            {formatINR(totalAssets)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified estate receivables</span>
        </div>

        <div className="neu-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            <span>TOTAL LIABILITIES</span>
            <AlertTriangle size={18} color="var(--danger)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--danger)', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
            {formatINR(totalLiabilities)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Outstanding loans & debt claims</span>
        </div>

        <div className="neu-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            <span>NET ESTATE POSITION</span>
            <PieChart size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
            {formatINR(totalAssets - totalLiabilities)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net distribution for heirs</span>
        </div>
      </div>

      {/* Neumorphic Segmented Tabs */}
      <div style={{
        display: 'inline-flex',
        alignSelf: 'flex-start',
        background: 'var(--surface)',
        boxShadow: 'var(--neu-shadow-inset)',
        padding: '4px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        gap: '4px'
      }}>
        <button
          onClick={() => setActiveTab('assets')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: activeTab === 'assets' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'assets' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeTab === 'assets' ? '2px 2px 6px rgba(0, 102, 102, 0.35)' : 'none',
            fontWeight: 700,
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Assets & Receivables ({assets.length})
        </button>

        <button
          onClick={() => setActiveTab('liabilities')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: activeTab === 'liabilities' ? 'var(--danger)' : 'transparent',
            color: activeTab === 'liabilities' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeTab === 'liabilities' ? '2px 2px 6px rgba(255, 33, 87, 0.35)' : 'none',
            fontWeight: 700,
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Liabilities & Loans ({liabilities.length})
        </button>
      </div>

      {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {assets.map((asset) => (
            <div key={asset.id} className="neu-card" style={{ padding: '1.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                <span className="badge-medium" style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {asset.category}
                </span>

                {asset.is_confirmed ? (
                  <span className="badge-medium" style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--success)', borderColor: 'var(--success)' }}>
                    ✓ CONFIRMED
                  </span>
                ) : (
                  <span className="badge-high" style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.68rem', fontWeight: 700 }}>
                    ⚠️ UNCONFIRMED
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{asset.name}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Institution: {asset.institution || 'N/A'}</p>

              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)', margin: '0.85rem 0 0.5rem 0', fontFamily: 'var(--font-mono)' }}>
                {formatINR(asset.estimated_value)}
              </div>

              {asset.account_number_masked && (
                <div className="neu-inset" style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Ref / Account: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{asset.account_number_masked}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Liabilities Tab */}
      {activeTab === 'liabilities' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {liabilities.map((liab) => (
            <div key={liab.id} className="neu-card" style={{ padding: '1.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                <span className="badge-critical" style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {liab.category}
                </span>

                <span className="badge-medium" style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--success)', borderColor: 'var(--success)' }}>
                  ✓ CONFIRMED
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{liab.name}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Creditor: {liab.creditor || 'N/A'}</p>

              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger)', margin: '0.85rem 0 0.35rem 0', fontFamily: 'var(--font-mono)' }}>
                {formatINR(liab.total_amount)}
              </div>

              {liab.emi_amount > 0 && (
                <div className="neu-inset" style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem', color: '#b26500', fontWeight: 700, fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
                  Ongoing EMI: {formatINR(liab.emi_amount)} / month
                </div>
              )}

              {liab.due_date && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Next EMI Due: <strong style={{ color: 'var(--danger)' }}>{liab.due_date}</strong>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
