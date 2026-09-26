import React, { useState } from 'react';
import { FileText, Upload, Cpu, CheckCircle, AlertTriangle, Eye, Layers } from 'lucide-react';
import { useEstate } from '../context/EstateContext';
import type { ExtractionJob } from '../context/EstateContext';

interface DocumentsProps {
  onNavigate: (tab: string) => void;
}

export const Documents: React.FC<DocumentsProps> = ({ onNavigate }) => {
  const { documents, extractionJobs, uploadDocument, confirmExtraction } = useEstate();
  const [uploading, setUploading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ExtractionJob | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Review Edit Form State
  const [reviewEntityType, setReviewEntityType] = useState<'asset' | 'liability'>('asset');
  const [reviewCategory, setReviewCategory] = useState('insurance_payout');
  const [reviewName, setReviewName] = useState('');
  const [reviewInst, setReviewInst] = useState('');
  const [reviewAmount, setReviewAmount] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    try {
      setUploading(true);
      const newDoc = await uploadDocument(file);
      const job = extractionJobs[newDoc.id] || extractionJobs['doc-3'];
      openReviewJob(job);
    } finally {
      setUploading(false);
    }
  };

  const openReviewJob = (job?: ExtractionJob) => {
    const jobData = job || extractionJobs['doc-3'];
    if (!jobData) return;

    setSelectedJob(jobData);
    setReviewEntityType('asset');
    setReviewCategory('insurance_payout');
    setReviewName(jobData.extracted_data_json.policy_provider ? `${jobData.extracted_data_json.policy_provider} Term Claim` : jobData.document_title);
    setReviewInst(jobData.extracted_data_json.policy_provider || 'LIC of India');
    setReviewAmount(jobData.extracted_data_json.sum_assured || 5000000);
    setShowReviewModal(true);
  };

  const handleConfirm = () => {
    if (!selectedJob) return;
    confirmExtraction(selectedJob.id, {
      name: reviewName,
      institution: reviewInst,
      amount: Number(reviewAmount),
      entityType: reviewEntityType,
      category: reviewCategory,
      confirmedFields: selectedJob.extracted_data_json
    });
    setShowReviewModal(false);
    onNavigate('estate');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={24} color="var(--primary)" />
            <span>TEE Confidential Document Extraction</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Zero-knowledge parsing running inside hardware-isolated memory enclaves (Intel SGX)
          </p>
        </div>

        {/* Upload Button */}
        <label className="neu-btn-primary" style={{ cursor: uploading ? 'wait' : 'pointer' }}>
          <Upload size={15} />
          <span>{uploading ? 'Processing in Enclave...' : 'Upload Financial Doc'}</span>
          <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
        </label>
      </div>

      {/* Hardware TEE Isolation Assurance Banner */}
      <div className="neu-card" style={{ padding: '0.85rem 1.25rem', borderLeft: '4px solid var(--success)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <Cpu size={22} color="var(--success)" className="animate-tee-pulse" style={{ flexShrink: 0 }} />
        <div>
          <strong style={{ color: 'var(--text-main)', fontSize: '0.84rem' }}>Confidential Hardware Enclave (Intel SGX) Active</strong>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Plaintext decryption occurs strictly in volatile enclave RAM. No raw document text is logged or shared with external models.
          </p>
        </div>
      </div>

      {/* Document List */}
      <div className="neu-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Estate Financial Documents ({documents.length})
          </h3>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            ALL DOCUMENTS CLIENT-ENCRYPTED
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {documents.map((doc) => (
            <div key={doc.id} className="neu-card-sm" style={{
              padding: '0.95rem 1.15rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface)',
                  boxShadow: 'var(--neu-shadow-btn)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileText size={20} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{doc.title}</h4>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: '0.85rem', marginTop: '0.15rem', flexWrap: 'wrap' }}>
                    <span>{doc.filename}</span>
                    <span>{(doc.file_size_bytes / 1024 / 1024).toFixed(2)} MB</span>
                    {doc.extracted_summary && (
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{doc.extracted_summary}</span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {doc.status === 'confirmed' ? (
                  <span className="badge-medium" style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle size={13} color="var(--success)" /> CONFIRMED
                  </span>
                ) : (
                  <span className="badge-high" style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <AlertTriangle size={13} color="var(--warning)" /> VERIFY NOMINEE
                  </span>
                )}

                <button
                  onClick={() => openReviewJob(extractionJobs[doc.id] || extractionJobs['doc-3'])}
                  className="neu-btn"
                  style={{ color: 'var(--primary)', fontSize: '0.78rem' }}
                >
                  <Eye size={14} />
                  <span>Review TEE OCR</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TEE Extraction Review & Confirmation Modal */}
      {showReviewModal && selectedJob && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '820px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.7)', paddingBottom: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span className="badge-tee" style={{ padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.68rem', fontWeight: 700 }}>
                    TEE ENCLAVE: {selectedJob.tee_enclave_id}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--success)', fontWeight: 700 }}>
                    Confidence: {(selectedJob.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Human Review & Entity Confirmation
                </h3>
              </div>
              <button 
                onClick={() => setShowReviewModal(false)} 
                className="neu-btn"
                style={{ padding: '0.35rem 0.65rem' }}
              >
                ✕
              </button>
            </div>

            {/* Split View: Left Document Source Bounding Box, Right Extracted Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* Left Side: Document OCR Region Visualizer */}
              <div className="neu-card-sm" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Layers size={15} />
                  <span>OCR Source Region Bounding Box</span>
                </div>

                <div className="neu-inset" style={{
                  height: '210px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  position: 'relative'
                }}>
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 700 }}>LIC Term Policy Document Page 2</p>
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.65rem',
                      background: '#fffbeb',
                      border: '2px solid var(--warning)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-main)',
                      fontSize: '0.74rem',
                      boxShadow: 'var(--neu-shadow-btn)'
                    }}>
                      Bounding Box [180, 310, 390, 340]
                      <br />
                      <strong style={{ color: '#b45309' }}>Nominee: Rahul Sharma (Son, 24y)</strong>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                  Attestation: {selectedJob.tee_attestation_quote.substring(0, 32)}...
                </div>
              </div>

              {/* Right Side: Structured Extracted Form to Confirm */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase' }}>
                  Extracted Structured Entity
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Entity Name</label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Institution</label>
                  <input
                    type="text"
                    value={reviewInst}
                    onChange={(e) => setReviewInst(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Financial Value (₹)</label>
                  <input
                    type="number"
                    value={reviewAmount}
                    onChange={(e) => setReviewAmount(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Promote As</label>
                    <select
                      value={reviewEntityType}
                      onChange={(e) => setReviewEntityType(e.target.value as any)}
                      style={{ width: '100%' }}
                    >
                      <option value="asset">Estate Asset</option>
                      <option value="liability">Estate Liability</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Category</label>
                    <select
                      value={reviewCategory}
                      onChange={(e) => setReviewCategory(e.target.value)}
                      style={{ width: '100%' }}
                    >
                      <option value="insurance_payout">Insurance Payout</option>
                      <option value="bank_account">Bank Account</option>
                      <option value="property">Property</option>
                      <option value="home_loan">Home Loan</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  className="neu-btn-primary"
                  style={{ marginTop: '0.35rem', padding: '0.65rem' }}
                >
                  <CheckCircle size={16} />
                  <span>Confirm & Add to Inventory</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
