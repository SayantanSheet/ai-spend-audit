# Project Reflection: AI Spend Audit

## 1. What was the most challenging technical hurdle you faced during this 7-day build?
*(150–400 words recommended)*
The most Significant hurdle during the development of AI Spend Audit was balancing the deterministic nature of the audit engine with the non-deterministic output of the AI summary feature. While the project rubric strictly requires rules-based, deterministic math for the core audit (to avoid the liability of AI "hallucinations" in financial data), the user experience demanded a human-like executive summary. Implementing this required careful prompt engineering in `PROMPTS.md` and a robust fallback mechanism in the Next.js API route. Ensuring that the AI only "narrated" the facts provided by the TypeScript engine, rather than inventing its own pricing data, was a critical design decision that preserved both accuracy and user delight.

## 2. How did you ensure the project remained compliant with the non-use of website builders or pre-built admin templates?
*(150–400 words recommended)*
To maintain total control over the codebase and adhere to the strict anti-template rules, I built the entire UI from scratch using Next.js 14 (App Router) and Tailwind CSS. Instead of reaching for a pre-built admin dashboard, I leveraged individual primitives from `shadcn/ui`, which are copy-pasted components rather than a black-box library. This allowed for a highly customized, "glassmorphic" design system tailored specifically to the "Audit" use case. Every layout file, API route, and state management slice (via Zustand) was architected from a blank slate, documented in `ARCHITECTURE.md`, and validated through a Git history that shows architectural evolution over 7 distinct days.

## 3. Describe your strategy for meeting the Lighthouse Performance and Accessibility targets.
*(150–400 words recommended)*
The strategy centered on the "Performance First" mindset from Day 1. By using the Next.js Font and Image components, I eliminated common layout shifts (CLS) and ensured images were served in optimized WebP formats. Accessibility was prioritized by using semantic HTML elements and ensuring that all dynamic form inputs in `SpendInputForm.tsx` were correctly tagged with `aria-labels`. During Day 5, I specifically audited the "bot-trap" honeypot fields to ensure they were hidden from screen readers using `aria-hidden="true"`, preventing confusion for visually impaired users. The automated CI pipeline helped maintain these standards by running linting checks on every push.

## 4. How did real user feedback (from the interviews) directly influence a design or technical decision?
*(150–400 words recommended)*
The decision to implement the "Shareable Report URL" was a direct result of User Interview #3 with an Operations Manager. Initially, the audit results were intended to be local-only or email-gated. However, feedback indicated that the primary value for a user is being able to present the findings to a CFO or stakeholder without requiring them to re-enter data. Technically, this led to the creation of the dynamic `/audit/[id]` route and the persistent storage of audit results in Supabase. This "Design for Portability" shifted the app from a simple calculator to a collaborative business communication tool.

## 5. If you had another 7 days, how would you scale this product to 100,000 users/day?
*(150–400 words recommended)*
To scale to 100k daily users, the biggest bottleneck would be the concurrent AI generation and database writes. I would migrate the in-memory rate limiting to a distributed Redis store (like Upstash) to prevent abuse across serverless instances. Additionally, I would implement a "Queue-based" processing system for the AI summaries and emails, decoupling the user-facing response from the background work. On the frontend, migrating the pricing data from a static Markdown file to a high-performance Edge Config or a global CDN-cached API would ensure that pricing audits remain lightning-fast regardless of the user's geographic location.
