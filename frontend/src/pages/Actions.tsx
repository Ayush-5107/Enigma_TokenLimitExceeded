import React, { useEffect, useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { actionApi } from '../services/actionApi';
import type { ActionItem } from '../services/actionApi';
import { familyApi } from '../services/familyApi';
import type { FamilyMember } from '../services/familyApi';

export const Actions: React.FC = () => {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [evidenceNote, setEvidenceNote] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const acts = await actionApi.getActions('estate-case-1');
      setActions(acts);
      const mems = await familyApi.getMembers('estate-case-1');
      setMembers(mems);
    } catch (e) {
      setActions([
        {
          id: 'act-1',
          estate_id: 'estate-case-1',
          title: 'Notify HDFC Lender & Verify Credit Shield Policy',
          description: 'Submit written death notice to HDFC Bank Home Finance to prevent EMI default penalty and verify if Loan Protection Insurance covers principal.',
          category: 'financial',
          priority: 'critical',
          urgency_score: 95,
          priority_reason: 'Liability requiring active EMI payment (₹38,400/mo); high risk of recurring late penalty fees & loan default.',
          status: 'in_progress',
          due_date: '2026-10-05',
          assigned_member_id: 'member-2',
          assigned_member_name: 'Rahul Sharma',
          required_documents_json: [
            'Certified Death Certificate',
            'HDFC Loan Account Sanction Letter',
            'Loan Credit Shield Policy Document',
            'Legal Heir Identification'
          ],
          checklist_steps_json: [
            'Submit death certificate to HDFC loan manager',
            'Inquire about credit shield insurance cover',
            'Submit insurance claim form to waive outstanding ₹42,50,000 balance'
          ],
          dependencies_json: [],
          created_at: new Date().toISOString()
        },
        {
          id: 'act-2',
          estate_id: 'estate-case-1',
          title: 'Confirm Nominee & File LIC Term Insurance Claim',
          description: 'Review low-confidence extracted nominee field for policy POL-99201482 and file formal death claim with LIC of India.',
          category: 'financial',
          priority: 'critical',
          urgency_score: 90,
          priority_reason: 'Time-sensitive life insurance claim window (₹50,00,000 payout) to provide crucial family liquidity.',
          status: 'pending',
          due_date: '2026-10-15',
          assigned_member_id: 'member-1',
          assigned_member_name: 'Rajesh Sharma',
          required_documents_json: [
            'Original LIC Policy Document',
            'Certified Death Certificate',
            'Nominee Bank Cancelled Cheque',
            'Claimant Form A'
          ],
          checklist_steps_json: [
            'Verify nominee details in TEE Extraction Confirmation modal',
            'Download claim forms from LIC portal',
            'Submit document bundle to LIC Branch'
          ],
          dependencies_json: [],
          created_at: new Date().toISOString()
        },
        {
          id: 'act-3',
          estate_id: 'estate-case-1',
          title: 'Submit SBI Bank Deceased Claim for Account Transfer',
          description: 'Notify SBI Connaught Place Branch to process deceased claim for savings account 304910294821.',
          category: 'financial',
          priority: 'high',
          urgency_score: 75,
          priority_reason: 'Immediate liquid balance (₹845,200.50) needed for estate administration.',
          status: 'pending',
          due_date: '2026-11-01',
          assigned_member_id: 'member-1',
          assigned_member_name: 'Rajesh Sharma',
          required_documents_json: ['SBI Passbook', 'Death Certificate', 'Nominee KYC'],
          checklist_steps_json: ['Visit SBI home branch', 'Submit Form Annexure-1 with Death Certificate'],
          dependencies_json: [],
          created_at: new Date().toISOString()
        },
        {
          id: 'act-4',
          estate_id: 'estate-case-1',
          title: 'Initiate Gurgaon Municipal Property Revenue Mutation',
          description: 'Apply for property revenue mutation for Flat 402 Oakwood Towers at Gurgaon Municipal Revenue office.',
          category: 'legal',
          priority: 'medium',
          urgency_score: 55,
          priority_reason: 'Property title transfer requirement; low immediate penalty risk.',
          status: 'pending',
          due_date: '2027-02-15',
          assigned_member_id: 'member-3',
          assigned_member_name: 'Adv. Anita Mehta',
          required_documents_json: ['Original Sale Deed', 'Legal Heirship Certificate', 'Property Tax NOC'],
          checklist_steps_json: ['Draft Legal Heirship affidavit', 'Apply online at Haryana Revenue Mutation portal'],
          dependencies_json: [],
          created_at: new Date().toISOString()
        }
      ]);
      setMembers([
        { id: 'member-1', estate_id: 'estate-case-1', name: 'Rajesh Sharma', email: 'owner@estate.demo', relationship_type: 'Primary Executor', role: 'owner', permissions_json: { vault: true, documents: true, estate: true, actions: true, audit: true }, status: 'active', joined_at: '' },
        { id: 'member-2', estate_id: 'estate-case-1', name: 'Rahul Sharma', email: 'rahul@estate.demo', relationship_type: 'Son', role: 'family_member', permissions_json: { vault: false, documents: true, estate: true, actions: true, audit: false }, status: 'active', joined_at: '' },
        { id: 'member-3', estate_id: 'estate-case-1', name: 'Adv. Anita Mehta', email: 'anita@estate.demo', relationship_type: 'Estate Attorney', role: 'executor', permissions_json: { vault: true, documents: true, estate: true, actions: true, audit: true }, status: 'active', joined_at: '' }
      ]);
    }
  };

  const handleAssign = async (actionId: string, memberId: string) => {
    try {
      await actionApi.assignAction(actionId, memberId);
      loadData();
    } catch (e) {
      const mem = members.find(m => m.id === memberId);
      setActions(actions.map(a => a.id === actionId ? { ...a, assigned_member_id: memberId, assigned_member_name: mem?.name } : a));
    }
  };

  const handleUpdateStatus = async (actionId: string, newStatus: string) => {
    try {
      await actionApi.updateTaskStatus(actionId, newStatus, evidenceNote);
      setEvidenceNote('');
      setSelectedAction(null);
      loadData();
    } catch (e) {
      setActions(actions.map(a => a.id === actionId ? { ...a, status: newStatus as any } : a));
      setSelectedAction(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CheckSquare size={24} color="#38bdf8" />
          <span>Action Engine & Explainable Priority Matrix</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
          Prioritized closure checklists automatically generated from confirmed financial assets & liabilities with explainable scoring.
        </p>
      </div>

      {/* Action Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {actions.map((act) => (
          <div key={act.id} className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ maxWidth: '70%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <span className={`badge-${act.priority}`} style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {act.priority} Priority (Score: {act.urgency_score}/100)
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Due: <strong style={{ color: '#f8fafc' }}>{act.due_date}</strong></span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{act.title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '0.3rem' }}>{act.description}</p>

                {/* Priority Rationale Box */}
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  fontSize: '0.8rem',
                  color: '#94a3b8'
                }}>
                  <strong style={{ color: '#38bdf8' }}>Explainable Rationale:</strong> {act.priority_reason}
                </div>

                {/* Checklist Steps & Documents */}
                <div style={{ marginTop: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Action Steps</h4>
                    <ul style={{ paddingLeft: '1.1rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                      {act.checklist_steps_json?.map((step, idx) => (
                        <li key={idx} style={{ marginBottom: '0.2rem' }}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Required Documents</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {act.required_documents_json?.map((docName, idx) => (
                        <span key={idx} style={{ padding: '0.15rem 0.5rem', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', fontSize: '0.72rem', color: '#cbd5e1' }}>
                          📄 {docName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment & Status Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Status: <strong style={{ color: act.status === 'completed' ? '#10b981' : '#f59e0b', textTransform: 'uppercase' }}>{act.status}</strong>
                </div>

                {/* Family Member Assignment Dropdown */}
                <div style={{ width: '100%' }}>
                  <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Assigned To:</label>
                  <select
                    value={act.assigned_member_id || ''}
                    onChange={(e) => handleAssign(act.id, e.target.value)}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="">-- Assign Member --</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.relationship_type})</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setSelectedAction(act)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    background: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Update Task & Evidence
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Task Update Modal */}
      {selectedAction && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
              Update Task Status: {selectedAction.title}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Select New Status</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleUpdateStatus(selectedAction.id, 'in_progress')}
                    style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAction.id, 'completed')}
                    style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Mark Completed
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Upload Evidence Note / Ref</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Submitted claim reference #LIC-99214 to branch manager..."
                  value={evidenceNote}
                  onChange={(e) => setEvidenceNote(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  onClick={() => setSelectedAction(null)}
                  style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
