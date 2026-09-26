"""
Action Engine: Converts confirmed estate entities into structured actionable checklists.
"""
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from backend.app.models.models import ActionItem, Asset, Liability
from backend.app.services.priority_engine import ExplainablePriorityEngine

class ActionEngine:
    @staticmethod
    def generate_actions_for_asset(db: Session, estate_id: str, asset: Asset) -> List[ActionItem]:
        actions = []
        p_level, p_score, p_reason = ExplainablePriorityEngine.calculate_priority(
            category=asset.category,
            amount_or_value=asset.estimated_value,
            is_liability=False
        )

        if asset.category == "insurance_payout":
            action = ActionItem(
                estate_id=estate_id,
                related_asset_id=asset.id,
                title=f"File Insurance Claim: {asset.name}",
                description=f"Submit formal death claim for policy {asset.name} ({asset.institution}).",
                category="financial",
                priority=p_level,
                urgency_score=p_score,
                priority_reason=p_reason,
                due_date="30 days from date of passing",
                required_documents_json=[
                    "Original Policy Document",
                    "Certified Death Certificate",
                    "Beneficiary ID & Bank Account Details",
                    "Claim Form A"
                ],
                checklist_steps_json=[
                    "Download and fill claims form from insurer portal",
                    "Attach certified copy of Death Certificate",
                    "Submit claim dossier to nearest branch or online claims portal",
                    "Track claim acknowledgement reference number"
                ]
            )
            actions.append(action)

        elif asset.category == "bank_account":
            action = ActionItem(
                estate_id=estate_id,
                related_asset_id=asset.id,
                title=f"Bank Account Deceased Claim: {asset.name}",
                description=f"Notify {asset.institution} to freeze account or transfer funds to registered nominee.",
                category="financial",
                priority=p_level,
                urgency_score=p_score,
                priority_reason=p_reason,
                due_date="Within 45 days",
                required_documents_json=[
                    "Death Certificate",
                    "Passbook / Cheque Leaf",
                    "Nominee KYC (PAN/Aadhaar)",
                    "Bank Claim Form Annexure 1"
                ],
                checklist_steps_json=[
                    "Visit home branch with Death Certificate",
                    "Submit Annexure 1 Nominee Claim Form",
                    "Request closure & account balance transfer to legal heir account"
                ]
            )
            actions.append(action)

        elif asset.category == "property":
            action = ActionItem(
                estate_id=estate_id,
                related_asset_id=asset.id,
                title=f"Property Title & Mutation: {asset.name}",
                description=f"Initiate legal succession & municipal revenue mutation for property.",
                category="legal",
                priority=p_level,
                urgency_score=p_score,
                priority_reason=p_reason,
                due_date="6 months",
                required_documents_json=[
                    "Registered Sale Deed",
                    "Succession Certificate / Legal Heirship Certificate",
                    "Property Tax Receipts",
                    "No-Objection Certificate from Co-heirs"
                ],
                checklist_steps_json=[
                    "Obtain Legal Heirship Certificate from local magistrate/tahsildar",
                    "Apply for property mutation at Municipal Corporation office",
                    "Update utility accounts (Electricity/Water) to heir name"
                ]
            )
            actions.append(action)

        for act in actions:
            db.add(act)
        db.commit()
        return actions

    @staticmethod
    def generate_actions_for_liability(db: Session, estate_id: str, liability: Liability) -> List[ActionItem]:
        actions = []
        p_level, p_score, p_reason = ExplainablePriorityEngine.calculate_priority(
            category=liability.category,
            amount_or_value=liability.total_amount,
            due_date_str=liability.due_date or "",
            is_liability=True
        )

        if liability.category in ["home_loan", "personal_loan"]:
            action = ActionItem(
                estate_id=estate_id,
                related_liability_id=liability.id,
                title=f"Lender Notification & Credit Protection: {liability.name}",
                description=f"Formally notify {liability.creditor} of borrower's passing and check for linked credit insurance policy cover.",
                category="financial",
                priority=p_level,
                urgency_score=p_score,
                priority_reason=p_reason,
                due_date=liability.due_date or "Immediate (Next EMI cycle)",
                required_documents_json=[
                    "Loan Agreement Document",
                    "Death Certificate",
                    "Loan Credit Shield Insurance Policy (if applicable)",
                    "Succession / Legal Heir Notice"
                ],
                checklist_steps_json=[
                    "Submit formal written notice of death to loan department",
                    "Check if loan was covered by Loan Protection Insurance (credit shield)",
                    "If insured, submit death claim to insurer to settle outstanding loan balance",
                    "Discuss temporary EMI freeze or restructuring options with branch manager"
                ]
            )
            actions.append(action)

        for act in actions:
            db.add(act)
        db.commit()
        return actions
