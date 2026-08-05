---
"@marsidev/react-turnstile": patch
---

fix: show widget after calling `execute()` in execute mode (regression from #229)

Previously, calling `execute()` re-applied the container style via `getContainerStyle()`, which returned the invisible style whenever `options.execution === "execute"`. The widget stayed hidden even after being executed. Now the container is made visible (per `size`/`appearance`) when `execute()` is called.
