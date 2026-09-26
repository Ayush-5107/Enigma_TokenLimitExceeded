# Backend Person B - Task List & Sequence

## Overview
Your responsibility is the complex processing logic: TEE, OCR Extraction, Estate Intelligence, Actions, and Tasks.
**You can work simultaneously with Frontend Person B** by ensuring the API schemas and JSON response shapes remain stable so they can build the UI using mocked data while you implement the underlying machine learning models and action engines.

---

## Task Sequence (In Order)

### Step 1: Documents Service
*   **What:** Implement `backend/app/services/document_service.py`. Handle secure upload metadata, document lifecycle, and encrypted object storage references. Connect it to the existing `api/documents.py` router.
*   **Dependency:** Needs basic database setup (which Backend A is doing), but the storage logic is independent. 

### Step 2: Extraction Pipeline Implementation
*   **What:** Build out the missing modules in the `extraction/` folder: `preprocessing/`, `ocr/`, `classification/`, `models/`, `schemas/`, `validation/`, and `tests/`. Implement the custom classification and extraction logic.
*   **Dependency:** Independent heavy-lifting logic.

### Step 3: TEE Worker & Key Release
*   **What:** Create `tee/key_release/` to finalize the protected processing boundary design. Ensure the extraction pipeline runs securely within this boundary.
*   **Dependency:** Requires the extraction pipeline (Step 2) to be somewhat defined.

### Step 4: Extraction Service Integration
*   **What:** Implement `backend/app/services/extraction_service.py` to wrap the OCR/layout processing and custom model inference, outputting confidence scores. Connect it to `api/extraction.py`.
*   **Dependency:** Relies on completing Step 2 and Step 3. Unblocks real testing for Frontend B.

### Step 5: Tasks API & Action Engines
*   **What:** Create the missing `backend/app/api/tasks.py` router and `backend/app/services/task_service.py`. Connect the existing `action_engine.py` and `priority_engine.py` to generate tasks from the estate entities.
*   **Dependency:** Independent business logic. 

---

## Important Rules
1.  **Stable APIs:** Do not change the JSON request/response schema formats unpredictably, as Frontend Person B is relying on them being stable.
2.  **Privacy First:** Ensure sensitive document decryption only happens inside the TEE protected processing boundary.
3.  **Do not cross domains:** Do not touch Auth, Vault, Family, or generic database migrations (That is Backend Person A's work).
