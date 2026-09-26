from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    phone: Optional[str] = None
    role: Optional[str] = "owner"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    phone: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Vault Schemas
class VaultEntryCreate(BaseModel):
    title: str
    category: str
    content: str # Will be encrypted
    institution: Optional[str] = None
    access_level: Optional[str] = "private"
    deadman_trigger_days: Optional[int] = 30
    metadata: Optional[Dict[str, Any]] = {}

class VaultEntryResponse(BaseModel):
    id: str
    owner_id: str
    title: str
    category: str
    institution: Optional[str] = None
    access_level: str
    deadman_trigger_days: int
    metadata_json: Dict[str, Any]
    content: Optional[str] = None # Decrypted only when authorized
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# Document Schemas
class DocumentResponse(BaseModel):
    id: str
    estate_id: str
    uploaded_by_id: Optional[str] = None
    title: str
    filename: str
    file_type: str
    file_size_bytes: int
    status: str
    upload_date: datetime
    class Config:
        from_attributes = True

# TEE Extraction Job Schemas
class ExtractionJobCreate(BaseModel):
    document_id: str

class ExtractionJobResponse(BaseModel):
    id: str
    document_id: str
    status: str
    tee_enclave_id: str
    tee_attestation_quote: Optional[str] = None
    extracted_data_json: Dict[str, Any]
    confidence_score: float
    low_confidence_fields_json: List[str]
    source_regions_json: Dict[str, Any]
    created_at: datetime
    completed_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class ExtractionConfirmRequest(BaseModel):
    confirmed_fields: Dict[str, Any]
    entity_type: str # asset or liability
    category: str
    name: str
    institution_or_creditor: str
    amount_or_value: float
    account_or_ref_number: Optional[str] = None
    due_date: Optional[str] = None

# Estate Schemas
class EstateCaseCreate(BaseModel):
    title: str
    deceased_name: str
    date_of_passing: Optional[str] = None

class EstateCaseResponse(BaseModel):
    id: str
    title: str
    deceased_name: str
    date_of_passing: Optional[str] = None
    status: str
    primary_owner_id: str
    summary_json: Dict[str, Any]
    created_at: datetime
    class Config:
        from_attributes = True

# Asset & Liability Schemas
class AssetCreate(BaseModel):
    category: str
    name: str
    institution: Optional[str] = None
    estimated_value: float = 0.0
    account_number_masked: Optional[str] = None
    details_json: Optional[Dict[str, Any]] = {}

class AssetResponse(BaseModel):
    id: str
    estate_id: str
    document_id: Optional[str] = None
    category: str
    name: str
    institution: Optional[str] = None
    estimated_value: float
    account_number_masked: Optional[str] = None
    is_confirmed: bool
    confidence_score: float
    status: str
    details_json: Dict[str, Any]
    created_at: datetime
    class Config:
        from_attributes = True

class LiabilityCreate(BaseModel):
    category: str
    name: str
    creditor: Optional[str] = None
    total_amount: float = 0.0
    emi_amount: float = 0.0
    due_date: Optional[str] = None
    details_json: Optional[Dict[str, Any]] = {}

class LiabilityResponse(BaseModel):
    id: str
    estate_id: str
    document_id: Optional[str] = None
    category: str
    name: str
    creditor: Optional[str] = None
    total_amount: float
    emi_amount: float
    due_date: Optional[str] = None
    is_confirmed: bool
    confidence_score: float
    status: str
    details_json: Dict[str, Any]
    created_at: datetime
    class Config:
        from_attributes = True

# Action & Task Schemas
class ActionItemCreate(BaseModel):
    title: str
    description: str
    category: str
    priority: str = "medium"
    urgency_score: int = 50
    priority_reason: str
    due_date: Optional[str] = None
    required_documents_json: Optional[List[str]] = []
    checklist_steps_json: Optional[List[str]] = []

class ActionItemResponse(BaseModel):
    id: str
    estate_id: str
    related_asset_id: Optional[str] = None
    related_liability_id: Optional[str] = None
    title: str
    description: str
    category: str
    priority: str
    urgency_score: int
    priority_reason: str
    status: str
    due_date: Optional[str] = None
    assigned_member_id: Optional[str] = None
    assigned_member_name: Optional[str] = None
    required_documents_json: List[str]
    checklist_steps_json: List[str]
    dependencies_json: List[str]
    created_at: datetime
    class Config:
        from_attributes = True

class ActionAssignRequest(BaseModel):
    member_id: str

class TaskStatusUpdate(BaseModel):
    status: str # pending, in_progress, evidence_submitted, completed
    note: Optional[str] = None

# Family Schemas
class FamilyMemberCreate(BaseModel):
    name: str
    email: str
    relationship_type: str
    role: str = "family_member"
    permissions: Optional[Dict[str, bool]] = {
        "vault": False,
        "documents": True,
        "estate": True,
        "actions": True,
        "audit": False
    }

class FamilyMemberResponse(BaseModel):
    id: str
    estate_id: str
    user_id: Optional[str] = None
    name: str
    email: str
    relationship_type: str
    role: str
    permissions_json: Dict[str, bool]
    status: str
    joined_at: datetime
    class Config:
        from_attributes = True

class PermissionUpdateRequest(BaseModel):
    permissions: Dict[str, bool]

# Audit & Notification Schemas
class AuditEventResponse(BaseModel):
    id: str
    estate_id: Optional[str] = None
    user_id: Optional[str] = None
    user_name: str
    action_type: str
    description: str
    target_resource: Optional[str] = None
    ip_address: str
    timestamp: datetime
    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes = True
