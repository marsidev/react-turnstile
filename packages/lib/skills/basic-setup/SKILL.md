---
name: basic-setup
description: >
  Install and render your first Turnstile widget with required configuration.
  Activate this skill when starting a new project with react-turnstile or when
  implementing basic CAPTCHA protection for the first time.
triggers:
  - 'install turnstile react'
  - 'add captcha to form'
  - 'setup cloudflare turnstile'
  - 'basic turnstile example'
  - 'how to use @marsidev/react-turnstile'
  - 'turnstile widget not showing'
category: core
metadata:
  library: '@marsidev/react-turnstile'
  library_version: '1.4.2'
  framework: React
---

# Basic Setup

Install and render a Cloudflare Turnstile widget in your React application.

## Installation

```bash
# npm
npm install @marsidev/react-turnstile

# pnpm
pnpm add @marsidev/react-turnstile

# yarn
yarn add @marsidev/react-turnstile

# bun
bun add @marsidev/react-turnstile
```

## Get Your Site Key

Before using Turnstile, you need a site key from Cloudflare:

1. Go to the [Cloudflare Turnstile dashboard](https://developers.cloudflare.com/turnstile/get-started/)
2. Create a new widget
3. Copy your site key (starts with `0x` or `1x` for testing)

**Note:** Site keys are **NOT** secret. They are safe to include in client-side code.

## Basic Usage

```tsx
import { Turnstile } from '@marsidev/react-turnstile'

export default function LoginForm() {
  return (
    <form>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      {/* Basic Turnstile widget */}
      <Turnstile siteKey="YOUR_SITE_KEY" />

      <button type="submit">Login</button>
    </form>
  )
}
```

## Widget Sizes

Choose the size that fits your layout:

| Size | Dimensions | Best For |
|------|------------|----------|
| `normal` (default) | 300×65px | Most forms, standard layouts |
| `compact` | 150×140px | Mobile, tight spaces |
| `flexible` | 100% width × 65px | Responsive layouts |
| `invisible` | 0×0px | Hidden widgets (requires Invisible widget type from Cloudflare) |

```tsx
// Compact size for mobile
<Turnstile
  siteKey="YOUR_SITE_KEY"
  options={{ size: 'compact' }}
/>

// Flexible width
<Turnstile
  siteKey="YOUR_SITE_KEY"
  options={{ size: 'flexible' }}
/>
```

## Handling the Success Token

Use the `onSuccess` callback to receive the verification token:

```tsx
import { Turnstile } from '@marsidev/react-turnstile'
import { useState } from 'react'

export default function LoginForm() {
  const [token, setToken] = useState<string | null>(null)

  return (
    <form>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <Turnstile
        siteKey="YOUR_SITE_KEY"
        onSuccess={(token) => setToken(token)}
      />

      <button type="submit" disabled={!token}>
        Login
      </button>
    </form>
  )
}
```

## Complete Form Example

```tsx
'use client' // For Next.js App Router
import { Turnstile } from '@marsidev/react-turnstile'
import { useState } from 'react'

export default function ContactForm() {
  const [token, setToken] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return

    setIsSubmitting(true)

    // Send token to your server for validation
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, /* other form data */ })
    })

    if (response.ok) {
      // Handle success
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" required />
      <input type="email" name="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required />

      <Turnstile
        siteKey="YOUR_SITE_KEY"
        onSuccess={setToken}
      />

      <button type="submit" disabled={!token || isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
```

## Common Mistakes

### ❌ Using Invisible Size Without Invisible Widget Type

The `invisible` size is **only** for the Invisible widget type from Cloudflare. Using it with a normal widget shows nothing.

**Wrong:**
```tsx
// Shows nothing if widget type is not "Invisible"
<Turnstile siteKey="xxx" options={{ size: 'invisible' }} />
```

**Correct:**
```tsx
// Use visible sizes for normal widgets
<Turnstile siteKey="xxx" options={{ size: 'normal' }} />
<Turnstile siteKey="xxx" options={{ size: 'compact' }} />
<Turnstile siteKey="xxx" options={{ size: 'flexible' }} />
```

## Next Steps

- **Customize appearance:** See [widget-customization skill](./widget-customization/SKILL.md)
- **Handle tokens properly:** See [token-lifecycle skill](./token-lifecycle/SKILL.md)
- **Next.js integration:** See [nextjs-ssr skill](./nextjs-ssr/SKILL.md)
- **Multiple widgets:** See [multiple-widgets skill](./multiple-widgets/SKILL.md)

## Testing During Development

Use Cloudflare's test keys that always pass validation:

- **Site key:** `1x00000000000000000000AA`
- **Secret key:** `1x0000000000000000000000000000000AA`

See: https://developers.cloudflare.com/turnstile/troubleshooting/testing/
