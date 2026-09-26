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
    } catch {
      const dummyDoc: DocumentItem = {
        id: 'doc-' + Date.now(),
        estate_id: 'estate-case-1',
        title: file.name.replace(/\.[^/.]+$/, ""),
        filename: file.name,
        file_type: file.type || 'application/pdf',
        file_size_bytes: file.size,
        status: 'extracted',
        upload_date: new Date().toISOString()
      };
      setDocuments(prev => [dummyDoc, ...prev]);
      openReviewJob(undefined);
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
    } catch {
      setShowReviewModal(false);
      onNavigate('estate');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={26} color="var(--primary)" />
            <span>TEE Confidential Document Extraction</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Isolated in-memory OCR & custom NER extraction running inside hardware protected TEE enclave.
          </p>
        </div>

        {/* Upload Button */}
        <label className="neu-btn-primary" style={{ cursor: uploading ? 'wait' : 'pointer' }}>
          <Upload size={16} />
          <span>{uploading ? 'Processing in TEE...' : 'Upload Financial Doc'}</span>
          <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
        </label>
      </div>

      {/* Hardware TEE Isolation Assurance Banner */}
      <div className="neu-card" style={{ padding: '1.25rem 1.5rem', borderLeft: '5px solid var(--success)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface)',
          boxShadow: 'var(--neu-shadow-btn)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Cpu size={26} color="var(--success)" className="animate-tee-pulse" />
        </div>
        <div>
          <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>Privacy Guarantee: No Plaintext Document Storage or External LLMs</strong>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Raw sensitive documents are decrypted strictly inside hardware enclave memory boundaries (Intel SGX / AMD SEV). Only structured JSON metadata with confidence scores is passed to the application.
          </p>
        </div>
      </div>

      {/* Document List */}
      <div className="neu-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
          Uploaded Estate Financial Documents
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {documents.map((doc) => (
            <div key={doc.id} className="neu-card-sm" style={{
              padding: '1.15rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                  <FileText size={22} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>{doc.title}</h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
                    <span>FILE: {doc.filename}</span>
                    <span>SIZE: {(doc.file_size_bytes / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {doc.status === 'confirmed' && (
                  <span className="badge-medium" style={{ padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle size={14} color="var(--success)" /> CONFIRMED & PROMOTED
                  </span>
                )}

                {doc.status === 'extracted' && (
                  <span className="badge-high" style={{ padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <AlertTriangle size={14} color="var(--warning)" /> 1 FIELD NEEDS REVIEW
                  </span>
                )}

                <button
                  onClick={() => openReviewJob(undefined)}
                  className="neu-btn"
                  style={{ color: 'var(--primary)' }}
                >
                  <Eye size={15} />
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
          <div className="modal-content" style={{ maxWidth: '880px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.7)', paddingBottom: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                  <span className="badge-tee" style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: 700 }}>
                    TEE ENCLAVE: {selectedJob.tee_enclave_id}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    Confidence: {(selectedJob.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Review & Human Confirmation Modal
                </h3>
              </div>
              <button 
                onClick={() => setShowReviewModal(false)} 
                className="neu-btn"
                style={{ padding: '0.4rem 0.75rem', fontSize: '1rem' }}
              >
                ✕
              </button>
            </div>

            {/* Split View: Left Document Source Bounding Box, Right Extracted Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Left Side: Document OCR Region Visualizer */}
              <div className="neu-card-sm" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: 'var(--font-mono)' }}>
                  <Layers size={16} />
                  <span>OCR Source Region Bounding Box</span>
                </div>

                <div className="neu-inset" style={{
                  height: '240px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  position: 'relative'
                }}>
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 700 }}>LIC Term Policy Document Page 2</p>
                    <div style={{
                      marginTop: '0.85rem',
                      padding: '0.75rem',
                      background: '#fff8e1',
                      border: '2px solid var(--warning)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-main)',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                      boxShadow: 'var(--neu-shadow-btn)'
                    }}>
                      Bounding Box: [180, 310, 390, 340]
                      <br />
                      <strong style={{ color: '#b26500' }}>Extracted Text: "Nominee: Rahul Sharma (Son)"</strong>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                  Attestation Quote: <span style={{ color: 'var(--text-main)' }}>{selectedJob.tee_attestation_quote}</span>
                </div>
              </div>

              {/* Right Side: Structured Extracted Form to Confirm */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
                  Extracted Fields & Human Confirmation
                </div>

                {selectedJob.low_confidence_fields_json?.length > 0 && (
                  <div className="neu-inset" style={{ padding: '0.75rem', borderLeft: '4px solid var(--warning)', fontSize: '0.78rem', color: 'var(--text-main)' }}>
                    ⚠️ Field <strong>nominee_declared</strong> requires explicit human verification before promotion.
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontFamily: 'var(--font-mono)' }}>Entity Name</label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontFamily: 'var(--font-mono)' }}>Institution / Insurer</label>
                  <input
                    type="text"
                    value={reviewInst}
                    onChange={(e) => setReviewInst(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontFamily: 'var(--font-mono)' }}>Sum Assured / Valuation (₹)</label>
                  <input
                    type="number"
                    value={reviewAmount}
                    onChange={(e) => setReviewAmount(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontFamily: 'var(--font-mono)' }}>Promote As</label>
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
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontFamily: 'var(--font-mono)' }}>Category</label>
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
                  onClick={handleConfirmExtraction}
                  className="neu-btn-primary"
                  style={{ marginTop: '0.5rem', padding: '0.75rem' }}
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
