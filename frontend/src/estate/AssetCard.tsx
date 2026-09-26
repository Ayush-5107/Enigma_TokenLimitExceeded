import React from 'react';
import { Building2, Shield, Landmark, Car, HelpCircle, FileCheck2, AlertCircle } from 'lucide-react';
import { AssetRecord } from '../types';

interface AssetCardProps {
  asset: AssetRecord;
  onEdit?: (asset: AssetRecord) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onEdit }) => {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'BANK_ACCOUNT': return Landmark;
      case 'INSURANCE': return Shield;
      case 'REAL_ESTATE': return Building2;
      case 'VEHICLE': return Car;
      default: return Landmark;
    }
  };

  const Icon = getCategoryIcon(asset.category);

  return (
    <div className="neu-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface)',
            boxShadow: 'var(--neu-shadow-btn)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={20} color="var(--primary)" />
          </div>
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              {asset.asset_name}
            </h4>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {asset.institution} • {asset.account_number_masked}
            </span>
          </div>
        </div>

        <span style={{
          padding: '0.2rem 0.6rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.7rem',
          fontWeight: 700,
          background: asset.nominee_status === 'REGISTERED' ? '#dcfce7' : '#fef3c7',
          color: asset.nominee_status === 'REGISTERED' ? '#166534' : '#92400e',
          fontFamily: 'var(--font-mono)'
        }}>
          {asset.nominee_status === 'REGISTERED' ? 'Nominee Set' : 'Nominee Missing'}
        </span>
      </div>

      <div className="neu-inset" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ESTIMATED VALUATION</span>
        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
          ₹{asset.estimated_value_inr.toLocaleString('en-IN')}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--text-dim)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <FileCheck2 size={13} color="var(--primary)" />
          Status: {asset.status}
        </span>
        {asset.source_document_id && (
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            Verified via TEE
          </span>
        )}
      </div>
    </div>
  );
};
