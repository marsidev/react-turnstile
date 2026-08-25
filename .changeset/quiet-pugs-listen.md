---
"@marsidev/react-turnstile": patch
---

Report invalid render parameters through `onError`. Turnstile rejects invalid parameters (an empty `siteKey`, an unknown `theme`, a malformed `action`, ...) by throwing before the widget is created, which previously surfaced as an unhandled promise rejection and never reached `onError`. Those failures are now passed to `onError` (as the validation message) when it is provided, or logged with `console.error` otherwise, both when the widget renders on mount and when `render()` is called through the ref.
