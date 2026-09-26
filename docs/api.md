# API Specification (/api/v1)

All endpoints are mounted under namespace `/api/v1`.

## 1. Authentication
- `POST /api/v1/auth/register` — Register user
- `POST /api/v1/auth/login` — Login & return JWT
- `GET /api/v1/auth/me` — Current user profile

## 2. Legacy Vault
- `GET /api/v1/vault/entries` — List AES-256 encrypted vault secrets
- `POST /api/v1/vault/entries` — Create vault secret
- `DELETE /api/v1/vault/entries/{entry_id}` — Delete secret

## 3. Documents & TEE Extraction
- `POST /api/v1/documents` — Upload document to encrypted storage
- `GET /api/v1/documents/{id}/status` — Check TEE job processing status
- `POST /api/v1/extraction/jobs` — Trigger TEE enclave extraction job
- `POST /api/v1/extraction/{extraction_id}/confirm` — Human confirm & promote extracted fields

## 4. Estate Inventory
- `GET /api/v1/estate/{id}/summary` — Estate financial dashboard summary
- `GET /api/v1/estate/{id}/assets` — List assets (Bank, Insurance, Property)
- `POST /api/v1/estate/{id}/assets` — Add confirmed asset
- `GET /api/v1/estate/{id}/liabilities` — List liabilities (Loans, EMIs)

## 5. Action Engine & Tasks
- `GET /api/v1/estate/{id}/actions` — List actions sorted by urgency score
- `POST /api/v1/actions/{action_id}/assign` — Assign task to family member
- `PUT /api/v1/tasks/{task_id}/status` — Update task status & evidence

## 6. Family & Audit
- `GET /api/v1/estate/{id}/members` — List family members & permissions
- `PUT /api/v1/members/{member_id}/permissions` — Update section permissions
- `GET /api/v1/estate/{id}/audit` — Retrieve security audit log
