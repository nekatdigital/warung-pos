## 2025-05-15 - [Price and Total Tampering Prevention]
**Vulnerability:** Trusting client-side calculations for transaction totals and change amounts.
**Learning:** POS systems, even local-first ones, must never trust financial calculations provided by the frontend. A malicious user or a corrupted state could lead to incorrect totals being persisted.
**Prevention:** Always recalculate totals and change amounts in the data service layer from the source of truth (item prices and quantities). Validate that the received cash is sufficient for the recalculated total.
