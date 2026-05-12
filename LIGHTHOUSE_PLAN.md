# Lighthouse Optimization Plan

This document outlines the strategy to achieve and maintain top-tier Lighthouse scores as required by the Credex Round 1 rubric.

## Targets
- **Performance**: ≥ 85
- **Accessibility**: ≥ 90
- **Best Practices**: ≥ 90

## Performance Strategies
- [ ] **Image Optimization**: Use `next/image` for automatic resizing, WebP conversion, and lazy loading.
- [ ] **Dynamic Imports**: Code-split heavy components (like graphs or AI output displays) using `next/dynamic`.
- [ ] **Font Optimization**: Use `next/font` to host Google Fonts locally and prevent layout shifts (CLS).
- [ ] **Minification**: Ensure `next build` is running in production mode.

## Accessibility (A11y) Strategies
- [ ] **Semantic HTML**: Use `<main>`, `<section>`, `<header>`, and `<nav>` appropriately.
- [ ] **Form Labels**: Ensure every input has a corresponding `<label>` or `aria-label`.
- [ ] **Contrast**: Verify all text-background combinations meet WCAG AA (4.5:1 ratio).
- [ ] **Focus Management**: Ensure interactive elements have visible focus rings.

## Best Practices
- [ ] **HTTPS**: Enforced by Vercel deployment.
- [ ] **Modern APIs**: Use current CSS features and avoid deprecated Web APIs.
- [ ] **Security**: Ensure target="_blank" links have `rel="noopener"`.

## Verification Command
To run a local audit, use:
```bash
npx lighthouse http://localhost:3000 --view
```
