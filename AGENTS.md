# AGENTS.md

This file provides guidance for AI coding agents working with code in this repository.

## What this is

`@marsidev/react-turnstile` — a React wrapper for Cloudflare Turnstile. It's a pnpm monorepo: the published library lives in `packages/lib`, with a Next.js demo (`demos/nextjs`) used for the live preview and Playwright E2E tests.

The package manager is **pnpm 11 via corepack** (pinned by the `packageManager` field). Node is pinned to 24 (`.node-version`).

## Commands

Run from the repo root:

- `pnpm dev` — watch-build the library + run the demo (HMR)
- `pnpm lib:build` — build the library (tsdown → ESM)
- `pnpm check` — `lint:check` + `format:check` + `typecheck` (what CI runs)
- `pnpm fix` — auto-fix lint (`oxlint --fix`) + format (`oxfmt`)
- `pnpm typecheck` — type-check all workspaces (`tsgo`, the Go TypeScript)
- `pnpm test` — integration (vitest) + E2E (Playwright)
- `pnpm test:integration` / `pnpm test:e2e`

Single test:
- integration: `pnpm --filter @marsidev/react-turnstile exec vitest run -t "<test name>"` (tests live in `packages/lib/test/`)
- E2E: `pnpm test:e2e test/e2e/basic.test.ts -g "<title>"` (Playwright config starts the demo as its web server)

Package quality / release:
- `pnpm --filter @marsidev/react-turnstile run check:package` — `publint` against the built `dist/` (also runs in CI)
- `pnpm changeset` — record a changelog entry for any user-facing change (see Releases below)

> Type-aware linting (oxlint with `typeAware`) reads the library's types, so **`pnpm lib:build` must run before `pnpm check`/lint** — CI does this, and so should you locally.

## Library architecture

The public surface is small but the script/widget lifecycle is the part that spans files:

- **`packages/lib/src/lib.tsx`** — the `<Turnstile>` `forwardRef` component and the heart of the logic:
  - **Single script load across all widgets.** A *module-level* singleton (`turnstileState` + `turnstileLoadPromise` + the global `onloadTurnstileCallback`) ensures Cloudflare's `api.js` loads exactly once no matter how many `<Turnstile>` instances mount. There's also a `setInterval` polling fallback for when the script is injected manually without the `onload` param.
  - **Stable vs. dynamic callbacks.** By default callbacks are held in a `callbacksRef` so changing handler identities does **not** re-render/re-create the widget. Setting `rerenderOnCallbackChange` flips to passing callbacks directly (and re-rendering on change). The `renderConfig` `useMemo` deps are deliberately length-stable across both modes — preserve that when editing.
  - **Imperative API** via `useImperativeHandle`: `render`/`execute`/`reset`/`remove`/`getResponse`/`getResponsePromise`/`isExpired`, all guarded behind a `checkIfTurnstileLoaded()` check against `window.turnstile`.
- **`src/utils.ts`** — `injectTurnstileScript` builds the `<script>` for the hardcoded `SCRIPT_URL` (Cloudflare-hosted) with the onload-callback name + render mode; also the container size style sets and the default IDs.
- **`src/use-observe-script.ts`** — a `MutationObserver` hook that reports when the script element exists in the DOM.
- **`src/container.tsx`** — polymorphic container (`as` prop) via `forwardRef`.
- **`src/turnstile.ts`** — types mirroring Cloudflare's upstream `window.turnstile` API (`RenderParameters`, etc.).
- **`src/types.ts`** — the public types (`TurnstileProps`, `TurnstileInstance`, `ComponentRenderOptions`, `ScriptOptions`, server-validation response types).

The published package has **zero runtime dependencies** (only `react`/`react-dom` peers) — keep it that way; it's a core selling point. Build output is **ESM-only** with a `'use client';` banner (Next.js compat), configured in `tsdown.config.ts`.

## Conventions & gotchas

- **pnpm 11 config lives in `pnpm-workspace.yaml`, not `.npmrc`** (`saveExact`, `allowBuilds`, `minimumReleaseAge`, `blockExoticSubdeps`, `overrides`). pnpm 11 ignores `.npmrc` for these. `saveExact: true` enforces exact dependency versions — match that (no `^` ranges).
- **Build scripts are gated by `allowBuilds`** in `pnpm-workspace.yaml`; `sharp` and `simple-git-hooks` are intentionally `false`.
- **Releases are automated with Changesets + npm OIDC trusted publishing** (`.github/workflows/release.yml`). Never `npm publish` manually and never hand-bump the version. The pnpm version is owned solely by the `packageManager` field (there is no `pnpm` devDependency — don't re-add one; it desyncs corepack and breaks builds). `LICENSE`/`README.md` are copied into `packages/lib` at publish time (they're gitignored there) — edit the root copies.
- **Required CI checks:** `check`, `e2e-test`, `integration-test`, `zizmor`. `zizmor` (workflow security scanner) runs on every PR; its config is `.github/zizmor.yml`. All GitHub Actions are pinned to commit SHAs.
- **Pre-commit** runs `nano-staged` (oxlint --fix + oxfmt on staged files only), installed automatically via the `prepare` script.
- **Shipped skills.** `packages/lib/skills/*` are TanStack `@tanstack/intent` skills bundled in the published package; `validate-skills.yml` / `check-skills.yml` validate and flag-stale them. Update via `pnpm exec intent` when changing the public API.
