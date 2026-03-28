---
name: nextjs-ssr
description: >
  Integrate Turnstile with Next.js, handle SSR, hydration, and App Router.
  Activate when building Next.js applications with App Router or Pages Router,
  or when encountering SSR-related errors.
triggers:
  - 'nextjs turnstile'
  - 'next.js turnstile'
  - 'turnstile hydration error'
  - 'turnstile ssr'
  - 'app router turnstile'
  - 'window is not defined turnstile'
  - 'use client turnstile'
  - 'turnstile script nextjs'
category: framework
metadata:
  library: '@marsidev/react-turnstile'
  library_version: '1.4.2'
  framework: Next.js
---

# Next.js and SSR Integration

Integrate Turnstile with Next.js applications, handling server-side rendering, hydration, and script loading optimization.

## Important: Client-Side Only

Turnstile is a **client-side only** library. It must not run during server-side rendering.

## App Router

### Basic Setup with 'use client'

Always use the `'use client'` directive in files using Turnstile:

```tsx
'use client'

import { Turnstile } from '@marsidev/react-turnstile'

export default function ContactForm() {
  return (
    <form>
      <input type="email" placeholder="Email" />
      <Turnstile siteKey="YOUR_SITE_KEY" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Manual Script Injection (Recommended)

For better performance and to avoid hydration issues, manually inject the script:

```tsx
'use client'

import {
  Turnstile,
  SCRIPT_URL,
  DEFAULT_SCRIPT_ID
} from '@marsidev/react-turnstile'
import Script from 'next/script'

export default function ContactForm() {
  return (
    <>
      <Script
        id={DEFAULT_SCRIPT_ID}
        src={SCRIPT_URL}
        strategy="afterInteractive"
      />

      <form>
        <input type="email" placeholder="Email" />

        <Turnstile
          siteKey="YOUR_SITE_KEY"
          injectScript={false}
        />

        <button type="submit">Submit</button>
      </form>
    </>
  )
}
```

### Layout-Level Script (For Multiple Pages)

If you use Turnstile across multiple pages, add the script in your root layout:

```tsx
// app/layout.tsx
import { SCRIPT_URL, DEFAULT_SCRIPT_ID } from '@marsidev/react-turnstile'
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script
          id={DEFAULT_SCRIPT_ID}
          src={SCRIPT_URL}
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  )
}
```

Then in individual pages:

```tsx
'use client'

import { Turnstile } from '@marsidev/react-turnstile'

export default function Page() {
  return (
    <Turnstile
      siteKey="YOUR_SITE_KEY"
      injectScript={false} // Script already loaded in layout
    />
  )
}
```

## Pages Router

### Basic Setup

```tsx
import { Turnstile } from '@marsidev/react-turnstile'

export default function ContactPage() {
  return (
    <form>
      <input type="email" placeholder="Email" />
      <Turnstile siteKey="YOUR_SITE_KEY" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### With Manual Script Injection

```tsx
import {
  Turnstile,
  SCRIPT_URL,
  DEFAULT_SCRIPT_ID
} from '@marsidev/react-turnstile'
import Head from 'next/head'

export default function ContactPage() {
  return (
    <>
      <Head>
        <script
          id={DEFAULT_SCRIPT_ID}
          src={SCRIPT_URL}
          async
          defer
        />
      </Head>

      <form>
        <input type="email" placeholder="Email" />
        <Turnstile
          siteKey="YOUR_SITE_KEY"
          injectScript={false}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  )
}
```

## Server Actions (App Router)

When using Server Actions, validate the token on the server:

```tsx
'use client'

import { Turnstile } from '@marsidev/react-turnstile'
import { useRef } from 'react'
import type { TurnstileInstance } from '@marsidev/react-turnstile'

export default function ContactForm() {
  const ref = useRef<TurnstileInstance>(null)

  async function handleSubmit(formData: FormData) {
    const token = ref.current?.getResponse()

    if (!token) {
      alert('Please complete the CAPTCHA')
      return
    }

    // Call Server Action with token
    await submitForm(formData, token)

    // Reset for next submission
    ref.current?.reset()
  }

  return (
    <form action={handleSubmit}>
      <input type="email" name="email" placeholder="Email" />
      <Turnstile ref={ref} siteKey="YOUR_SITE_KEY" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

Server action:

```tsx
// app/actions.ts
'use server'

export async function submitForm(formData: FormData, token: string) {
  // Validate token with Cloudflare
  const verification = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
      }),
    }
  )

  const result = await verification.json()

  if (!result.success) {
    throw new Error('CAPTCHA validation failed')
  }

  // Process form...
}
```

## Common Mistakes

### ❌ Hydration Mismatch (Missing 'use client')

**Error:** `Hydration failed because the initial UI does not match what was rendered on the server`

**Wrong:**
```tsx
// app/page.tsx
import { Turnstile } from '@marsidev/react-turnstile'

export default function Page() {
  return <Turnstile siteKey="xxx" /> // ❌ No 'use client'
}
```

**Correct:**
```tsx
// app/page.tsx
'use client' // ✅ Required!

import { Turnstile } from '@marsidev/react-turnstile'

export default function Page() {
  return <Turnstile siteKey="xxx" />
}
```

### ❌ Window is not defined

**Error:** `window is not defined`

**Cause:** Using Turnstile in a Server Component or during SSR.

**Solution:** Always use `'use client'` directive.

### ❌ Script Loading Race Condition

**Error:** Widget doesn't render or shows loading indefinitely.

**Wrong:**
```tsx
// Script loads after component renders
<Turnstile siteKey="xxx" />
```

**Correct:**
```tsx
// Use next/script with proper strategy
<Script
  id={DEFAULT_SCRIPT_ID}
  src={SCRIPT_URL}
  strategy="beforeInteractive" // or "afterInteractive"
/>
<Turnstile siteKey="xxx" injectScript={false} />
```

## Script Loading Strategies

| Strategy | When to Use |
|----------|-------------|
| `beforeInteractive` | Load script before page becomes interactive (blocks render) |
| `afterInteractive` | Load script after page becomes interactive (default, recommended) |
| `lazyOnload` | Load script during idle time (may cause delay) |

## Environment Variables

Store your keys in `.env.local`:

```bash
# .env.local
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x0000000000000000000000000000000
TURNSTILE_SECRET_KEY=0x0000000000000000000000000000000000000000000
```

**Note:** Only prefix with `NEXT_PUBLIC_` for the site key (client-side). Keep the secret key server-side only.

## See Also

- [basic-setup skill](./basic-setup/SKILL.md) - Getting started
- [token-lifecycle skill](./token-lifecycle/SKILL.md) - Form integration patterns
- [multiple-widgets skill](./multiple-widgets/SKILL.md) - Multiple widgets on same page
