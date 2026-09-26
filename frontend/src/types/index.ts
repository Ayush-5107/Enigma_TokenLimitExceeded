export type UserRole = 'owner' | 'family_member' | 'executor' | 'legal_counsel' | 'beneficiary';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

export interface VaultEntry {
  id: string;
  category: 'will' | 'demat' | 'bank' | 'property' | 'insurance' | 'tax' | 'crypto' | 'custom';
  title: string;
  description?: string;
  encrypted_secret: string;
  access_level: 'private' | 'shared_on_death' | 'shared_now';
  created_at: string;
  updated_at: string;
}

export interface DocumentItem {
  id: string;
  filename: string;
  file_type: 'bank_statement' | 'insurance_policy' | 'loan_agreement' | 'property_deed' | 'will' | 'tax_returns';
  uploaded_by: string;
  upload_date: string;
  status: 'QUEUED' | 'TEE_PROCESSING' | 'EXTRACTED' | 'CONFIRMED' | 'FAILED';
  file_size_bytes: number;
  confidence_score: number;
}

export interface ExtractedField {
  id: string;
  field_name: string;
  extracted_value: string;
  confidence: number;
  is_confirmed: boolean;
  source_page: number;
  source_bounding_box?: string;
}

export interface ExtractionJob {
  id: string;
  document_id: string;
  document_name: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  tee_enclave: 'SGX_ACTIVE' | 'SEV_ACTIVE' | 'LOCAL_SIMULATED';
  confidence_score: number;
  extracted_fields: ExtractedField[];
  created_at: string;
}

export interface AssetRecord {
  id: string;
  asset_name: string;
  category: 'BANK_ACCOUNT' | 'INSURANCE' | 'MUTUAL_FUND' | 'REAL_ESTATE' | 'VEHICLE' | 'RETIREMENT' | 'OTHER';
  institution: string;
  account_number_masked: string;
  estimated_value_inr: number;
  nominee_status: 'REGISTERED' | 'MISSING' | 'PENDING_UPDATE';
  status: 'UNCLAIMED' | 'IN_PROCESS' | 'SETTLED';
  source_document_id?: string;
}

export interface LiabilityRecord {
  id: string;
  liability_name: string;
  category: 'HOME_LOAN' | 'PERSONAL_LOAN' | 'CREDIT_CARD' | 'VEHICLE_LOAN' | 'TAX_DUE' | 'OTHER';
  lender_institution: string;
  account_number_masked: string;
  outstanding_amount_inr: number;
  insurance_covered: boolean;
  monthly_emi_inr: number;
  status: 'ACTIVE' | 'IN_SETTLEMENT' | 'CLOSED';
}

export interface ActionItem {
  id: string;
  title: string;
  category: 'LOAN_CLAIM' | 'INSURANCE_CLAIM' | 'BANK_SETTLEMENT' | 'PROPERTY_TRANSFER' | 'TAX_CLEARANCE';
  priority_score: number; // 0-100
  urgency: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  priority_reason: string;
  due_date: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  assigned_to?: string;
  required_documents: string[];
  entity_ref_id?: string;
}

export interface FamilyMember {
  id: string;
  full_name: string;
  email: string;
  relationship: 'Spouse' | 'Son' | 'Daughter' | 'Executor' | 'Legal Counsel' | 'Trusted Friend';
  access_role: UserRole;
  section_permissions: {
    estate: boolean;
    vault: boolean;
    documents: boolean;
    actions: boolean;
    audit: boolean;
  };
  deadman_notified: boolean;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor_name: string;
  actor_email: string;
  action_type: 'VIEW_VAULT' | 'TEE_EXTRACT' | 'CONFIRM_DATA' | 'UPDATE_PERMISSION' | 'ASSIGN_TASK' | 'LOGIN';
  resource_name: string;
  ip_address: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
}
