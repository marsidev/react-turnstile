# Contributing to React Turnstile

Thank you for your interest in contributing! This guide will help you get started with our development workflow.

## Prerequisites

- **Node.js 24+** (we recommend using [nvm](https://github.com/nvm-sh/nvm))
- **pnpm** (package manager - will be auto-installed via corepack)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/marsidev/react-turnstile.git
cd react-turnstile

# Install dependencies
pnpm install

# Start development server (builds library with HMR + starts Next.js demo)
pnpm dev
```

The dev server will start:

- Library build with hot module replacement on port (via tsup)
- Next.js demo app on port 3333

Visit [http://localhost:3333](http://localhost:3333) to see the demo.

## Development Workflow

### TypeScript v7 (Go Implementation)

We use **TypeScript v7** (currently in preview, written in Go) for type-checking and type-aware linting. This provides significant performance improvements over traditional TypeScript.

```bash
# Build the library first (required for type-aware linting)
pnpm lib:build

# Run type checking with tsgo
pnpm typecheck
```

**Important:** Type-aware linting requires built `.d.ts` files for cross-package type resolution in our monorepo setup. Always build before running type checks in CI.

### Linting and Formatting

We use **Oxlint** and **Oxfmt** for linting and formatting.

```bash
# Fix all linting and formatting issues
pnpm fix

# Check without modifying files (for CI)
pnpm check

# Individual commands
pnpm lint          # Fix linting issues
pnpm lint:check    # Check linting only
pnpm format        # Format files
pnpm format:check  # Check formatting only
pnpm typecheck     # Type check all packages
```

### Running Tests

```bash
# Run all tests
pnpm test

# Integration tests only
pnpm test:integration

# E2E tests only
pnpm test:e2e
```

### Pre-commit Hooks

We use `simple-git-hooks` to run checks before each commit. This ensures code quality before pushing.

```bash
# The following runs automatically on git commit:
pnpm check  # lint:check + format:check + typecheck
```

## Project Structure

```
.
├── packages/lib/          # Library source code (@marsidev/react-turnstile)
│   ├── src/               # Source code
│   ├── dist/              # Build output
│   └── package.json       # Library package config
├── demos/nextjs/          # Next.js demo app
├── docs/                  # Documentation
└── test/                  # E2E tests (Playwright)
```

## Making Changes

1. **Fork** the [repository](https://github.com/marsidev/react-turnstile/fork) and clone it
2. **Create a branch** from `main` for your changes
3. **Make your changes** with clear, focused commits
4. **Run checks** before committing: `pnpm check`
5. **Test your changes** with the demo app: `pnpm dev`
6. **Submit a PR** with a clear description

## Resources

- **[📖 Documentation](https://docs.page/marsidev/react-turnstile/)**
- **[🚀 Live Demo](https://react-turnstile.vercel.app/)**
- **[📦 NPM Package](https://npm.im/@marsidev/react-turnstile)**

## Editor Setup

### VS Code (or any editor based on VS Code)

Install the recommended extensions (you'll be prompted):

- **Oxc** (`oxc.oxc-vscode`) - Linting and formatting
- **TypeScript Native Preview** (`typescriptteam.native-preview`) - TypeScript v7 support

These extensions will provide:

- Auto-formatting on save
- Real-time linting
- Type errors
- Import sorting

## Troubleshooting

### Type-aware linting is slow

Enable debug logging to see which files are causing issues:

```bash
OXC_LOG=debug pnpm lint:check
```

Look for programs with unusually high file counts in the output.

### Build fails with type errors

Make sure you've built the library first:

```bash
pnpm lib:build
pnpm typecheck
```

### Pre-commit hooks not running

Reinstall hooks:

```bash
pnpm simple-git-hooks
```

## Questions?

- Open an [issue](https://github.com/marsidev/react-turnstile/issues/new)
- Check existing [discussions](https://github.com/marsidev/react-turnstile/discussions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
