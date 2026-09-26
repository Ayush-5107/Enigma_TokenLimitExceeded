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
    } catch {
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
    } catch {
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
    } catch {
      setActions(actions.map(a => a.id === actionId ? { ...a, status: newStatus as any } : a));
      setSelectedAction(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CheckSquare size={26} color="var(--primary)" />
          <span>Action Engine & Explainable Priority Matrix</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Prioritized closure checklists automatically generated from confirmed financial assets & liabilities with explainable scoring.
        </p>
      </div>

      {/* Action Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {actions.map((act) => (
          <div key={act.id} className="neu-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ flex: '1 1 500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span className={`badge-${act.priority}`} style={{ padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {act.priority} Priority (Score: {act.urgency_score}/100)
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Due: <strong style={{ color: 'var(--text-main)' }}>{act.due_date}</strong>
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>{act.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{act.description}</p>

                {/* Priority Rationale Box (Neumorphic Inset Well) */}
                <div className="neu-inset" style={{
                  marginTop: '0.85rem',
                  padding: '0.75rem 1rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-main)'
                }}>
                  <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>EXPLAINABLE RATIONALE: </strong>
                  {act.priority_reason}
                </div>

                {/* Checklist Steps & Documents */}
                <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>Action Steps</h4>
                    <ul style={{ paddingLeft: '1.1rem', fontSize: '0.82rem', color: 'var(--text-main)' }}>
                      {act.checklist_steps_json?.map((step, idx) => (
                        <li key={idx} style={{ marginBottom: '0.3rem' }}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>Required Documents</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {act.required_documents_json?.map((docName, idx) => (
                        <span key={idx} className="neu-card-sm" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                          📄 {docName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment & Status Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', minWidth: '220px', flex: '0 0 240px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  STATUS: <strong style={{ color: act.status === 'completed' ? 'var(--success)' : 'var(--warning)', textTransform: 'uppercase' }}>{act.status}</strong>
                </div>

                {/* Family Member Assignment Dropdown */}
                <div style={{ width: '100%' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem', fontFamily: 'var(--font-mono)' }}>Assigned To:</label>
                  <select
                    value={act.assigned_member_id || ''}
                    onChange={(e) => handleAssign(act.id, e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="">-- Assign Member --</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.relationship_type})</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setSelectedAction(act)}
                  className="neu-btn"
                  style={{ color: 'var(--primary)', width: '100%' }}
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
          <div className="modal-content" style={{ maxWidth: '520px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.85rem' }}>
              Update Task Status: {selectedAction.title}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>Select New Status</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleUpdateStatus(selectedAction.id, 'in_progress')}
                    className="neu-btn"
                    style={{ color: '#b26500', fontWeight: 700 }}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAction.id, 'completed')}
                    className="neu-btn"
                    style={{ color: 'var(--success)', fontWeight: 700 }}
                  >
                    Mark Completed
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>Upload Evidence Note / Ref</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Submitted claim reference #LIC-99214 to branch manager..."
                  value={evidenceNote}
                  onChange={(e) => setEvidenceNote(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                <button
                  onClick={() => setSelectedAction(null)}
                  className="neu-btn"
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
