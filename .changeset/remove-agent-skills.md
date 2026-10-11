---
"@marsidev/react-turnstile": patch
---

Stop shipping the TanStack Intent agent skills (`skills/`) in the package. They duplicated the documentation and had drifted from it; the [docs](https://github.com/marsidev/react-turnstile/tree/main/docs) remain the reference. The runtime code is unchanged.
