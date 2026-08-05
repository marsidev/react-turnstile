# @marsidev/react-turnstile

## 1.5.5

### Patch Changes

- [#246](https://github.com/marsidev/react-turnstile/pull/246) [`50ce83e`](https://github.com/marsidev/react-turnstile/commit/50ce83e0ee07f538b3e0545539372193f5d1c274) Thanks [@marsidev](https://github.com/marsidev)! - Harden the `execution: 'execute'` container lifecycle (follow-up to [#245](https://github.com/marsidev/react-turnstile/issues/245)): re-creating the widget (e.g. changing `options` after `execute()`) hides the container again instead of leaving a visible empty box, `reset()` re-hides it through the same rule, and an execute-mode widget with no `size` no longer occupies space before `execute()` is called.

- [#245](https://github.com/marsidev/react-turnstile/pull/245) [`6d25968`](https://github.com/marsidev/react-turnstile/commit/6d25968fec5edfa1b4148da6fbabaeabfd88b509) Thanks [@CatLover01](https://github.com/CatLover01)! - fix: show widget after calling `execute()` in execute mode (regression from [#229](https://github.com/marsidev/react-turnstile/issues/229))

  Previously, calling `execute()` re-applied the container style via `getContainerStyle()`, which returned the invisible style whenever `options.execution === "execute"`. The widget stayed hidden even after being executed. Now the container is made visible (per `size`/`appearance`) when `execute()` is called.

## 1.5.4

### Patch Changes

- [#229](https://github.com/marsidev/react-turnstile/pull/229) [`3d10c64`](https://github.com/marsidev/react-turnstile/commit/3d10c6423e56d96d918a05feb5805ddcc71f68cc) Thanks [@CatLover01](https://github.com/CatLover01)! - fix: respect widget size when appearance is interaction-only

  Previously, setting `appearance: "interaction-only"` would ignore the `size` prop and always use a hardcoded `fit-content` width. Now the container respects the chosen size (e.g. `flexible`, `compact`, `normal`) while still collapsing height for the smaller widget.

## 1.5.3

### Patch Changes

- [#167](https://github.com/marsidev/react-turnstile/pull/167) [`32ab55e`](https://github.com/marsidev/react-turnstile/commit/32ab55e71cfcbe90be4a07bb7c42e1c8c42810d5) Thanks [@marsidev](https://github.com/marsidev)! - Fix `nonce` from `scriptOptions` not being set on the injected `<script>` tag. The script was assigned via the `nonce` IDL property, which only writes the element's internal slot and never reflects to the `nonce` content attribute in real browsers. It is now set with `setAttribute`, so the attribute appears on the tag and CSP `nonce-...` allowlists work as expected.
