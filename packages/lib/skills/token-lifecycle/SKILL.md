---
name: token-lifecycle
description: >
  Handle token generation, expiration, validation workflow, and form integration.
  Activate when implementing form submission with CAPTCHA, handling token expiration,
  or integrating with server-side validation.
triggers:
  - 'turnstile token expired'
  - 'turnstile getResponse'
  - 'turnstile reset'
  - 'turnstile form submit'
  - 'turnstile onSuccess'
  - 'turnstile onExpire'
  - 'validate turnstile token'
  - 'turnstile server validation'
category: lifecycle
metadata:
  library: '@marsidev/react-turnstile'
  library_version: '1.4.2'
  framework: React
---

# Token Lifecycle

Handle token generation, expiration, validation workflow, and form integration.

## Understanding Tokens

Turnstile tokens are **single-use** and expire after a timeout (typically 5 minutes). Once validated by your server, they cannot be used again.

## Three Ways to Get Tokens

### 1. onSuccess Callback (Recommended)

Get the token when the user completes the challenge:

```tsx
import { Turnstile } from '@marsidev/react-turnstile'
import { useState } from 'react'

export default function ContactForm() {
  const [token, setToken] = useState<string | null>(null)

  return (
    <form>
      <input type="email" placeholder="Email" />

      <Turnstile
        siteKey="YOUR_SITE_KEY"
        onSuccess={(token) => setToken(token)}
      />

      <button type="submit" disabled={!token}>
        Submit
      </button>
    </form>
  )
}
```

### 2. ref.current.getResponse()

Get the token imperatively at submission time:

```tsx
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useRef } from 'react'

export default function ContactForm() {
  const ref = useRef<TurnstileInstance>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Get token at the moment of submission
    const token = ref.current?.getResponse()

    if (!token) {
      alert('Please complete the CAPTCHA')
      return
    }

    await submitForm(token)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" />
      <Turnstile ref={ref} siteKey="YOUR_SITE_KEY" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### 3. Hidden Form Field

The widget automatically adds a hidden input. Access it via FormData:

```tsx
export default function ContactForm() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const token = formData.get('cf-turnstile-response')

    if (!token) {
      alert('Please complete the CAPTCHA')
      return
    }

    await submitForm(token)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" />
      <Turnstile siteKey="YOUR_SITE_KEY" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Complete Form Integration

Best practice: Get token at submission time, validate server-side, reset widget:

```tsx
'use client'

import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useRef, useState } from 'react'

export default function ContactForm() {
  const ref = useRef<TurnstileInstance>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const token = ref.current?.getResponse()

    if (!token) {
      setError('Please complete the CAPTCHA')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, /* form data */ })
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      // Success! Reset widget for potential re-submission
      ref.current?.reset()

      // Clear form, show success message, etc.
    } catch (err) {
      setError('Failed to submit. Please try again.')

      // Reset widget on error too (token may be expired/used)
      ref.current?.reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}

      <input type="email" name="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required />

      <Turnstile
        ref={ref}
        siteKey="YOUR_SITE_KEY"
        onExpire={() => {
          // Optional: handle expiration
          console.log('Token expired, please retry')
        }}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
```

## Handling Token Expiration

Tokens expire after ~5 minutes. Handle this with `onExpire` callback:

```tsx
<Turnstile
  ref={ref}
  siteKey="YOUR_SITE_KEY"
  options={{ refreshExpired: 'manual' }}
  onExpire={() => {
    // Token expired - inform user or auto-reset
    alert('Verification expired. Please try again.')
    ref.current?.reset()
  }}
/>
```

Or let it auto-refresh:

```tsx
<Turnstile
  siteKey="YOUR_SITE_KEY"
  options={{ refreshExpired: 'auto' }} // Default
/>
```

## Server-Side Validation

**Important:** The library provides TypeScript types but NO built-in validation. You must implement server-side validation yourself.

### Example API Route (Next.js)

```tsx
// app/api/verify/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { token } = await request.json()

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
    return NextResponse.json(
      { error: 'CAPTCHA validation failed' },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}
```

### Environment Variables

```bash
# .env.local (server-side only)
TURNSTILE_SECRET_KEY=0x0000000000000000000000000000000000000000000
```

**Never expose the secret key client-side!**

## Imperative API Methods

Control the widget programmatically:

### reset()

Reset the widget after submission or error:

```tsx
ref.current?.reset()
```

### getResponsePromise()

Wait for token with timeout (useful for programmatic flows):

```tsx
try {
  const token = await ref.current?.getResponsePromise(30000) // 30s timeout
  // Use token...
} catch (error) {
  // Timeout or widget error
}
```

### isExpired()

Check if token has expired:

```tsx
if (ref.current?.isExpired()) {
  ref.current?.reset()
}
```

### remove() and render()

Advanced: Fully remove and re-render the widget:

```tsx
ref.current?.remove() // Remove from DOM
ref.current?.render() // Re-render (only if previously removed)
```

## Common Mistakes

### ❌ Token Expires Before Form Submission

**Problem:** User takes too long to submit, token expires.

**Wrong:**
```tsx
const [token, setToken] = useState<string | null>(null)

<Turnstile onSuccess={setToken} />

// User delays submitting...
<button onClick={() => submit(token)}>Submit</button> // Token expired!
```

**Correct:**
```tsx
// Get token at submission time, not onSuccess
const token = ref.current?.getResponse()
await submit(token)
ref.current?.reset() // Reset for next time
```

### ❌ Expecting Built-in Server Validation

**Wrong:**
```tsx
import { validateTurnstile } from '@marsidev/react-turnstile'
// ❌ This doesn't exist!
```

**Correct:**
```tsx
// Implement your own server validation
const response = await fetch('/api/verify', {
  method: 'POST',
  body: JSON.stringify({ token })
})
```

### ❌ Calling Methods Before Widget Loads

**Wrong:**
```tsx
useEffect(() => {
  // Widget not ready yet!
  const token = ref.current?.getResponse() // undefined
}, [])
```

**Correct:**
```tsx
// Wait for onSuccess or user action
<Turnstile
  ref={ref}
  onSuccess={(token) => {
    // Widget is ready
  }}
/>
```

### ❌ Not Resetting After Validation

**Problem:** Token is single-use. After server validation, it's invalid.

**Correct:**
```tsx
const result = await validateToken(token)
if (result.success) {
  // Process form...
  ref.current?.reset() // Reset for potential re-submission
}
```

## Best Practices

1. **Get token at submission time** - Not onSuccess callback
2. **Always reset after use** - Tokens are single-use
3. **Handle expiration gracefully** - Inform users and provide retry
4. **Validate server-side** - Never trust client-side validation alone
5. **Keep secret key server-side** - Never expose in client code

## See Also

- [basic-setup skill](./basic-setup/SKILL.md) - Basic widget setup
- [multiple-widgets skill](./multiple-widgets/SKILL.md) - Managing tokens with multiple widgets
- [nextjs-ssr skill](./nextjs-ssr/SKILL.md) - Server Actions validation
