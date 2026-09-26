import React, { useEffect, useState } from 'react';
import { FileText, Upload, Cpu, CheckCircle, AlertTriangle, Eye, Layers } from 'lucide-react';
import { documentApi } from '../services/documentApi';
import type { DocumentItem } from '../services/documentApi';
import { extractionApi } from '../services/extractionApi';
import type { ExtractionJob } from '../services/extractionApi';

interface DocumentsProps {
  onNavigate: (tab: string) => void;
}

export const Documents: React.FC<DocumentsProps> = ({ onNavigate }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ExtractionJob | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Review Edit Form State
  const [reviewFields, setReviewFields] = useState<Record<string, any>>({});
  const [reviewEntityType, setReviewEntityType] = useState<'asset' | 'liability'>('asset');
  const [reviewCategory, setReviewCategory] = useState('insurance_payout');
  const [reviewName, setReviewName] = useState('');
  const [reviewInst, setReviewInst] = useState('');
  const [reviewAmount, setReviewAmount] = useState(0);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setDocuments([
      {
        id: 'doc-1',
        estate_id: 'estate-case-1',
        title: 'SBI Savings Passbook & Statement',
        filename: 'sbi_savings_statement_2026.pdf',
        file_type: 'application/pdf',
        file_size_bytes: 1048576,
        status: 'confirmed',
        upload_date: new Date().toISOString()
      },
      {
        id: 'doc-2',
        estate_id: 'estate-case-1',
        title: 'HDFC Home Loan Account Agreement',
        filename: 'hdfc_home_loan_agreement.pdf',
        file_type: 'application/pdf',
        file_size_bytes: 2097152,
        status: 'confirmed',
        upload_date: new Date().toISOString()
      },
      {
        id: 'doc-3',
        estate_id: 'estate-case-1',
        title: 'LIC Jeevan Umang Term Life Insurance Policy',
        filename: 'lic_term_policy_99201482.pdf',
        file_type: 'application/pdf',
        file_size_bytes: 1572864,
        status: 'extracted',
        upload_date: new Date().toISOString()
      }
    ]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    try {
      setUploading(true);
      const newDoc = await documentApi.uploadDocument('estate-case-1', file);
      const job = await extractionApi.createJob(newDoc.id);
      loadDocuments();
      openReviewJob(job);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const openReviewJob = async (job?: ExtractionJob) => {
    let jobData = job;
    if (!jobData) {
      jobData = {
        id: 'job-3',
        document_id: 'doc-3',
        status: 'completed',
        tee_enclave_id: 'enclave-sgx-fintech-01',
        tee_attestation_quote: 'SGX_QUOTE_VERIFIED_0xa3f8c901e4b8120d9f82',
        extracted_data_json: {
          policy_provider: 'LIC of India',
          policy_number: 'POL-99201482',
          sum_assured: 5000000.00,
          nominee_declared: 'Rahul Sharma (Son)',
          premium_due_date: '2026-11-15',
          claim_contact: 'claims@licindia.in'
        },
        confidence_score: 0.84,
        low_confidence_fields_json: ['nominee_declared'],
        source_regions_json: {
          policy_provider: { page: 1, box: [80, 30, 220, 60] },
          policy_number: { page: 1, box: [100, 110, 260, 140] },
          sum_assured: { page: 1, box: [140, 210, 330, 240] },
          nominee_declared: { page: 2, box: [180, 310, 390, 340] }
        },
        created_at: new Date().toISOString()
      };
    }

    setSelectedJob(jobData);
    setReviewFields(jobData.extracted_data_json || {});
    setReviewEntityType('asset');
    setReviewCategory('insurance_payout');
    setReviewName(jobData.extracted_data_json.policy_provider ? `${jobData.extracted_data_json.policy_provider} Term Claim` : 'Extracted Claim');
    setReviewInst(jobData.extracted_data_json.policy_provider || 'LIC of India');
    setReviewAmount(jobData.extracted_data_json.sum_assured || 5000000);
    setShowReviewModal(true);
  };

  const handleConfirmExtraction = async () => {
    if (!selectedJob) return;
    try {
      await extractionApi.confirmExtraction(selectedJob.id, {
        confirmed_fields: reviewFields,
        entity_type: reviewEntityType,
        category: reviewCategory,
        name: reviewName,
        institution_or_creditor: reviewInst,
        amount_or_value: Number(reviewAmount)
      });
      setShowReviewModal(false);
      loadDocuments();
      alert('Extraction Confirmed! Promoted entity to Estate Inventory & triggered Action Engine.');
      onNavigate('estate');
    } catch (err: any) {
      setShowReviewModal(false);
      onNavigate('estate');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={24} color="#38bdf8" />
            <span>TEE Confidential Document Extraction</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Isolated in-memory OCR & custom NER extraction running inside hardware protected TEE enclave.
          </p>
        </div>

        {/* Upload Button */}
        <label style={{
          padding: '0.65rem 1.25rem',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
          color: '#090d16',
          fontWeight: 700,
          fontSize: '0.85rem',
          cursor: uploading ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)'
        }}>
          <Upload size={16} />
          <span>{uploading ? 'Processing in TEE...' : 'Upload Financial Doc'}</span>
          <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
        </label>
      </div>

      {/* Hardware TEE Isolation Assurance Banner */}
      <div className="glass-card" style={{ padding: '1.1rem 1.25rem', background: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Cpu size={26} color="#10b981" className="animate-tee-pulse" />
        <div>
          <strong style={{ color: '#6ee7b7', fontSize: '0.9rem' }}>Privacy Guarantee: No Plaintext Document Storage or External LLMs</strong>
          <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.15rem' }}>
            Raw sensitive PDF contents are decrypted strictly inside memory enclave boundaries (Intel SGX / AMD SEV). Only structured JSON metadata with confidence scores is passed to the application.
          </p>
        </div>
      </div>

      {/* Document List */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', marginBottom: '1rem' }}>Uploaded Estate Financial Documents</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {documents.map((doc) => (
            <div key={doc.id} style={{
              padding: '1rem',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} color="#38bdf8" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>{doc.title}</h4>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                    <span>File: {doc.filename}</span>
                    <span>Size: {(doc.file_size_bytes / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {doc.status === 'confirmed' && (
                  <span className="badge-medium" style={{ padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle size={14} color="#10b981" /> Confirmed & Promoted
                  </span>
                )}

                {doc.status === 'extracted' && (
                  <span className="badge-high" style={{ padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <AlertTriangle size={14} color="#f59e0b" /> 1 Field Needs Review
                  </span>
                )}

                <button
                  onClick={() => openReviewJob(undefined)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    background: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Eye size={14} />
                  <span>Review TEE Extraction</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TEE Extraction Review & Confirmation Modal */}
      {showReviewModal && selectedJob && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span className="badge-tee" style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                    TEE ENCLAVE: {selectedJob.tee_enclave_id}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Confidence: {(selectedJob.confidence_score * 100).toFixed(0)}%</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
                  Review & Human Confirmation Modal
                </h3>
              </div>
              <button onClick={() => setShowReviewModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Split View: Left Document Source Bounding Box, Right Extracted Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Left Side: Document OCR Region Visualizer */}
              <div style={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Layers size={16} />
                  <span>OCR Source Region Bounding Box</span>
                </div>

                <div style={{
                  height: '240px',
                  background: '#1e293b',
                  borderRadius: '8px',
                  position: 'relative',
                  border: '1px dashed rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '1rem' }}>
                    <p style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>LIC Term Policy Document Page 2</p>
                    <div style={{
                      marginTop: '0.8rem',
                      padding: '0.6rem',
                      background: 'rgba(245, 158, 11, 0.25)',
                      border: '2px solid #f59e0b',
                      borderRadius: '6px',
                      color: '#fcd34d',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      Bounding Box [180, 310, 390, 340]
                      <br />
                      Extracted Text: "Nominee: Rahul Sharma (Son)"
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Attestation Quote: <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>{selectedJob.tee_attestation_quote}</span>
                </div>
              </div>

              {/* Right Side: Structured Extracted Form to Confirm */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Extracted Fields & Human Confirmation
                </div>

                {selectedJob.low_confidence_fields_json?.length > 0 && (
                  <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', fontSize: '0.78rem', color: '#fcd34d' }}>
                    ⚠️ Field <strong>nominee_declared</strong> requires explicit human verification before promotion.
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Entity Name</label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Institution / Insurer</label>
                  <input
                    type="text"
                    value={reviewInst}
                    onChange={(e) => setReviewInst(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Sum Assured / Financial Value (₹)</label>
                  <input
                    type="number"
                    value={reviewAmount}
                    onChange={(e) => setReviewAmount(Number(e.target.value))}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Promote As</label>
                    <select
                      value={reviewEntityType}
                      onChange={(e) => setReviewEntityType(e.target.value as any)}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
                    >
                      <option value="asset">Estate Asset</option>
                      <option value="liability">Estate Liability</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Category</label>
                    <select
                      value={reviewCategory}
                      onChange={(e) => setReviewCategory(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
                    >
                      <option value="insurance_payout">Insurance Payout</option>
                      <option value="bank_account">Bank Account</option>
                      <option value="property">Property</option>
                      <option value="home_loan">Home Loan</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleConfirmExtraction}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#090d16',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <CheckCircle size={18} />
                  <span>Confirm & Add to Estate Inventory</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
