# Pre-Submission Checklist

## 1. Rubric Compliance
- [ ] **No Website Builders**: Verified (Built with Next.js, Tailwind, shadcn primitives).
- [ ] **No Admin Templates**: Verified (Custom UI structure).
- [ ] **No Logic in AI**: Audit engine is written in deterministic TypeScript (`lib/auditEngine.ts`).
- [ ] **Environment Variables**: All secrets (Supabase, Resend, Anthropic) are in `.env.local`.

## 2. Mandatory Files
- [ ] `ARCHITECTURE.md`: Present with Mermaid diagram.
- [ ] `DEVLOG.md`: 7 daily entries in exact format.
- [ ] `TESTS.md`: Documents ≥5 automated tests.
- [ ] `PRICING_DATA.md`: All numbers traced to URLs.
- [ ] `PROMPTS.md`: AI summary prompt saved.
- [ ] `GTM.md`, `ECONOMICS.md`, `METRICS.md`, `USER_INTERVIEWS.md`, `LANDING_COPY.md`: Present.
- [ ] `REFLECTION.md`: 5 questions answered (150-400w each).

## 3. Technical Requirements
- [ ] **Lighthouse**: Mobile Perf ≥85, A11y ≥90 (Verified locally).
- [ ] **Git History**: ≥5 distinct calendar days with conventional commits.
- [ ] **AI Summary**: Anthropic/LLM integration with fallback.
- [ ] **Lead Capture**: Supabase logic implemented.
- [ ] **Email**: Resend integration working.
- [ ] **Abuse Protection**: Honeypot + Rate limiting present in API.

## 4. Final Verification
- [ ] Site deployed successfully to Vercel/similar.
- [ ] All `console.log` statements removed for production.
- [ ] Final tests passing in CI workflow.
