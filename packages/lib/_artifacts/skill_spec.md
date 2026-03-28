# React Turnstile — Skill Spec

React Turnstile is a React component library for integrating Cloudflare Turnstile CAPTCHA. It provides a lightweight, privacy-focused alternative to reCAPTCHA with automatic script injection, TypeScript support, and SSR compatibility.

## Domains

| Domain | Description | Skills |
| ------ | --------------------- | ----------------------- |
| Widget Setup and Configuration | Core widget rendering, sizing, and appearance configuration | basic-setup, widget-customization |
| Framework Integration | React framework-specific patterns, SSR, and build tool integration | nextjs-ssr |
| Advanced Usage Patterns | Multiple instances, imperative API, and complex interaction patterns | multiple-widgets, token-lifecycle |

## Skill Inventory

| Skill | Type | Domain | What it covers | Failure modes |
| ------ | -------------------------------------- | -------- | -------------- | ------------- |
| basic-setup | core | widget-setup | Installation, Turnstile component, siteKey prop, widget sizes | 1 |
| widget-customization | core | widget-setup | Appearance modes, execution modes, themes, script injection | 1 |
| nextjs-ssr | framework | framework-integration | App Router, Pages Router, SSR, manual script injection | 1 |
| multiple-widgets | core | advanced-usage | Multiple instances, unique IDs, race conditions | 2 |
| token-lifecycle | lifecycle | advanced-usage | Token handling, expiration, form integration, imperative API | 3 |

## Failure Mode Inventory

### basic-setup (1 failure mode)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | -------- | -------- | ---------------------- | ------------------------ |
| 1 | Using invisible size with normal Turnstile widget type | HIGH | docs/props.mdx | — |

### widget-customization (1 failure mode)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | -------- | -------- | ---------------------- | ------------------------ |
| 1 | Forgetting to call execute() when using execution="execute" mode | MEDIUM | docs/use-ref-methods.mdx | — |

### nextjs-ssr (1 failure mode)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | -------- | -------- | ---------------------- | ------------------------ |
| 1 | SSR hydration mismatch with widget container | CRITICAL | GitHub issues analysis | — |

### multiple-widgets (2 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | -------- | -------- | ---------------------- | ------------------------ |
| 1 | Using same ID for multiple widgets | CRITICAL | GitHub issues analysis | — |
| 2 | Script loading race conditions with multiple widgets | HIGH | GitHub issues analysis | — |

### token-lifecycle (3 failure modes)

| # | Mistake | Priority | Source | Cross-skill? |
| --- | -------- | -------- | ---------------------- | ------------------------ |
| 1 | Token expires before form submission | HIGH | docs/handling-expiration.mdx | — |
| 2 | Calling imperative methods before widget is loaded | MEDIUM | source code | — |
| 3 | Expecting server validation to be built-in | HIGH | Maintainer interview | — |

## Tensions

| Tension | Skills | Agent implication |
| -------------- | ------------------- | ------------------------ |
| Widget auto-render vs manual control | basic-setup ↔ token-lifecycle | Agents often use default render mode when execute mode would be better for UX |
| Stable callbacks vs dynamic callbacks | widget-customization ↔ token-lifecycle | Agents may generate stale closure bugs when accessing state in callbacks |

## Cross-References

| From | To | Reason |
| ------ | ------ | ----------------------------------------- |
| basic-setup | nextjs-ssr | Basic setup patterns differ for SSR frameworks - need framework-specific guidance |
| token-lifecycle | multiple-widgets | Managing tokens requires understanding how multiple widgets share state |
| widget-customization | token-lifecycle | Execution mode choice affects token generation timing and form integration |

## Subsystems & Reference Candidates

| Skill | Subsystems | Reference candidates |
| ------ | ------------------------------ | -------------------------- |
| basic-setup | — | Widget size options (normal, compact, flexible, invisible) |
| widget-customization | — | Appearance modes, execution modes, theme options |
| nextjs-ssr | App Router, Pages Router | — |
| multiple-widgets | — | — |
| token-lifecycle | — | Imperative API methods (7 methods) |

## Remaining Gaps

None - all gaps resolved in maintainer interview.

## Recommended Skill File Structure

- **Core skills:** basic-setup, widget-customization, multiple-widgets
- **Framework skills:** nextjs-ssr (Next.js-specific)
- **Lifecycle skills:** token-lifecycle
- **Composition skills:** None required - integrations covered within relevant skills
- **Reference files:** None required - API surface is small enough for inline documentation

## Composition Opportunities

| Library | Integration points | Composition skill needed? |
| ------- | ------------------ | ----------------------------- |
| Next.js | Script loading, SSR, hydration | Yes - covered by nextjs-ssr skill |
| React Hook Form | Form submission, token handling | No - covered in token-lifecycle skill |
| TanStack Form | Form submission, token handling | No - covered in token-lifecycle skill |

## Important Notes for AI Agents

### ESM-Only Library
This library is ESM-only (not CommonJS). Testing with Jest may require special configuration. The maintainer recommends using Vitest or other modern testing solutions.

### No Built-in Server Validation
The library provides TypeScript types (`TurnstileServerValidationResponse`) but NO built-in server validation function. Users must implement their own server-side validation by calling Cloudflare's siteverify endpoint.

### Test Keys Available
Cloudflare provides test site keys and secret keys for development that always pass validation. See: https://developers.cloudflare.com/turnstile/troubleshooting/testing/

### Common AI Mistakes to Avoid
1. **Don't hallucinate validation methods** - No `validate()` function exists; users implement server calls themselves
2. **Always use unique IDs for multiple widgets** - Default ID causes conflicts
3. **Wrap callbacks with useCallback when using `rerenderOnCallbackChange=true`** - Prevents infinite re-renders
4. **Remember tokens are single-use** - They expire and must be reset after use
5. **Use 'use client' in Next.js App Router** - Widget is client-side only
