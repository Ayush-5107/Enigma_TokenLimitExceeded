# Remaining Work Distribution

This document outlines the remaining tasks for each team member based on the gaps identified between the original [Implementation Plan PDF](./Digital_Estate_Implementation_Folder_Reuse_Team_API_Plan\ \(1\).pdf) and the current state of the codebase. 

The existing codebase has successfully established the core backend APIs (`backend/app/api`), base security modules, frontend pages (`frontend/src/pages`), and the shared API client configuration (`frontend/src/services`). 

Please follow this revised task list to complete the implementation simultaneously without interfering with each other's domain. **Ensure all API calls use the unified HTTP client setup and point to the correct `/api/v1` namespace.**

---

## 1. Frontend Person A (Auth, Vault, Family, PWA Shell)

**Focus Areas:** Layout, Authentication Pages, and Domain-Specific Folders.

*   **Authentication:**
    *   Create `frontend/src/pages/Login.tsx`
    *   Create `frontend/src/pages/Register.tsx`
*   **App Shell & Layout:**
    *   Create `frontend/src/layout/` directory and implement the responsive app shell components.
*   **Domain-Specific Frontend Modules:**
    *   Create `frontend/src/vault/` to house specific components/logic for vault entries and protected views.
    *   Create `frontend/src/family/` for managing family members and permissions components.
    *   Create `frontend/src/audit/` for access visibility and security status components.
*   **API Verification:**
    *   Verify that `services/authApi.ts` and `services/vaultApi.ts` are strictly utilizing the shared `api.ts` HTTP client.

---

## 2. Frontend Person B (Documents, Extraction, Estate, Actions, Tasks)

**Focus Areas:** Domain-Specific Folders for Estate Intelligence and Workflows.

*   **Domain-Specific Frontend Modules:**
    *   Create `frontend/src/documents/` for batch upload and document list components.
    *   Create `frontend/src/extraction/` for extraction confirmation UI and job progress logic.
    *   Create `frontend/src/estate/` for detailed asset and liability views.
    *   Create `frontend/src/actions/` to house task assignment, priority lists, and dependency tracking components.
*   **API Verification:**
    *   Verify that `services/extractionApi.ts`, `services/documentApi.ts`, `services/estateApi.ts`, and `services/actionApi.ts` are strictly utilizing the shared `api.ts` HTTP client.

---

## 3. Backend Person A (Core API, Database, Vault, Family, Permissions, Audit)

**Focus Areas:** Service Layer Implementation, Notifications API, and Database Tooling.

*   **Database & Repositories:**
    *   Create `backend/app/repositories/` to separate database queries from the router logic.
    *   Initialize Alembic and create `backend/app/migrations/` for the PostgreSQL schema.
*   **Service Layer (`backend/app/services/`):**
    *   Implement `vault_service.py` (Vault CRUD and ownership)
    *   Implement `family_service.py` (Members and beneficiaries)
    *   Implement `permission_service.py` (Section-level authorization)
    *   Implement `estate_service.py` (Estate case lifecycle)
    *   Implement `audit_service.py` (Security and workflow event logging)
    *   Implement `notification_service.py` (In-app notification state)
*   **Notifications API:**
    *   Create the missing `backend/app/api/notifications.py` router.

---

## 4. Backend Person B (TEE, Extraction, Estate Intelligence, Actions, Tasks)

**Focus Areas:** Custom Extraction Pipeline, Tasks API, Service Layer, and TEE Key Release.

*   **Extraction Pipeline (`extraction/`):**
    *   Create the missing pipeline directories: `preprocessing/`, `ocr/`, `classification/`, `models/`, `schemas/`, `validation/`, and `tests/`. Implement the respective logic.
*   **TEE Boundary (`tee/`):**
    *   Create and implement `tee/key_release/`.
*   **Service Layer (`backend/app/services/`):**
    *   Implement `document_service.py` (Secure upload metadata, object storage references)
    *   Implement `extraction_service.py` (OCR/layout wrapper, inference integration)
    *   Implement `task_service.py` (Assignment, status, due dates)
*   **Tasks API:**
    *   Create the missing `backend/app/api/tasks.py` router.

---

## API & Integration Contract Reminders

1.  **Strict `/api/v1` Namespace:** All API routes must be mounted under `/api/v1` in `backend/app/main.py`.
2.  **Frontend Client:** Do not instantiate new `fetch` or `axios` instances. Always import `apiFetch` from `frontend/src/services/api.ts`.
3.  **Cross-Interference:** The architecture deliberately separates modules. E.g., Frontend Person B should only touch domain folders `documents/`, `extraction/`, `estate/`, `actions/` and not modify `vault/` or `family/`. 
4.  **Database IDs:** Use opaque strings/UUIDs; do not expose internal PostgreSQL integer IDs in schemas.
