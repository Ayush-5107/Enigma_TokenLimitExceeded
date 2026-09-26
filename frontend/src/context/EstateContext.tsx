import React, { createContext, useContext, useState } from 'react';

export interface DocumentItem {
  id: string;
  title: string;
  filename: string;
  file_type: string;
  file_size_bytes: number;
  category: 'bank' | 'insurance' | 'loan' | 'retirement' | 'property' | 'investment';
  status: 'extracted' | 'confirmed' | 'processing';
  upload_date: string;
  confidence_score: number;
  extracted_summary?: string;
  job_id?: string;
}

export interface ExtractionJob {
  id: string;
  document_id: string;
  document_title: string;
  status: 'completed' | 'processing';
  tee_enclave_id: string;
  tee_attestation_quote: string;
  extracted_data_json: Record<string, any>;
  confidence_score: number;
  low_confidence_fields_json: string[];
  source_regions_json: Record<string, { page: number; box: number[]; text?: string }>;
  created_at: string;
}

export interface AssetItem {
  id: string;
  category: string;
  name: string;
  institution: string;
  estimated_value: number;
  account_number_masked?: string;
  is_confirmed: boolean;
  confidence_score: number;
  status: 'confirmed' | 'unconfirmed';
  details_json?: Record<string, any>;
}

export interface LiabilityItem {
  id: string;
  category: string;
  name: string;
  creditor: string;
  total_amount: number;
  emi_amount: number;
  due_date: string;
  is_confirmed: boolean;
  confidence_score: number;
  status: 'confirmed' | 'unconfirmed';
  details_json?: Record<string, any>;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  urgency_score: number;
  priority_reason: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  assigned_member_id?: string;
  assigned_member_name?: string;
  required_documents_json: string[];
  checklist_steps_json: string[];
  evidence_note?: string;
}

export interface VaultItem {
  id: string;
  title: string;
  category: 'credential' | 'document' | 'note' | 'key';
  institution?: string;
  access_level: 'private' | 'shared' | 'release_on_verification';
  deadman_trigger_days: number;
  content: string;
  created_at: string;
}

export interface FamilyMemberItem {
  id: string;
  name: string;
  email: string;
  relationship_type: string;
  role: 'owner' | 'family_member' | 'executor';
  permissions_json: {
    vault: boolean;
    documents: boolean;
    estate: boolean;
    actions: boolean;
    audit: boolean;
  };
  status: 'active' | 'invited';
  joined_at: string;
}

export interface AuditLogItem {
  id: string;
  user_name: string;
  action_type: string;
  description: string;
  target_resource?: string;
  ip_address: string;
  timestamp: string;
}

interface EstateContextType {
  // Data
  documents: DocumentItem[];
  extractionJobs: Record<string, ExtractionJob>;
  assets: AssetItem[];
  liabilities: LiabilityItem[];
  actions: ActionItem[];
  vaultEntries: VaultItem[];
  familyMembers: FamilyMemberItem[];
  auditLogs: AuditLogItem[];
  
  // Computed
  totalAssetValue: number;
  totalLiabilityValue: number;
  netEstateValue: number;
  unconfirmedCount: number;
  closureProgressPercent: number;

  // Actions
  uploadDocument: (file: File) => Promise<DocumentItem>;
  confirmExtraction: (jobId: string, payload: {
    name: string;
    institution: string;
    amount: number;
    entityType: 'asset' | 'liability';
    category: string;
    confirmedFields: Record<string, any>;
  }) => void;
  updateActionStatus: (actionId: string, newStatus: 'pending' | 'in_progress' | 'completed', note?: string) => void;
  assignAction: (actionId: string, memberId: string) => void;
  addVaultEntry: (entry: Omit<VaultItem, 'id' | 'created_at'>) => void;
  deleteVaultEntry: (id: string) => void;
  updateMemberPermissions: (memberId: string, sectionKey: string, value: boolean) => void;
  addFamilyMember: (data: { name: string; email: string; relationship: string; role: 'family_member' | 'executor' }) => void;
}

const EstateContext = createContext<EstateContextType | null>(null);

