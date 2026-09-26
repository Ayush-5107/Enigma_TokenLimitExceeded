import React, { useState } from 'react';
import { ShieldCheck, Check, X, Cpu } from 'lucide-react';
import type { ExtractionJob } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';

interface ExtractionReviewModalProps {
  job: ExtractionJob;
  onConfirm: (jobId: string, confirmedFields: Record<string, string>) => void;
  onClose: () => void;
}

export const ExtractionReviewModal: React.FC<ExtractionReviewModalProps> = ({ job, onConfirm, onClose }) => {
  const [editedFields, setEditedFields] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    job.extracted_fields.forEach((f) => {
      initial[f.id] = f.extracted_value;
    });
    return initial;
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (fieldId: string, value: string) => {
    setEditedFields((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleConfirmAll = async () => {
    setSaving(true);
    await onConfirm(job.id, editedFields);
    setSaving(false);
    onClose();
  };

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
      <div className="neu-card" style={{ maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
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
              <Cpu size={22} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                TEE Human Verification Review
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem', fontFamily: 'var(--font-mono)' }}>
                Document: {job.document_name}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="neu-inset" style={{ padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} color="var(--primary)" />
            <span>TEE Boundary: {job.tee_enclave}</span>
          </div>
          <ConfidenceBadge score={job.confidence_score} />
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Please review the structured information extracted by the custom model. Verify or correct any highlighted values before promoting into the <strong>Estate Inventory</strong>.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {job.extracted_fields.map((field) => (
            <div key={field.id} className="neu-card" style={{ padding: '0.85rem 1.1rem', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  {field.field_name.replace(/_/g, ' ')}
                </span>
                <span style={{ fontSize: '0.72rem', color: field.confidence >= 85 ? 'var(--success)' : 'var(--warning)', fontFamily: 'var(--font-mono)' }}>
                  {field.confidence}% match (Page {field.source_page})
                </span>
              </div>
              <input
                type="text"
                value={editedFields[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                style={{ width: '100%', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem' }}>
          <button onClick={onClose} className="neu-card" style={{ padding: '0.65rem 1.25rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleConfirmAll} disabled={saving} className="neu-btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.82rem' }}>
            <Check size={16} />
            <span>{saving ? 'Promoting to Estate...' : 'Confirm & Add to Estate Inventory'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
