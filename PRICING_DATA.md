# Vendor Pricing Data Tracker

> **Last Updated:** 2026-05-11
> **Math Constraint:** All audit engine math MUST trace back to these verified numbers.

## Core Generative AI Models
1. **ChatGPT (OpenAI)**
   - Plus: $20/user/month
   - Team: $25/user/month (annual), $30/user/month (monthly)
   - Source: https://openai.com/chatgpt/pricing

2. **Claude (Anthropic)**
   - Pro: $20/user/month
   - Team: $30/user/month (min 5 users)
   - Source: https://www.anthropic.com/pricing#claude-pro

3. **Perplexity**
   - Pro: $20/month or $200/year
   - Source: https://www.perplexity.ai/pro

## Agent/Coding Tools
1. **GitHub Copilot**
   - Individual: $10/month or $100/year
   - Business: $19/user/month
   - Source: https://github.com/features/copilot#pricing

2. **Cursor**
   - Pro: $20/month
   - Business: $40/user/month
   - Source: https://cursor.sh/pricing

## Audit Math Rules
- If a user pays for ChatGPT Plus ($20) AND Claude Pro ($20) AND Perplexity Pro ($20), they are overlapping general model reasoning tools. The optimal plan consolidates to 1 API aggregator (like Poe or typingmind) or just keeping 1 primary tool, saving ~$40/month.
- If a user has ChatGPT Team for 1 user, flag it (requires min 2 users, so they are likely overpaying $60/mo).
