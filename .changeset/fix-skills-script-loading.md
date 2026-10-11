---
"@marsidev/react-turnstile": patch
---

Fix the bundled agent skills' script-loading guidance: `<Turnstile />` loads Cloudflare's script only once however many widgets mount, so manual script injection is optional rather than recommended, and the default setup does not cause race conditions.
