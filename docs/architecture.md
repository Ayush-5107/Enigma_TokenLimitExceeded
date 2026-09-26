# Digital Estate & Financial Closure Assistant — System Architecture

## Overview
The Digital Estate & Financial Closure Assistant is a privacy-first mobile-first Progressive Web App (PWA) designed for grieving families. It turns scattered financial documents into structured estate inventories, prioritized action plans, and trackable closure workflows.

## System Architecture Diagram
```
+-------------------------------------------------------------------------+
|                          Frontend (React + Vite PWA)                    |
|   - Mobile-First Shell  - Vault UI       - Documents & OCR Review       |
|   - Action Engine UI    - Family Access  - Section-Level Permissions    |
+-------------------------------------------------------------------------+
                                    | REST / JSON (/api/v1)
                                    v
+-------------------------------------------------------------------------+
|                             FastAPI Backend                             |
|   - Auth & Session     - Vault Service   - Action & Priority Engine     |
|   - Family & Permissions - Audit Service - Document Metadata Lifecycle  |
+-------------------------------------------------------------------------+
                                    | In-Memory Boundary / SGX Quote
                                    v
+-------------------------------------------------------------------------+
|                  TEE Protected Processing Enclave Boundary              |
|   - Isolated Decryption   - Layout OCR   - Custom FinTech NER Model     |
|   - Confidence Scoring    - Source Bounding Box Metadata Tracking       |
+-------------------------------------------------------------------------+
```

## Key Architectural Decisions
1. **TEE Confidential Processing**: Sensitive financial documents are processed strictly inside isolated memory enclave boundaries (Intel SGX / AMD SEV style simulation).
2. **No Blockchain / Algorand / Smart-Contracts**: Removed per finalized PRD constraints.
3. **No External LLM Data Leakage**: Sensitive document contents are not sent to general-purpose third-party LLM APIs.
4. **Human-in-the-Loop Confirmation**: Low-confidence or high-impact extracted fields require human review before promotion to the Estate Inventory.
5. **Section-Level Least Privilege**: Controlled permissions per family member (Vault, Documents, Estate, Actions, Audit).
