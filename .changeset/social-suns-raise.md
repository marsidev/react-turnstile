---
"@marsidev/react-turnstile": patch
---

Keep the `onloadTurnstileCallback` global while the script loads when `scriptOptions.onError` is set, so `api.js` no longer warns that it cannot find the onload callback. The callback is now removed only if the script fails to load.
