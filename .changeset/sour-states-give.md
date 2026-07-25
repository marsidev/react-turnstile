---
"@marsidev/react-turnstile": patch
---

fix: respect widget size when appearance is interaction-only

Previously, setting `appearance: "interaction-only"` would ignore the `size` prop and always use a hardcoded `fit-content` width. Now the container respects the chosen size (e.g. `flexible`, `compact`, `normal`) while still collapsing height for the smaller widget.
