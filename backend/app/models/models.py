import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="owner") # owner, beneficiary, executor
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class VaultEntry(Base):
    __tablename__ = "vault_entries"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False) # document, account, credential, note, key, contact
    encrypted_content = Column(Text, nullable=False) # AES encrypted payload or note
    institution = Column(String, nullable=True)
    access_level = Column(String, default="private") # private, shared, release_on_verification
    deadman_trigger_days = Column(Integer, default=30) # Dead man switch inactivity check days
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class EstateCase(Base):
    __tablename__ = "estate_cases"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    deceased_name = Column(String, nullable=False)
    date_of_passing = Column(String, nullable=True)
    status = Column(String, default="active") # active, archived, closed
    primary_owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    summary_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    members = relationship("EstateMember", back_populates="estate", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="estate", cascade="all, delete-orphan")
    assets = relationship("Asset", back_populates="estate", cascade="all, delete-orphan")
    liabilities = relationship("Liability", back_populates="estate", cascade="all, delete-orphan")
    actions = relationship("ActionItem", back_populates="estate", cascade="all, delete-orphan")

class EstateMember(Base):
    __tablename__ = "estate_members"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    estate_id = Column(String, ForeignKey("estate_cases.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    relationship_type = Column(String, nullable=False) # spouse, child, sibling, executor, attorney
    role = Column(String, default="family_member")
    permissions_json = Column(JSON, default=dict) # section level permissions: vault, documents, estate, actions, audit
    status = Column(String, default="invited") # active, invited, pending
    joined_at = Column(DateTime, default=datetime.utcnow)
    
    estate = relationship("EstateCase", back_populates="members")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    estate_id = Column(String, ForeignKey("estate_cases.id"), nullable=False)
    uploaded_by_id = Column(String, ForeignKey("users.id"), nullable=True)
    title = Column(String, nullable=False)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False) # pdf, image, doc
    file_path = Column(String, nullable=False)
    file_size_bytes = Column(Integer, default=0)
    status = Column(String, default="uploaded") # uploaded, processing_tee, extracted, confirmed, error
    upload_date = Column(DateTime, default=datetime.utcnow)
    
    estate = relationship("EstateCase", back_populates="documents")
    extraction_jobs = relationship("ExtractionJob", back_populates="document", cascade="all, delete-orphan")

class ExtractionJob(Base):
    __tablename__ = "extraction_jobs"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    status = Column(String, default="queued") # queued, processing_tee, completed, failed
    tee_enclave_id = Column(String, default="enclave-sim-0928")
    tee_attestation_quote = Column(String, nullable=True)
    extracted_data_json = Column(JSON, default=dict)
    confidence_score = Column(Float, default=0.0) # 0.0 to 1.0
    low_confidence_fields_json = Column(JSON, default=list) # fields requiring human review
    source_regions_json = Column(JSON, default=dict) # bounding boxes per field
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    document = relationship("Document", back_populates="extraction_jobs")

class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    estate_id = Column(String, ForeignKey("estate_cases.id"), nullable=False)
    document_id = Column(String, ForeignKey("documents.id"), nullable=True)
    category = Column(String, nullable=False) # bank_account, investment, property, insurance_payout, vehicle, retirement, crypto_legacy, other
    name = Column(String, nullable=False)
    institution = Column(String, nullable=True)
    estimated_value = Column(Float, default=0.0)
    account_number_masked = Column(String, nullable=True)
    is_confirmed = Column(Boolean, default=False)
    confidence_score = Column(Float, default=1.0)
    status = Column(String, default="unconfirmed") # unconfirmed, confirmed, in_claim, closed
    details_json = Column(JSON, default=dict)
    confirmed_by_id = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    estate = relationship("EstateCase", back_populates="assets")

class Liability(Base):
    __tablename__ = "liabilities"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    estate_id = Column(String, ForeignKey("estate_cases.id"), nullable=False)
    document_id = Column(String, ForeignKey("documents.id"), nullable=True)
    category = Column(String, nullable=False) # home_loan, personal_loan, credit_card, tax_due, utility_bill, medical_bill, subscription, other
    name = Column(String, nullable=False)
    creditor = Column(String, nullable=True)
    total_amount = Column(Float, default=0.0)
    emi_amount = Column(Float, default=0.0)
    due_date = Column(String, nullable=True)
    is_confirmed = Column(Boolean, default=False)
    confidence_score = Column(Float, default=1.0)
    status = Column(String, default="unconfirmed") # unconfirmed, confirmed, servicing, settled
    details_json = Column(JSON, default=dict)
    confirmed_by_id = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    estate = relationship("EstateCase", back_populates="liabilities")

class ActionItem(Base):
    __tablename__ = "action_items"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    estate_id = Column(String, ForeignKey("estate_cases.id"), nullable=False)
    related_asset_id = Column(String, ForeignKey("assets.id"), nullable=True)
    related_liability_id = Column(String, ForeignKey("liabilities.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False) # financial, legal, administrative, property, subscriptions
    priority = Column(String, default="medium") # critical, high, medium, low
    urgency_score = Column(Integer, default=50) # 0 to 100 explainable score
    priority_reason = Column(Text, nullable=False) # Explainable priority justification
    status = Column(String, default="pending") # pending, in_progress, evidence_submitted, completed
    due_date = Column(String, nullable=True)
    assigned_member_id = Column(String, ForeignKey("estate_members.id"), nullable=True)
    assigned_member_name = Column(String, nullable=True)
    required_documents_json = Column(JSON, default=list) # checklist of required documents
    checklist_steps_json = Column(JSON, default=list) # steps to execute
    dependencies_json = Column(JSON, default=list) # ids of prerequisite actions
    created_at = Column(DateTime, default=datetime.utcnow)
    
    estate = relationship("EstateCase", back_populates="actions")
    evidences = relationship("TaskEvidence", back_populates="action", cascade="all, delete-orphan")

class TaskEvidence(Base):
    __tablename__ = "task_evidences"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    action_id = Column(String, ForeignKey("action_items.id"), nullable=False)
    uploaded_by_id = Column(String, ForeignKey("users.id"), nullable=False)
    uploaded_by_name = Column(String, nullable=False)
    note = Column(Text, nullable=True)
    file_path = Column(String, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    action = relationship("ActionItem", back_populates="evidences")

class AuditEvent(Base):
    __tablename__ = "audit_events"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    estate_id = Column(String, ForeignKey("estate_cases.id"), nullable=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    user_name = Column(String, nullable=False)
    action_type = Column(String, nullable=False) # LOGIN, VIEW_VAULT, UPLOAD_DOC, TEE_EXTRACT, CONFIRM_DATA, ASSIGN_TASK, UPDATE_PERMISSION, DELEGATE_ACCESS
    description = Column(Text, nullable=False)
    target_resource = Column(String, nullable=True)
    ip_address = Column(String, default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="info") # urgent, info, task_assigned, document_ready
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