export const EstateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial Test Cases: Documents across all 5 PRD categories (Bank, Insurance, Loan, Retirement, Property, Demat)
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      title: 'SBI Savings Account Statement',
      filename: 'sbi_savings_statement_2026.pdf',
      file_type: 'application/pdf',
      file_size_bytes: 1048576,
      category: 'bank',
      status: 'confirmed',
      upload_date: '2026-09-20T10:14:00Z',
      confidence_score: 0.98,
      extracted_summary: 'Balance: ₹8,45,200.50 | A/C: ••••4821 | Nominee: Geeta Sharma'
    },
    {
      id: 'doc-2',
      title: 'HDFC Home Loan Sanction Agreement',
      filename: 'hdfc_home_loan_agreement.pdf',
      file_type: 'application/pdf',
      file_size_bytes: 2097152,
      category: 'loan',
      status: 'confirmed',
      upload_date: '2026-09-20T10:22:00Z',
      confidence_score: 0.96,
      extracted_summary: 'Outstanding: ₹42,50,000 | EMI: ₹38,400/mo | Credit Shield: Yes'
    },
    {
      id: 'doc-3',
      title: 'LIC Jeevan Umang Policy Certificate',
      filename: 'lic_term_policy_99201482.pdf',
      file_type: 'application/pdf',
      file_size_bytes: 1572864,
      category: 'insurance',
      status: 'extracted',
      upload_date: '2026-09-22T14:30:00Z',
      confidence_score: 0.84,
      extracted_summary: 'Sum Assured: ₹50,00,000 | Nominee: Rahul Sharma (Low Confidence)'
    },
    {
      id: 'doc-4',
      title: 'EPFO Pension & PF Statement (UAN)',
      filename: 'epfo_member_passbook_uan.pdf',
      file_type: 'application/pdf',
      file_size_bytes: 845000,
      category: 'retirement',
      status: 'confirmed',
      upload_date: '2026-09-23T09:15:00Z',
      confidence_score: 0.95,
      extracted_summary: 'Total Corpus: ₹28,50,000 | EPS Pension Eligible: Yes'
    },
    {
      id: 'doc-5',
      title: 'Gurgaon Property Conveyance Deed',
      filename: 'conveyance_deed_oakwood_402.pdf',
      file_type: 'application/pdf',
      file_size_bytes: 3410000,
      category: 'property',
      status: 'confirmed',
      upload_date: '2026-09-24T11:45:00Z',
      confidence_score: 1.0,
      extracted_summary: 'Unit 402, Oakwood Towers | Value: ₹1,25,00,000 | Clear Title'
    },
    {
      id: 'doc-6',
      title: 'Zerodha Demat Portfolio Holding Statement',
      filename: 'zerodha_holding_statement_q3.pdf',
      file_type: 'application/pdf',
      file_size_bytes: 1220000,
      category: 'investment',
      status: 'confirmed',
      upload_date: '2026-09-25T16:00:00Z',
      confidence_score: 0.99,
      extracted_summary: '32 Equities & 8 Mutual Funds | Value: ₹34,20,000'
    }
  ]);

  // 2. Extraction Jobs with OCR Bounding Box Data
  const [extractionJobs, setExtractionJobs] = useState<Record<string, ExtractionJob>>({
    'doc-3': {
      id: 'job-3',
      document_id: 'doc-3',
      document_title: 'LIC Jeevan Umang Policy Certificate',
      status: 'completed',
      tee_enclave_id: 'enclave-sgx-fintech-01',
      tee_attestation_quote: 'SGX_QUOTE_VERIFIED_0xa3f8c901e4b8120d9f82d1c071239845',
      extracted_data_json: {
        policy_provider: 'LIC of India',
        policy_number: 'POL-99201482',
        sum_assured: 5000000,
        nominee_declared: 'Rahul Sharma (Son)',
        premium_due_date: '2026-11-15',
        claim_officer_contact: 'claims@licindia.in'
      },
      confidence_score: 0.84,
      low_confidence_fields_json: ['nominee_declared'],
      source_regions_json: {
        policy_provider: { page: 1, box: [80, 30, 220, 60], text: 'Life Insurance Corporation of India' },
        policy_number: { page: 1, box: [100, 110, 260, 140], text: 'Policy No: 99201482' },
        sum_assured: { page: 1, box: [140, 210, 330, 240], text: 'Basic Sum Assured: INR 50,00,000' },
        nominee_declared: { page: 2, box: [180, 310, 390, 340], text: 'Nominee Name: Rahul Sharma (Son, 24y)' }
      },
      created_at: '2026-09-22T14:30:10Z'
    }
  });

  // 3. Initial Test Cases: Assets
  const [assets, setAssets] = useState<AssetItem[]>([
    {
      id: 'asset-1',
      category: 'bank_account',
      name: 'SBI Savings Account',
      institution: 'State Bank of India',
      estimated_value: 845200.50,
      account_number_masked: '••••4821',
      is_confirmed: true,
      confidence_score: 0.98,
      status: 'confirmed',
      details_json: { branch: 'Connaught Place, New Delhi' }
    },
    {
      id: 'asset-2',
      category: 'insurance_payout',
      name: 'LIC Jeevan Umang Term Policy Claim',
      institution: 'LIC of India',
      estimated_value: 5000000.00,
      account_number_masked: 'POL-99201482',
      is_confirmed: false,
      confidence_score: 0.84,
      status: 'unconfirmed',
      details_json: { nominee: 'Rahul Sharma (Son)' }
    },
    {
      id: 'asset-3',
      category: 'retirement',
      name: 'EPFO Employee Provident Fund',
      institution: 'EPFO Regional Office Delhi',
      estimated_value: 2850000.00,
      account_number_masked: 'UAN ••••619',
      is_confirmed: true,
      confidence_score: 0.95,
      status: 'confirmed',
      details_json: { member_id: 'DLCPM00192830000182' }
    },
    {
      id: 'asset-4',
      category: 'investment',
      name: 'Zerodha Demat Portfolio (Stocks & Mutual Funds)',
      institution: 'Zerodha Broking / CDSL',
      estimated_value: 3420000.00,
      account_number_masked: 'DP ••••912',
      is_confirmed: true,
      confidence_score: 0.99,
      status: 'confirmed',
      details_json: { holdings_count: 40 }
    },
    {
      id: 'asset-5',
      category: 'property',
      name: 'Flat 402, Oakwood Towers, Gurgaon',
      institution: 'Haryana Revenue Authority',
      estimated_value: 12500000.00,
      account_number_masked: 'REG-2018-7741',
      is_confirmed: true,
      confidence_score: 1.0,
      status: 'confirmed',
      details_json: { area: '1850 sq ft' }
    }
  ]);

  // 4. Initial Test Cases: Liabilities
  const [liabilities, setLiabilities] = useState<LiabilityItem[]>([
    {
      id: 'liab-1',
      category: 'home_loan',
      name: 'HDFC Housing Finance Home Loan',
      creditor: 'HDFC Bank',
      total_amount: 4250000.00,
      emi_amount: 38400.00,
      due_date: '2026-10-05',
      is_confirmed: true,
      confidence_score: 0.96,
      status: 'confirmed',
      details_json: { interest_rate: '8.55%', loan_acc: 'HL-7729102' }
    },
    {
      id: 'liab-2',
      category: 'credit_card',
      name: 'HDFC Regalia Credit Card Balance',
      creditor: 'HDFC Bank Card Division',
      total_amount: 48500.00,
      emi_amount: 0,
      due_date: '2026-10-10',
      is_confirmed: true,
      confidence_score: 0.98,
      status: 'confirmed',
      details_json: { card_type: 'Visa Infinite' }
    }
  ]);

  // 5. Initial Test Cases: Actions with Explainable Priority
  const [actions, setActions] = useState<ActionItem[]>([
    {
      id: 'act-1',
      title: 'Notify HDFC Lender & Claim Credit Shield Waiver',
      description: 'Submit written notice to HDFC Bank Home Finance to stop default penalty interest and claim Credit Shield insurance to waive principal.',
      category: 'financial',
      priority: 'critical',
      urgency_score: 95,
      priority_reason: 'Recurring EMI liability (₹38,400/mo); imminent penalty fees & loan default risk if not frozen.',
      status: 'in_progress',
      due_date: '2026-10-05',
      assigned_member_id: 'member-2',
      assigned_member_name: 'Rahul Sharma',
      required_documents_json: ['Death Certificate', 'Loan Sanction Letter', 'Credit Shield Cover Certificate'],
      checklist_steps_json: [
        'Deliver certified death certificate to HDFC loan branch',
        'Request temporary freeze on auto-debit EMI',
        'Submit loan insurance claim form for full principal waiver'
      ],
      evidence_note: 'Submitted preliminary death certificate copy to Branch Manager Mr. Arvind on 24 Sep.'
    },
    {
      id: 'act-2',
      title: 'Confirm Nominee & File LIC Term Insurance Claim (₹50L)',
      description: 'Verify extracted nominee field in TEE review modal and file death claim with LIC of India.',
      category: 'financial',
      priority: 'critical',
      urgency_score: 90,
      priority_reason: 'Immediate liquidity (₹50,00,000 payout) for family closure; claim window deadline within 90 days.',
      status: 'pending',
      due_date: '2026-10-15',
      assigned_member_id: 'member-1',
      assigned_member_name: 'Rajesh Sharma',
      required_documents_json: ['Original LIC Policy', 'Certified Death Certificate', 'Claimant Cancelled Cheque'],
      checklist_steps_json: [
        'Complete human verification for nominee field',
        'Download LIC Claim Form 3783',
        'Submit document bundle to LIC Divisional Office'
      ]
    },
    {
      id: 'act-3',
      title: 'Submit EPFO Form 10D & 20 for PF / Pension Transfer',
      description: 'Apply for transmission of provident fund (₹28.5L) and monthly widow/survivor pension under EPS scheme.',
      category: 'retirement',
      priority: 'high',
      urgency_score: 82,
      priority_reason: 'Statutory government pension benefits & large liquid corpus release for beneficiaries.',
      status: 'pending',
      due_date: '2026-10-25',
      assigned_member_id: 'member-2',
      assigned_member_name: 'Rahul Sharma',
      required_documents_json: ['EPFO Joint Declaration Form', 'Death Certificate', 'Heirship Proof'],
      checklist_steps_json: [
        'Attest Form 20 with last employer HR',
        'Submit joint declaration to EPFO Delhi South Office'
      ]
    },
    {
      id: 'act-4',
      title: 'Transmit SBI Savings Balance & Close Account',
      description: 'Visit SBI Connaught Place Branch to transmit ₹8,45,200.50 balance to designated nominee.',
      category: 'financial',
      priority: 'high',
      urgency_score: 76,
      priority_reason: 'Liquid bank balance needed for immediate estate tax and administrative expenses.',
      status: 'pending',
      due_date: '2026-11-01',
      assigned_member_id: 'member-1',
      assigned_member_name: 'Rajesh Sharma',
      required_documents_json: ['SBI Passbook', 'Death Certificate', 'Nominee KYC Documents'],
      checklist_steps_json: [
        'Fill Deceased Claim Form Annexure-1',
        'Submit KYC of nominee Geeta Sharma'
      ]
    },
    {
      id: 'act-5',
      title: 'Transmit Zerodha Demat Securities to Nominee Account',
      description: 'Submit Transmission Request Form (TRF) to Zerodha to transfer 32 equity holdings and 8 mutual funds.',
      category: 'investment',
      priority: 'medium',
      urgency_score: 65,
      priority_reason: 'Protect portfolio from market fluctuations and enable orderly redistribution.',
      status: 'pending',
      due_date: '2026-11-20',
      assigned_member_id: 'member-1',
      assigned_member_name: 'Rajesh Sharma',
      required_documents_json: ['Client Master Report (CMR)', 'Death Certificate', 'Transmission Request Form'],
      checklist_steps_json: [
        'Obtain CMR copy from nominee demat broker',
        'Courier notarized death certificate to Zerodha Bangalore'
      ]
    },
    {
      id: 'act-6',
      title: 'Gurgaon Municipal Property Title Mutation',
      description: 'Submit mutation application for Flat 402 Oakwood Towers at Municipal Corporation Gurgaon.',
      category: 'legal',
      priority: 'low',
      urgency_score: 45,
      priority_reason: 'Property tax record update; no immediate financial penalty.',
      status: 'pending',
      due_date: '2027-01-15',
      assigned_member_id: 'member-3',
      assigned_member_name: 'Adv. Anita Mehta',
      required_documents_json: ['Conveyance Deed Copy', 'Legal Heirship Certificate', 'Property Tax NOC'],
      checklist_steps_json: [
        'Draft legal heirship affidavit with attorney',
        'File mutation online at Haryana Revenue portal'
      ]
    }
  ]);

  // 6. Initial Test Cases: Vault Secrets
  const [vaultEntries, setVaultEntries] = useState<VaultItem[]>([
    {
      id: 'vault-1',
      title: 'Registered Family Will & Testament (Original Reference)',
      category: 'document',
      institution: 'Mehta & Associates Legal',
      access_level: 'release_on_verification',
      deadman_trigger_days: 30,
      content: 'Original physical will stored in Locker #402, SBI Connaught Place Branch. Key #KEY-7782 held with Adv. Anita Mehta.',
      created_at: '2026-08-15T10:00:00Z'
    },
    {
      id: 'vault-2',
      title: 'Zerodha Demat Trading Account Credentials',
      category: 'credential',
      institution: 'Zerodha Broking Ltd',
      access_level: 'private',
      deadman_trigger_days: 14,
      content: 'Client ID: AB8912 | Password: VaultSecretPass2026! | TOTP Seed: JBSWY3DPEHPK3PXP',
      created_at: '2026-08-20T11:30:00Z'
    },
    {
      id: 'vault-3',
      title: 'Ancestral Land Title Deed - Jaipur Plot 14B',
      category: 'key',
      institution: 'Jaipur Revenue Dept',
      access_level: 'shared',
      deadman_trigger_days: 60,
      content: 'Khasra No 104/2, Village Sanganer, Jaipur. Registry copy in home safe; Original deposited with HDFC Safe Custody.',
      created_at: '2026-08-25T14:15:00Z'
    },
    {
      id: 'vault-4',
      title: 'Primary NetBanking Master Security PIN & Backup Codes',
      category: 'credential',
      institution: 'State Bank of India',
      access_level: 'release_on_verification',
      deadman_trigger_days: 21,
      content: 'CIF No: 8819201928 | User ID: suresh_sharma_online | Security Answers: Born=Jaipur, School=DPS',
      created_at: '2026-09-01T09:00:00Z'
    }
  ]);

  // 7. Initial Test Cases: Family Members with Scoped Least-Privilege Permissions
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberItem[]>([
    {
      id: 'member-1',
      name: 'Rajesh Sharma',
      email: 'owner@estate.demo',
      relationship_type: 'Primary Executor',
      role: 'owner',
      permissions_json: { vault: true, documents: true, estate: true, actions: true, audit: true },
      status: 'active',
      joined_at: '2026-08-01T10:00:00Z'
    },
    {
      id: 'member-2',
      name: 'Rahul Sharma',
      email: 'rahul@estate.demo',
      relationship_type: 'Son & Beneficiary',
      role: 'family_member',
      permissions_json: { vault: false, documents: true, estate: true, actions: true, audit: false },
      status: 'active',
      joined_at: '2026-08-10T12:00:00Z'
    },
    {
      id: 'member-3',
      name: 'Adv. Anita Mehta',
      email: 'anita@estate.demo',
      relationship_type: 'Estate Counsel',
      role: 'executor',
      permissions_json: { vault: true, documents: true, estate: true, actions: true, audit: true },
      status: 'active',
      joined_at: '2026-08-12T15:00:00Z'
    }
  ]);

  // 8. Initial Test Cases: Security Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'aud-1',
      user_name: 'Rajesh Sharma',
      action_type: 'ASSIGN_TASK',
      description: 'Assigned critical task "Notify HDFC Lender & Claim Credit Shield Waiver" to Rahul Sharma',
      target_resource: 'ActionItem/act-1',
      ip_address: '192.168.1.104',
      timestamp: '2026-09-26T08:30:00Z'
    },
    {
      id: 'aud-2',
      user_name: 'TEE Enclave Worker',
      action_type: 'TEE_EXTRACT',
      description: 'TEE Enclave "enclave-sgx-fintech-01" performed isolated OCR on "lic_term_policy_99201482.pdf" (Score: 84%). 1 field flagged for review.',
      target_resource: 'ExtractionJob/job-3',
      ip_address: '10.0.4.12',
      timestamp: '2026-09-26T07:15:00Z'
    },
    {
      id: 'aud-3',
      user_name: 'Rahul Sharma',
      action_type: 'UPLOAD_DOC',
      description: 'Uploaded document "lic_term_policy_99201482.pdf" (1.50 MB) to secure enclave buffer',
      target_resource: 'Document/doc-3',
      ip_address: '192.168.1.109',
      timestamp: '2026-09-26T07:14:20Z'
    },
    {
      id: 'aud-4',
      user_name: 'Rajesh Sharma',
      action_type: 'VIEW_VAULT',
      description: 'Decrypted and viewed vault entry "Zerodha Demat Trading Account Credentials"',
      target_resource: 'Vault/vault-2',
      ip_address: '192.168.1.104',
      timestamp: '2026-09-25T18:22:00Z'
    },
    {
      id: 'aud-5',
      user_name: 'Rajesh Sharma',
      action_type: 'PERM_UPDATE',
      description: 'Updated section permissions for Rahul Sharma (Documents: Granted, Vault: Restricted)',
      target_resource: 'Member/member-2',
      ip_address: '192.168.1.104',
      timestamp: '2026-09-25T11:05:00Z'
    }
  ]);

  // Derived Computed Values
  const totalAssetValue = assets.reduce((sum, a) => sum + a.estimated_value, 0);
  const totalLiabilityValue = liabilities.reduce((sum, l) => sum + l.total_amount, 0);
  const netEstateValue = totalAssetValue - totalLiabilityValue;
  const unconfirmedCount = assets.filter(a => !a.is_confirmed).length + liabilities.filter(l => !l.is_confirmed).length;
  
  const completedActionsCount = actions.filter(a => a.status === 'completed').length;
  const closureProgressPercent = actions.length > 0 ? Math.round((completedActionsCount / actions.length) * 100) : 0;

  // Handler: Upload Document & Trigger TEE Job
  const uploadDocument = async (file: File): Promise<DocumentItem> => {
    const docId = 'doc-' + Date.now();
    const jobId = 'job-' + Date.now();
    
    const newDoc: DocumentItem = {
      id: docId,
      title: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, ' '),
      filename: file.name,
      file_type: file.type || 'application/pdf',
      file_size_bytes: file.size,
      category: file.name.toLowerCase().includes('loan') ? 'loan' : 'bank',
      status: 'extracted',
      upload_date: new Date().toISOString(),
      confidence_score: 0.92,
      extracted_summary: `Extracted via Intel SGX Enclave · Confidence 92%`,
      job_id: jobId
    };

    const newJob: ExtractionJob = {
      id: jobId,
      document_id: docId,
      document_title: newDoc.title,
      status: 'completed',
      tee_enclave_id: 'enclave-sgx-fintech-01',
      tee_attestation_quote: 'SGX_QUOTE_VERIFIED_' + Math.random().toString(16).substring(2, 10),
      extracted_data_json: {
        document_title: newDoc.title,
        institution: 'Verified Financial Institution',
        estimated_amount: 250000.00,
        account_ref: 'REF-' + Math.floor(100000 + Math.random() * 900000)
      },
      confidence_score: 0.92,
      low_confidence_fields_json: [],
      source_regions_json: {
        entity_name: { page: 1, box: [100, 150, 300, 180], text: newDoc.title },
        amount: { page: 1, box: [190, 220, 340, 250], text: 'INR 2,50,000.00' }
      },
      created_at: new Date().toISOString()
    };

    setDocuments(prev => [newDoc, ...prev]);
    setExtractionJobs(prev => ({ ...prev, [docId]: newJob }));

    // Audit Event
    const newAudit: AuditLogItem = {
      id: 'aud-' + Date.now(),
      user_name: 'Current User',
      action_type: 'UPLOAD_DOC',
      description: `Uploaded "${file.name}" (${(file.size / 1024 / 1024).toFixed(2)} MB) to TEE enclave buffer`,
      target_resource: `Document/${docId}`,
      ip_address: '127.0.0.1',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    return newDoc;
  };

  // Handler: Confirm Extraction & Promote to Estate Inventory
  const confirmExtraction = (jobId: string, payload: {
    name: string;
    institution: string;
    amount: number;
    entityType: 'asset' | 'liability';
    category: string;
    confirmedFields: Record<string, any>;
  }) => {
    // 1. Mark document as confirmed
    setDocuments(prev => prev.map(doc => {
      if (doc.id === 'doc-3' || doc.job_id === jobId) {
        return { ...doc, status: 'confirmed', confidence_score: 1.0 };
      }
      return doc;
    }));

    // 2. Promote to Asset or Liability in Estate Inventory
    if (payload.entityType === 'asset') {
      setAssets(prev => {
        const existingIdx = prev.findIndex(a => a.name.includes(payload.name) || a.institution === payload.institution);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            is_confirmed: true,
            status: 'confirmed',
            estimated_value: payload.amount,
            confidence_score: 1.0
          };
          return updated;
        } else {
          return [
            {
              id: 'asset-' + Date.now(),
              category: payload.category,
              name: payload.name,
              institution: payload.institution,
              estimated_value: payload.amount,
              account_number_masked: payload.confirmedFields?.policy_number || '••••' + Math.floor(1000 + Math.random() * 9000),
              is_confirmed: true,
              confidence_score: 1.0,
              status: 'confirmed',
              details_json: payload.confirmedFields
            },
            ...prev
          ];
        }
      });
    } else {
      setLiabilities(prev => [
        {
          id: 'liab-' + Date.now(),
          category: payload.category,
          name: payload.name,
          creditor: payload.institution,
          total_amount: payload.amount,
          emi_amount: payload.confirmedFields?.emi_amount || 0,
          due_date: '2026-10-15',
          is_confirmed: true,
          confidence_score: 1.0,
          status: 'confirmed',
          details_json: payload.confirmedFields
        },
        ...prev
      ]);
    }

    // 3. Audit Log
    const newAudit: AuditLogItem = {
      id: 'aud-' + Date.now(),
      user_name: 'Rajesh Sharma',
      action_type: 'CONFIRM_EXTRACTION',
      description: `Confirmed extraction for "${payload.name}" (₹${payload.amount.toLocaleString('en-IN')}). Promoted to verified Estate Inventory.`,
      target_resource: `ExtractionJob/${jobId}`,
      ip_address: '127.0.0.1',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Handler: Update Action Status & Evidence
  const updateActionStatus = (actionId: string, newStatus: 'pending' | 'in_progress' | 'completed', note?: string) => {
    setActions(prev => prev.map(a => {
      if (a.id === actionId) {
        return {
          ...a,
          status: newStatus,
          evidence_note: note || a.evidence_note
        };
      }
      return a;
    }));

    const act = actions.find(a => a.id === actionId);
    const newAudit: AuditLogItem = {
      id: 'aud-' + Date.now(),
      user_name: 'Current User',
      action_type: 'TASK_STATUS_UPDATE',
      description: `Updated status of "${act?.title || actionId}" to ${newStatus.toUpperCase()}${note ? ` · Evidence: "${note}"` : ''}`,
      target_resource: `ActionItem/${actionId}`,
      ip_address: '127.0.0.1',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Handler: Assign Action
  const assignAction = (actionId: string, memberId: string) => {
    const mem = familyMembers.find(m => m.id === memberId);
    setActions(prev => prev.map(a => {
      if (a.id === actionId) {
        return {
          ...a,
          assigned_member_id: memberId,
          assigned_member_name: mem?.name
        };
      }
      return a;
    }));

    const act = actions.find(a => a.id === actionId);
    const newAudit: AuditLogItem = {
      id: 'aud-' + Date.now(),
      user_name: 'Rajesh Sharma',
      action_type: 'ASSIGN_TASK',
      description: `Assigned closure task "${act?.title}" to ${mem?.name || 'family member'}`,
      target_resource: `ActionItem/${actionId}`,
      ip_address: '127.0.0.1',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Handler: Add Vault Entry
  const addVaultEntry = (entry: Omit<VaultItem, 'id' | 'created_at'>) => {
    const newId = 'vault-' + Date.now();
    const newEntry: VaultItem = {
      ...entry,
      id: newId,
      created_at: new Date().toISOString()
    };
    setVaultEntries(prev => [newEntry, ...prev]);

    const newAudit: AuditLogItem = {
      id: 'aud-' + Date.now(),
      user_name: 'Rajesh Sharma',
      action_type: 'CREATE_VAULT',
      description: `Created encrypted vault entry "${entry.title}" (${entry.access_level}, trigger: ${entry.deadman_trigger_days}d)`,
      target_resource: `Vault/${newId}`,
      ip_address: '127.0.0.1',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Handler: Delete Vault Entry
  const deleteVaultEntry = (id: string) => {
    const target = vaultEntries.find(v => v.id === id);
    setVaultEntries(prev => prev.filter(v => v.id !== id));

    const newAudit: AuditLogItem = {
      id: 'aud-' + Date.now(),
      user_name: 'Rajesh Sharma',
      action_type: 'DELETE_VAULT',
      description: `Deleted vault entry "${target?.title || id}"`,
      target_resource: `Vault/${id}`,
      ip_address: '127.0.0.1',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Handler: Update Member Permission
  const updateMemberPermissions = (memberId: string, sectionKey: string, value: boolean) => {
    setFamilyMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          permissions_json: {
            ...m.permissions_json,
            [sectionKey]: value
          }
        };
      }
      return m;
    }));

    const mem = familyMembers.find(m => m.id === memberId);
    const newAudit: AuditLogItem = {
      id: 'aud-' + Date.now(),
      user_name: 'Rajesh Sharma',
      action_type: 'PERM_UPDATE',
      description: `Updated permissions for ${mem?.name}: ${sectionKey.toUpperCase()} = ${value ? 'GRANTED' : 'REVOKED'}`,
      target_resource: `Member/${memberId}`,
      ip_address: '127.0.0.1',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Handler: Add Family Member
  const addFamilyMember = (data: { name: string; email: string; relationship: string; role: 'family_member' | 'executor' }) => {
    const newId = 'member-' + Date.now();
    const newMember: FamilyMemberItem = {
      id: newId,
      name: data.name,
      email: data.email,
      relationship_type: data.relationship,
      role: data.role,
      permissions_json: {
        vault: data.role === 'executor',
        documents: true,
        estate: true,
        actions: true,
        audit: data.role === 'executor'
      },
      status: 'invited',
      joined_at: new Date().toISOString()
    };
    setFamilyMembers(prev => [...prev, newMember]);

    const newAudit: AuditLogItem = {
      id: 'aud-' + Date.now(),
      user_name: 'Rajesh Sharma',
      action_type: 'INVITE_MEMBER',
      description: `Invited ${data.name} (${data.relationship}) as ${data.role}`,
      target_resource: `Member/${newId}`,
      ip_address: '127.0.0.1',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  return (
    <EstateContext.Provider value={{
      documents,
      extractionJobs,
      assets,
      liabilities,
      actions,
      vaultEntries,
      familyMembers,
      auditLogs,
      totalAssetValue,
      totalLiabilityValue,
      netEstateValue,
      unconfirmedCount,
      closureProgressPercent,
      uploadDocument,
      confirmExtraction,
      updateActionStatus,
      assignAction,
      addVaultEntry,
      deleteVaultEntry,
      updateMemberPermissions,
      addFamilyMember
    }}>
      {children}
    </EstateContext.Provider>
  );
};

export const useEstate = () => {
  const context = useContext(EstateContext);
  if (!context) {
    throw new Error('useEstate must be used within an EstateProvider');
  }
  return context;
};
