import sys
import os
from datetime import datetime

# Adjust Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.app.core.database import Base, engine, SessionLocal
from backend.app.models.models import (
    User, VaultEntry, EstateCase, EstateMember, Document, ExtractionJob,
    Asset, Liability, ActionItem, AuditEvent, Notification
)
from backend.app.security.auth import get_password_hash
from backend.app.security.encryption import encrypt_data

def seed_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 1. Users
        owner = User(
            id="user-owner-1",
            email="owner@estate.demo",
            hashed_password=get_password_hash("password123"),
            full_name="Rajesh Sharma",
            role="owner",
            phone="+91 98765 43210"
        )
        son = User(
            id="user-family-1",
            email="rahul@estate.demo",
            hashed_password=get_password_hash("password123"),
            full_name="Rahul Sharma",
            role="beneficiary",
            phone="+91 98111 22334"
        )
        lawyer = User(
            id="user-family-2",
            email="anita@estate.demo",
            hashed_password=get_password_hash("password123"),
            full_name="Adv. Anita Mehta",
            role="executor",
            phone="+91 98222 33445"
        )
        db.add_all([owner, son, lawyer])
        db.commit()

        # 2. Legacy Vault Entries
        v1 = VaultEntry(
            id="vault-1",
            owner_id=owner.id,
            title="Primary Family Will & Testament (Copy)",
            category="document",
            institution="Mehta & Associates Legal",
            access_level="release_on_verification",
            deadman_trigger_days=30,
            encrypted_content=encrypt_data("Original physical will stored in Locker #402 at SBI Connaught Place Branch. Executor: Adv. Anita Mehta."),
            metadata_json={"witness_names": ["Karan Malhotra", "Deepak Verma"], "locker_key_ref": "KEY-7782"}
        )
        v2 = VaultEntry(
            id="vault-2",
            owner_id=owner.id,
            title="Zerodha Demat Trading Account Credentials",
            category="credential",
            institution="Zerodha Broking Ltd",
            access_level="private",
            deadman_trigger_days=14,
            encrypted_content=encrypt_data("Client ID: AB8912 | Password: SecretVaultPass2026! | TOTP Seed: JBSWY3DPEHPK3PXP"),
            metadata_json={"portfolio_type": "Equity & Mutual Funds"}
        )
        v3 = VaultEntry(
            id="vault-3",
            owner_id=owner.id,
            title="Ancestral Land Deed - Jaipur Plot 14B",
            category="key",
            institution="Jaipur Revenue Dept",
            access_level="shared",
            deadman_trigger_days=60,
            encrypted_content=encrypt_data("Khasra No 104/2, Village Sanganer, Jaipur. Registry Original with HDFC Bank Safe Keep."),
            metadata_json={"area_sqft": 3600}
        )
        db.add_all([v1, v2, v3])

        # 3. Estate Case
        estate = EstateCase(
            id="estate-case-1",
            title="Late Suresh Sharma Estate Closure",
            deceased_name="Suresh Sharma",
            date_of_passing="2026-08-15",
            status="active",
            primary_owner_id=owner.id,
            summary_json={"notes": "Active family financial closure process for assets and liabilities."}
        )
        db.add(estate)
        db.commit()

        # 4. Family Members & Section Permissions
        m1 = EstateMember(
            id="member-1",
            estate_id=estate.id,
            user_id=owner.id,
            name="Rajesh Sharma",
            email="owner@estate.demo",
            relationship_type="Son / Primary Executor",
            role="owner",
            permissions_json={"vault": True, "documents": True, "estate": True, "actions": True, "audit": True},
            status="active"
        )
        m2 = EstateMember(
            id="member-2",
            estate_id=estate.id,
            user_id=son.id,
            name="Rahul Sharma",
            email="rahul@estate.demo",
            relationship_type="Son / Co-Beneficiary",
            role="family_member",
            permissions_json={"vault": False, "documents": True, "estate": True, "actions": True, "audit": False},
            status="active"
        )
        m3 = EstateMember(
            id="member-3",
            estate_id=estate.id,
            user_id=lawyer.id,
            name="Adv. Anita Mehta",
            email="anita@estate.demo",
            relationship_type="Legal Counsel / Estate Attorney",
            role="executor",
            permissions_json={"vault": True, "documents": True, "estate": True, "actions": True, "audit": True},
            status="active"
        )
        db.add_all([m1, m2, m3])
        db.commit()

        # 5. Financial Documents
        d1 = Document(
            id="doc-1",
            estate_id=estate.id,
            uploaded_by_id=owner.id,
            title="SBI Savings Passbook & Fixed Deposit Statement",
            filename="sbi_savings_statement_2026.pdf",
            file_type="application/pdf",
            file_path="./storage/sbi_savings_statement_2026.pdf",
            file_size_bytes=1048576,
            status="confirmed"
        )
        d2 = Document(
            id="doc-2",
            estate_id=estate.id,
            uploaded_by_id=son.id,
            title="HDFC Home Loan Account Sanction Letter",
            filename="hdfc_home_loan_agreement.pdf",
            file_type="application/pdf",
            file_path="./storage/hdfc_home_loan_agreement.pdf",
            file_size_bytes=2097152,
            status="confirmed"
        )
        d3 = Document(
            id="doc-3",
            estate_id=estate.id,
            uploaded_by_id=owner.id,
            title="LIC Jeevan Umang Term Life Insurance Policy",
            filename="lic_term_policy_99201482.pdf",
            file_type="application/pdf",
            file_path="./storage/lic_term_policy_99201482.pdf",
            file_size_bytes=1572864,
            status="extracted" # Needs human review demo!
        )
        db.add_all([d1, d2, d3])
        db.commit()

        # 6. TEE Extraction Jobs (with low confidence field highlight demo!)
        j1 = ExtractionJob(
            id="job-3",
            document_id=d3.id,
            status="completed",
            tee_enclave_id="enclave-sgx-fintech-01",
            tee_attestation_quote="SGX_QUOTE_VERIFIED_0xa3f8c901e4b8120d9f82",
            extracted_data_json={
                "policy_provider": "LIC of India",
                "policy_number": "POL-99201482",
                "sum_assured": 5000000.00,
                "nominee_declared": "Rahul Sharma (Son)",
                "premium_due_date": "2026-11-15",
                "claim_contact": "claims@licindia.in"
            },
            confidence_score=0.84,
            low_confidence_fields_json=["nominee_declared"],
            source_regions_json={
                "policy_provider": {"page": 1, "box": [80, 30, 220, 60]},
                "policy_number": {"page": 1, "box": [100, 110, 260, 140]},
                "sum_assured": {"page": 1, "box": [140, 210, 330, 240]},
                "nominee_declared": {"page": 2, "box": [180, 310, 390, 340]}
            }
        )
        db.add(j1)

        # 7. Assets
        a1 = Asset(
            id="asset-1",
            estate_id=estate.id,
            document_id=d1.id,
            category="bank_account",
            name="State Bank of India Savings Account",
            institution="State Bank of India",
            estimated_value=845200.50,
            account_number_masked="304910294821",
            is_confirmed=True,
            confidence_score=0.98,
            status="confirmed",
            details_json={"branch": "Connaught Place, New Delhi", "ifsc": "SBIN0004012"},
            confirmed_by_id=owner.id
        )
        a2 = Asset(
            id="asset-2",
            estate_id=estate.id,
            document_id=d3.id,
            category="insurance_payout",
            name="LIC Jeevan Umang Term Policy Claim",
            institution="LIC of India",
            estimated_value=5000000.00,
            account_number_masked="POL-99201482",
            is_confirmed=False, # Unconfirmed demo field!
            confidence_score=0.84,
            status="unconfirmed",
            details_json={"nominee": "Rahul Sharma (Son) [Review Required]"}
        )
        a3 = Asset(
            id="asset-3",
            estate_id=estate.id,
            category="property",
            name="Residential Apartment Flat 402, Oakwood Towers",
            institution="Sub-Registrar Gurgaon",
            estimated_value=12500000.00,
            account_number_masked="REG-2018-7741",
            is_confirmed=True,
            confidence_score=1.0,
            status="confirmed",
            details_json={"location": "Cyber City, Phase 2, Gurgaon", "area": "1850 sq ft"}
        )
        db.add_all([a1, a2, a3])

        # 8. Liabilities
        l1 = Liability(
            id="liab-1",
            estate_id=estate.id,
            document_id=d2.id,
            category="home_loan",
            name="HDFC Housing Finance Home Loan",
            creditor="HDFC Bank",
            total_amount=4250000.00,
            emi_amount=38400.00,
            due_date="2026-10-05",
            is_confirmed=True,
            confidence_score=0.94,
            status="confirmed",
            details_json={"interest_rate": "8.55%", "linked_property": "Oakwood Towers 402"},
            confirmed_by_id=owner.id
        )
        db.add(l1)
        db.commit()

        # 9. Actions with Explainable Priority
        act1 = ActionItem(
            id="act-1",
            estate_id=estate.id,
            related_liability_id=l1.id,
            title="Notify HDFC Lender & Verify Credit Shield Policy",
            description="Submit written death notice to HDFC Bank Home Finance to prevent EMI default penalty and verify if Loan Protection Insurance covers the principal.",
            category="financial",
            priority="critical",
            urgency_score=95,
            priority_reason="Liability requiring active EMI payment ($38,400/mo); high risk of recurring late penalty fees & loan default.",
            status="in_progress",
            due_date="2026-10-05",
            assigned_member_id=m2.id,
            assigned_member_name="Rahul Sharma",
            required_documents_json=[
                "Certified Death Certificate",
                "HDFC Loan Account Sanction Letter",
                "Loan Credit Shield Policy Document",
                "Legal Heir Identification"
            ],
            checklist_steps_json=[
                "Submit death certificate to HDFC loan manager",
                "Inquire about credit shield insurance cover",
                "Submit insurance claim form to waive outstanding ₹42,50,000 balance"
            ]
        )
        act2 = ActionItem(
            id="act-2",
            estate_id=estate.id,
            related_asset_id=a2.id,
            title="Confirm Nominee & File LIC Term Insurance Claim",
            description="Review low-confidence extracted nominee field for policy POL-99201482 and file formal death claim with LIC of India.",
            category="financial",
            priority="critical",
            urgency_score=90,
            priority_reason="Time-sensitive life insurance claim window ($5,000,000 payout) to provide crucial family liquidity.",
            status="pending",
            due_date="2026-10-15",
            assigned_member_id=m1.id,
            assigned_member_name="Rajesh Sharma",
            required_documents_json=[
                "Original LIC Policy Document",
                "Certified Death Certificate",
                "Nominee Bank Cancelled Cheque",
                "Claimant Form A"
            ],
            checklist_steps_json=[
                "Verify nominee details in TEE Extraction Confirmation modal",
                "Download claim forms from LIC portal",
                "Submit document bundle to LIC Branch"
            ]
        )
        act3 = ActionItem(
            id="act-3",
            estate_id=estate.id,
            related_asset_id=a1.id,
            title="Submit SBI Bank Deceased Claim for Account Transfer",
            description="Notify SBI Connaught Place Branch to process deceased claim for savings account 304910294821.",
            category="financial",
            priority="high",
            urgency_score=75,
            priority_reason="Immediate liquid balance ($845,200.50) needed for estate administration.",
            status="pending",
            due_date="2026-11-01",
            assigned_member_id=m1.id,
            assigned_member_name="Rajesh Sharma",
            required_documents_json=[
                "SBI Passbook",
                "Death Certificate",
                "Nominee KYC"
            ],
            checklist_steps_json=[
                "Visit SBI home branch",
                "Submit Form Annexure-1 with Death Certificate"
            ]
        )
        act4 = ActionItem(
            id="act-4",
            estate_id=estate.id,
            related_asset_id=a3.id,
            title="Initiate Gurgaon Municipal Property Revenue Mutation",
            description="Apply for property revenue mutation for Flat 402 Oakwood Towers at Gurgaon Municipal Revenue office.",
            category="legal",
            priority="medium",
            urgency_score=55,
            priority_reason="Property title transfer requirement; low immediate penalty risk.",
            status="pending",
            due_date="2027-02-15",
            assigned_member_id=m3.id,
            assigned_member_name="Adv. Anita Mehta",
            required_documents_json=[
                "Original Sale Deed",
                "Legal Heirship Certificate",
                "Property Tax NOC"
            ],
            checklist_steps_json=[
                "Draft Legal Heirship affidavit",
                "Apply online at Haryana Revenue Mutation portal"
            ]
        )
        db.add_all([act1, act2, act3, act4])

        # 10. Audit Log Events
        e1 = AuditEvent(
            estate_id=estate.id,
            user_name="Rajesh Sharma",
            action_type="LOGIN",
            description="User logged into Digital Estate Assistant portal",
            target_resource="Session/Auth"
        )
        e2 = AuditEvent(
            estate_id=estate.id,
            user_name="Rahul Sharma",
            action_type="UPLOAD_DOC",
            description="Uploaded financial document 'hdfc_home_loan_agreement.pdf'",
            target_resource="Document/doc-2"
        )
        e3 = AuditEvent(
            estate_id=estate.id,
            user_name="Rajesh Sharma",
            action_type="TEE_EXTRACT",
            description="TEE Enclave 'enclave-sgx-fintech-01' executed protected OCR extraction for 'lic_term_policy_99201482.pdf' with 84% confidence and isolated memory encryption.",
            target_resource="ExtractionJob/job-3"
        )
        e4 = AuditEvent(
            estate_id=estate.id,
            user_name="Rajesh Sharma",
            action_type="ASSIGN_TASK",
            description="Assigned action 'Notify HDFC Lender & Verify Credit Shield Policy' to Rahul Sharma",
            target_resource="ActionItem/act-1"
        )
        db.add_all([e1, e2, e3, e4])

        # 11. Notifications
        n1 = Notification(
            user_id=son.id,
            title="New Action Item Assigned",
            message="You have been assigned to 'Notify HDFC Lender & Verify Credit Shield Policy' due by Oct 5, 2026.",
            type="urgent"
        )
        n2 = Notification(
            user_id=owner.id,
            title="Document Extraction Requires Verification",
            message="Document 'LIC Term Policy' extracted with 1 low-confidence field (nominee). Please review and confirm.",
            type="document_ready"
        )
        db.add_all([n1, n2])
        db.commit()

        print("Successfully seeded demo data for Digital Estate Assistant!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
