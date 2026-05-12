# Testing Approach & Coverage Plan

> **Scope:** The `auditEngine.ts` is the deterministic core of this application. We must ensure every calculation conforms perfectly to our pricing matrices.

## Automated Testing Structure (Jest)
**Suite:** `Audit Engine Core Logic`

### Essential 5 Unit Tests:
1. **Base Spend Accumulation:** Verify that entering two arbitrary tools with correct monthly vs annual cycles calculates `totalMonthlySpend` and `annualizedTotal` properly without applying any savings or red flags.
2. **LLM Redundancy Detection:** Enter 3 different conversational AI wrappers (e.g. ChatGPT Plus, Claude Pro, Perplexity Pro) and ensure the engine calculates savings by consolidating overlapping capabilities to a single platform.
3. **Coding Agent Optimization:** Entering both Cursor and Copilot should flag redundancy and estimate minimum $15/monthly savings mapping to standardizing standard platform limits.
4. **Team Minimum Validation:** Trigger the specialized red flag when user adds a "ChatGPT Team" subscription with a cost that equals 1 user ($30/mo), as Team mandates a 2 user minimum.
5. **No Negative Spending Constraints:** Test extreme overlaps or negative inputs explicitly resolve to bounds checking (`optimalMonthlySpend` >= 0 and no negative spending bugs).

*Run tests via command `npm test` once `jest` configuration is merged.*
