import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Camera, CheckCircle2, ShieldCheck } from 'lucide-react';

interface BatchUploadProps {
  onUpload: (files: FileList) => void;
  isProcessing: boolean;
}

export const BatchUploadDropzone: React.FC<BatchUploadProps> = ({ onUpload, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="neu-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: isDragOver ? '2px dashed var(--primary)' : '2px dashed rgba(0, 102, 102, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 1.5rem',
          background: isDragOver ? 'rgba(0, 102, 102, 0.05)' : 'var(--surface)',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept=".pdf,.png,.jpg,.jpeg"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files && onUpload(e.target.files)}
        />

        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files && onUpload(e.target.files)}
        />

        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--surface)',
          boxShadow: 'var(--neu-shadow-btn)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          <UploadCloud size={28} color="var(--primary)" />
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          {isProcessing ? 'Processing Documents in TEE Enclave...' : 'Upload Estate Documents'}
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem', maxWidth: '420px', margin: '0.35rem auto 1.25rem' }}>
          Drag & drop bank statements, insurance policies, loan documents, or land deeds. All files are decrypted <strong>strictly inside SGX/SEV TEE memory</strong>.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="neu-btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.82rem' }}
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          >
            <FileText size={16} />
            <span>Select Files (PDF/Images)</span>
          </button>

          <button
            type="button"
            className="neu-card"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
          >
            <Camera size={16} color="var(--primary)" />
            <span>Camera Scan</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.25rem', fontSize: '0.74rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={14} color="var(--success)" /> Zero-Plaintext Storage
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle2 size={14} color="var(--primary)" /> Custom Extraction Model v1.4
        </span>
      </div>
    </div>
  );
};
