# Backend Person A - Task List & Sequence

## Overview
Your responsibility is the Core API, Database structure, Vault, Family, Permissions, and Audit functionality.
**You can work simultaneously with Frontend Person A** by ensuring the API schemas and JSON response shapes remain stable so they can build the UI using mocked data while you implement the underlying database services.

---

## Task Sequence (In Order)

### Step 1: Database Setup & Alembic Migrations
*   **What:** Create `backend/app/repositories/` and set up Alembic migrations in `backend/app/migrations/`. Define the PostgreSQL schema models in `models/` for Vault, Family, and Permissions.
*   **Dependency:** Foundational backend work. Complete this first so other backend services have a database to talk to.

### Step 2: Vault Service Layer
*   **What:** Implement `backend/app/services/vault_service.py`. Write the actual logic for Vault CRUD operations and ownership checking, and connect it to the existing `api/vault.py` router.
*   **Dependency:** Unblocks Frontend Person A's real data testing.

### Step 3: Family & Permission Service Layer
*   **What:** Implement `backend/app/services/family_service.py` and `backend/app/services/permission_service.py`. Handle logic for members, beneficiaries, and section-level least-privilege authorization. Connect to `api/family.py`.
*   **Dependency:** Independent backend work.

### Step 4: Estate Base & Audit Service
*   **What:** Implement `backend/app/services/estate_service.py` (Estate case lifecycle) and `backend/app/services/audit_service.py` (Security/workflow event logging). Connect to existing routers.
*   **Dependency:** Relies on the database setup from Step 1.

### Step 5: Notifications API
*   **What:** Create the missing `backend/app/api/notifications.py` router and `backend/app/services/notification_service.py` for in-app notification states.
*   **Dependency:** Independent backend work.

---

## Important Rules
1.  **Stable APIs:** Do not change the JSON request/response schema formats unpredictably, as Frontend Person A is relying on them being stable.
2.  **ID Formats:** Ensure all exposed IDs are opaque strings/UUIDs, not internal PostgreSQL integer IDs.
3.  **Do not cross domains:** Do not touch TEE, OCR extraction, or action engines (That is Backend Person B's work).
