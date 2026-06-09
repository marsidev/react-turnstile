---
"@marsidev/react-turnstile": patch
---

Fix `nonce` from `scriptOptions` not being set on the injected `<script>` tag. The script was assigned via the `nonce` IDL property, which only writes the element's internal slot and never reflects to the `nonce` content attribute in real browsers. It is now set with `setAttribute`, so the attribute appears on the tag and CSP `nonce-...` allowlists work as expected.
