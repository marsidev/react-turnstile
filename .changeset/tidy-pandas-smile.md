---
"@marsidev/react-turnstile": patch
---

Sync JSDoc and types with the current Cloudflare Turnstile docs: fix the documented `retry-interval` default (8000 ms), document that `language` also accepts language-country codes (e.g. `en-US`), add the missing language codes (`bg`, `vi` and language-country variants) to `TurnstileLangCode`, document the client-side error code families on `onError`, and clarify that the `"invisible"` size is a library-only convention.
