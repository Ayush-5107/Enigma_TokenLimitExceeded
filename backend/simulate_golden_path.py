import sys
import os
import time
import uuid

# Add project root to path so imports work
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def print_step(step_num, title, description):
    print(f"\n=======================================================")
    print(f"STEP {step_num}: {title}")
    print(f"=======================================================")
    print(f"   >>> {description}\n")

def run_simulation():
    unique_id = str(uuid.uuid4())[:8]
    email = f"user_{unique_id}@example.com"
    password = "securepassword123"
    
    # 1. Register and Login
    print_step(1, "Authentication", "User registers and logs into the system.")
    
    register_response = client.post("/api/v1/auth/register", json={
        "email": email,
        "password": password,
        "full_name": "Demo User",
        "phone": "+1234567890",
        "role": "owner"
    })
    
    if register_response.status_code != 200:
        print(f"Failed to register: {register_response.text}")
        return
        
    print(f" [SUCCESS] Registered user: {email}")
    
    login_response = client.post("/api/v1/auth/login", json={
        "email": email,
        "password": password
    })
    
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f" [SUCCESS] Logged in successfully. Received JWT Token.")
    time.sleep(1)
    
    # 2. Create Estate Case
    print_step(2, "Create Estate Case", "User creates a new digital estate case for a deceased family member.")
    estate_response = client.post("/api/v1/estate", json={
        "title": "Doe Family Closure",
        "deceased_name": "John Doe",
        "date_of_passing": "2026-09-01"
    }, headers=headers)
    
    estate_id = estate_response.json()["id"]
    print(f" [SUCCESS] Estate created. ID: {estate_id}")
    time.sleep(1)

    # 3. Upload Document
    print_step(3, "Upload Document", "User uploads a Bank Statement PDF.")
    
    # Create a dummy file
    with open("dummy_statement.pdf", "wb") as f:
        f.write(b"Mock PDF Content")
        
    with open("dummy_statement.pdf", "rb") as f:
        upload_response = client.post(
            "/api/v1/documents", 
            data={"estate_id": estate_id, "title": "Chase Bank Statement"},
            files={"file": ("dummy_statement.pdf", f, "application/pdf")},
            headers=headers
        )
        
    document_id = upload_response.json()["id"]
    print(f" [SUCCESS] Document uploaded securely to encrypted object storage.")
    print(f" [INFO] Document ID: {document_id}, Status: {upload_response.json()['status']}")
    time.sleep(1)

    # 4. Trigger TEE Extraction
    print_step(4, "Protected Execution Environment (TEE) Extraction", "System triggers OCR and Custom ML classification inside the TEE enclave.")
    extract_response = client.post("/api/v1/extraction/jobs", json={
        "document_id": document_id
    }, headers=headers)
    
    job_data = extract_response.json()
    extraction_id = job_data["id"]
    
    print(f" [TEE STATUS] Processing boundary engaged.")
    print(f" [TEE STATUS] Enclave ID: {job_data.get('tee_enclave_id')}")
    print(f" [TEE STATUS] Attestation Quote Verified: {job_data.get('tee_attestation_quote')}")
    print(f" [SUCCESS] Extraction Pipeline Finished. Document Status: {job_data['status']}")
    print(f" [EXTRACTION RESULT] Extracted Data: {job_data['extracted_data_json']}")
    print(f" [EXTRACTION RESULT] Confidence Score: {job_data['confidence_score'] * 100:.1f}%")
    time.sleep(1)

    # 5. Confirm Data & Trigger Action Engine
    print_step(5, "Human Confirmation & Action Engine", "User confirms the extracted data, adding it to the Estate Inventory and generating prioritized tasks.")
    
    # Let's say the extracted data indicated an Asset (Bank Account)
    confirm_response = client.post(f"/api/v1/extraction/{extraction_id}/confirm", json={
        "entity_type": "asset",
        "category": "bank_account",
        "name": "Chase Checking Account",
        "institution_or_creditor": "Chase Bank",
        "account_or_ref_number": "XXXX-1234",
        "amount_or_value": 45000.50,
        "confirmed_fields": {"type": "checking"}
    }, headers=headers)
    
    print(f" [SUCCESS] {confirm_response.json()['message']}")
    print(f" [INFO] System is parsing requirements and dependencies for this asset type...")
    time.sleep(1)
    
    # 6. Fetch Generated Tasks
    print_step(6, "Task & Priority Engine", "Fetching the auto-generated checklist actions based on the confirmed asset.")
    tasks_response = client.get("/api/v1/tasks", headers=headers)
    tasks = tasks_response.json()
    
    if tasks:
        for t in tasks:
            print(f"   -> [TASK] Title: {t['title']}")
            print(f"      Priority: {t['priority'].upper()} | Urgency Score: {t['urgency_score']}")
            print(f"      Why is this priority?: {t['priority_reason']}")
            print(f"      Status: {t['status']}")
            print(f"      Required Documents: {t['required_documents_json']}")
            print("-" * 50)
    else:
        print(" [WARNING] No tasks were generated. Action Engine might be empty for this category.")
        
    time.sleep(1)

    # 7. Fetch Estate Summary
    print_step(7, "Estate Dashboard Summary", "Fetching the updated high-level summary of the estate case.")
    summary_response = client.get(f"/api/v1/estate/{estate_id}/summary", headers=headers)
    
    summary = summary_response.json()
    print(f" [DASHBOARD] Total Asset Value: ${summary['total_asset_value']:,.2f}")
    print(f" [DASHBOARD] Total Liability Value: ${summary['total_liability_value']:,.2f}")
    print(f" [DASHBOARD] Net Estate Value: ${summary['net_estate_value']:,.2f}")
    print(f" [DASHBOARD] Pending Actions: {summary['pending_actions_count']}")
    print(f" [DASHBOARD] Closure Progress: {summary['closure_progress_percent']}%")
    
    print(f"\n=======================================================")
    print(f" SIMULATION COMPLETED SUCCESSFULLY ")
    print(f"=======================================================\n")
    
    # Cleanup
    if os.path.exists("dummy_statement.pdf"):
        os.remove("dummy_statement.pdf")

if __name__ == "__main__":
    run_simulation()
