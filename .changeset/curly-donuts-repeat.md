---
"@marsidev/react-turnstile": minor
---

Update server-side validation (siteverify) types to match the current Cloudflare docs: add a new `TurnstileServerValidationRequest` type, add `metadata.ephemeral_id` (Enterprise) to `TurnstileServerValidationResponse`, and mark the `invalid-widget-id` and `invalid-parsed-secret` error codes as no longer documented by Cloudflare (kept for backwards compatibility).
