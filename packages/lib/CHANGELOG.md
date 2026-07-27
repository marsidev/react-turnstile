# @marsidev/react-turnstile

## 1.5.4

### Patch Changes

- [#229](https://github.com/marsidev/react-turnstile/pull/229) [`3d10c64`](https://github.com/marsidev/react-turnstile/commit/3d10c6423e56d96d918a05feb5805ddcc71f68cc) Thanks [@CatLover01](https://github.com/CatLover01)! - fix: respect widget size when appearance is interaction-only

  Previously, setting `appearance: "interaction-only"` would ignore the `size` prop and always use a hardcoded `fit-content` width. Now the container respects the chosen size (e.g. `flexible`, `compact`, `normal`) while still collapsing height for the smaller widget.

## 1.5.3

### Patch Changes

- [#167](https://github.com/marsidev/react-turnstile/pull/167) [`32ab55e`](https://github.com/marsidev/react-turnstile/commit/32ab55e71cfcbe90be4a07bb7c42e1c8c42810d5) Thanks [@marsidev](https://github.com/marsidev)! - Fix `nonce` from `scriptOptions` not being set on the injected `<script>` tag. The script was assigned via the `nonce` IDL property, which only writes the element's internal slot and never reflects to the `nonce` content attribute in real browsers. It is now set with `setAttribute`, so the attribute appears on the tag and CSP `nonce-...` allowlists work as expected.
