# Frontend Person B - Task List & Sequence

## Overview
Your responsibility is the core post-death workflow: Document processing, Extraction UI, Estate Intelligence, Actions, and Tasks.
**You can work simultaneously with Backend Person B** by mocking the API responses based on the established API contracts while they build the backend extraction pipeline and task engines.

---

## Task Sequence (In Order)

### Step 1: Documents Upload & Management UI
*   **What:** Create the `frontend/src/documents/` folder. Build batch upload components, a document list view, and processing status indicators. Integrate into the `Documents.tsx` page.
*   **Dependency:** Independent. You can mock the API responses for upload/status while Backend Person B implements `document_service.py`.

### Step 2: Extraction Review & Confirmation UI
*   **What:** Create the `frontend/src/extraction/` folder. Build the interface for showing extraction job progress, extracted fields, confidence scores, and the human confirmation UI.
*   **Dependency:** Independent UI work. Backend Person B is building the TEE boundary and OCR models simultaneously.

### Step 3: Estate Inventory UI
*   **What:** Create the `frontend/src/estate/` folder. Build detailed views for assets, liabilities, insurance, retirement, property, and obligations. Integrate into the `Estate.tsx` page.
*   **Dependency:** Can be built with mocked data. Relies on the `estateApi.ts` endpoints.

### Step 4: Actions & Tasks UI
*   **What:** Create the `frontend/src/actions/` folder. Build UI to show recommended actions, priority reasons, deadlines, status, and required documents. Create components to assign tasks to family members and show evidence tracking. Integrate into `Actions.tsx`.
*   **Dependency:** Mock data initially. Backend Person B will provide the logic via `action_engine.py` and `priority_engine.py`.

---

## Important Rules
1.  **Do not cross domains:** Do not touch `vault/`, `family/`, or authentication logic (That is Frontend Person A's work).
2.  **API Client:** Always use the shared HTTP client `apiFetch` from `frontend/src/services/api.ts` for all requests. Do not create new axios or fetch instances.
