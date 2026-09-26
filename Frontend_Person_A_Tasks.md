# Frontend Person A - Task List & Sequence

## Overview
Your responsibility is the user-facing app shell, authentication, vault, family access, and the PWA shell. 
**You can work simultaneously with Backend Person A** by mocking the API responses based on the established API contracts while they build the real endpoints.

---

## Task Sequence (In Order)

### Step 1: App Shell & Layout
*   **What:** Create the `frontend/src/layout/` directory. Implement responsive layout components (Header, Sidebar/Navigation, Footer) that wrap the existing pages.
*   **Dependency:** Independent. You can do this immediately.

### Step 2: Authentication UI
*   **What:** Create `frontend/src/pages/Login.tsx` and `frontend/src/pages/Register.tsx`. Connect these forms to `frontend/src/services/authApi.ts`.
*   **Dependency:** You can mock the API response for now. Backend Person A has already scaffolded the `auth.py` router.

### Step 3: Vault UI & Components
*   **What:** Create the `frontend/src/vault/` folder. Build out specific UI components for viewing, creating, editing, and deleting vault entries. Integrate these into the existing `Vault.tsx` page.
*   **Dependency:** Can be built using mocked data. Backend Person A will be building the backend `vault_service.py` at the same time.

### Step 4: Family & Permissions UI
*   **What:** Create the `frontend/src/family/` folder. Build UI for managing family members, assigning trusted beneficiaries, and managing section-level access. Integrate into the `Family.tsx` page.
*   **Dependency:** Independent frontend work, mocking API responses for `familyApi.ts`. 

### Step 5: Security & Audit UI
*   **What:** Create the `frontend/src/audit/` folder. Build security status cards and an access visibility timeline for the existing `Audit.tsx` page.
*   **Dependency:** Awaits Backend Person A's `audit_service.py` for actual data, but UI can be built with mocks.

### Step 6: PWA Polish
*   **What:** Ensure `manifest.json` and `sw.js` in `frontend/public/` are correctly configured. Add camera-friendly upload hooks and ensure the app is installable.
*   **Dependency:** Independent.

---

## Important Rules
1.  **Do not cross domains:** Do not touch `documents/`, `extraction/`, `estate/`, or `actions/` (That is Frontend Person B's work).
2.  **API Client:** Always use the shared HTTP client `apiFetch` from `frontend/src/services/api.ts` for all requests. Do not create new axios or fetch instances.
