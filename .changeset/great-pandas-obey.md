---
"@marsidev/react-turnstile": patch
---

Harden the `execution: 'execute'` container lifecycle (follow-up to #245): re-creating the widget (e.g. changing `options` after `execute()`) hides the container again instead of leaving a visible empty box, `reset()` re-hides it through the same rule, and an execute-mode widget with no `size` no longer occupies space before `execute()` is called.
