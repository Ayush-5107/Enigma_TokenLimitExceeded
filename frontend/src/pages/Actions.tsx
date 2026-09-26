import React, { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { useEstate } from '../context/EstateContext';
import type { ActionItem } from '../context/EstateContext';

export const Actions: React.FC = () => {
  const { actions, familyMembers, assignAction, updateActionStatus } = useEstate();
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [evidenceNote, setEvidenceNote] = useState('');

  const handleUpdate = (newStatus: 'pending' | 'in_progress' | 'completed') => {
    if (!selectedAction) return;
    updateActionStatus(selectedAction.id, newStatus, evidenceNote);
    setEvidenceNote('');
    setSelectedAction(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckSquare size={24} color="var(--primary)" />
          <span>Action Engine & Priority Checklist</span>
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
          Prioritized closure checklists with explainable risk scoring & document requirements
        </p>
      </div>

      {/* Action Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        {actions.map((act) => (
          <div key={act.id} className="neu-card" style={{ padding: '1.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div style={{ flex: '1 1 450px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                  <span className={`badge-${act.priority}`} style={{ padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {act.priority} (Score: {act.urgency_score}/100)
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Due: <strong style={{ color: 'var(--text-main)' }}>{act.due_date}</strong>
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{act.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{act.description}</p>

                {/* Explainable Rationale Box */}
                <div className="neu-inset" style={{
                  marginTop: '0.65rem',
                  padding: '0.55rem 0.85rem',
                  fontSize: '0.78rem',
                  color: 'var(--text-main)'
                }}>
                  <strong style={{ color: 'var(--primary)' }}>Priority Rationale: </strong>
                  {act.priority_reason}
                </div>

                {/* Checklist Steps & Documents */}
                <div style={{ marginTop: '0.85rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Action Steps</h4>
                    <ul style={{ paddingLeft: '1rem', fontSize: '0.78rem', color: 'var(--text-main)' }}>
                      {act.checklist_steps_json?.map((step, idx) => (
                        <li key={idx} style={{ marginBottom: '0.2rem' }}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Required Documents</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {act.required_documents_json?.map((docName, idx) => (
                        <span key={idx} className="neu-card-sm" style={{ padding: '0.15rem 0.5rem', fontSize: '0.72rem', color: 'var(--text-main)' }}>
                          📄 {docName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {act.evidence_note && (
                  <div style={{ marginTop: '0.65rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <strong>Latest Evidence / Note:</strong> {act.evidence_note}
                  </div>
                )}
              </div>

              {/* Assignment & Status Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '200px', flex: '0 0 220px' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  STATUS: <strong style={{ color: act.status === 'completed' ? 'var(--success)' : 'var(--warning)', textTransform: 'uppercase' }}>{act.status.replace('_', ' ')}</strong>
                </div>

                {/* Family Member Assignment Dropdown */}
                <div style={{ width: '100%' }}>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Assigned To:</label>
                  <select
                    value={act.assigned_member_id || ''}
                    onChange={(e) => assignAction(act.id, e.target.value)}
                    style={{ width: '100%', fontSize: '0.78rem', padding: '0.45rem' }}
                  >
                    <option value="">-- Unassigned --</option>
                    {familyMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.relationship_type})</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setSelectedAction(act)}
                  className="neu-btn"
                  style={{ color: 'var(--primary)', width: '100%', fontSize: '0.78rem' }}
                >
                  Update Task & Note
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Task Update Modal */}
      {selectedAction && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Update Task: {selectedAction.title}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Update Status</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <button
                    onClick={() => handleUpdate('in_progress')}
                    className="neu-btn"
                    style={{ color: '#b45309', fontWeight: 700 }}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleUpdate('completed')}
                    className="neu-btn"
                    style={{ color: 'var(--success)', fontWeight: 700 }}
                  >
                    Mark Completed
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Evidence Note / Branch Ref</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Submitted claim reference #LIC-99214 to branch manager..."
                  value={evidenceNote}
                  onChange={(e) => setEvidenceNote(e.target.value)}
                  style={{ width: '100%', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  onClick={() => setSelectedAction(null)}
                  className="neu-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
