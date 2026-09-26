"""
Explainable Priority & Timeline Recommendation Engine
Calculates human-understandable priority scores and explicit justification strings.
"""
from typing import Dict, Any, Tuple

class ExplainablePriorityEngine:
    @staticmethod
    def calculate_priority(
        category: str,
        amount_or_value: float,
        due_date_str: str = "",
        is_liability: bool = False,
        has_missing_docs: bool = False
    ) -> Tuple[str, int, str]:
        """
        Returns: (priority_level: 'critical'|'high'|'medium'|'low', urgency_score: int, explanation: str)
        """
        score = 50
        reasons = []

        if is_liability:
            score += 25
            reasons.append("Liability requiring active payment or lender notification")
            
            if category in ["home_loan", "personal_loan", "credit_card"]:
                score += 15
                reasons.append("High risk of recurring interest penalties & credit rating default if unpaid")
                
            if amount_or_value > 100000:
                score += 10
                reasons.append(f"Significant financial value (${amount_or_value:,.2f})")
        else:
            # Asset
            if category == "insurance_payout":
                score += 20
                reasons.append("Time-sensitive insurance death claim window to secure family liquidity")
            elif category == "bank_account":
                score += 15
                reasons.append("Immediate liquid bank account access needed for family living expenses")
            elif category == "property":
                score += 10
                reasons.append("Legal title transfer & property tax record alignment")

        if due_date_str:
            score += 15
            reasons.append(f"Upcoming time deadline ({due_date_str})")

        if has_missing_docs:
            reasons.append("Missing prerequisite documents requiring immediate collection")

        # Clamp score 0 to 100
        score = min(max(score, 10), 99)

        if score >= 85:
            priority = "critical"
        elif score >= 70:
            priority = "high"
        elif score >= 45:
            priority = "medium"
        else:
            priority = "low"

        explanation = "; ".join(reasons) if reasons else "Standard estate closure task."
        return priority, score, explanation
