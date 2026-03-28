---
name: multiple-widgets
description: >
  Handle multiple Turnstile widgets on the same page without conflicts.
  Activate when adding more than one CAPTCHA to a page, or when widgets
  interfere with each other.
triggers:
  - 'multiple turnstile widgets'
  - 'two turnstile forms'
  - 'turnstile widget conflict'
  - 'turnstile race condition'
  - 'turnstile id'
  - 'multiple captcha same page'
  - 'widget not responding'
category: core
metadata:
  library: '@marsidev/react-turnstile'
  library_version: '1.4.2'
  framework: React
---

# Multiple Widgets

Handle multiple Turnstile widgets on the same page without conflicts or race conditions.

## Basic Multiple Widgets

When using multiple widgets, always provide unique IDs:

```tsx
import { Turnstile } from '@marsidev/react-turnstile'

export default function MultiFormPage() {
  return (
    <>
      <section>
        <h2>Newsletter Signup</h2>
        <form>
          <input type="email" placeholder="Email" />
          <Turnstile
            id="newsletter-widget"
            siteKey="YOUR_SITE_KEY"
          />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      <section>
        <h2>Contact Form</h2>
        <form>
          <input type="email" placeholder="Email" />
          <textarea placeholder="Message" />
          <Turnstile
            id="contact-widget"
            siteKey="YOUR_SITE_KEY"
          />
          <button type="submit">Send</button>
        </form>
      </section>
    </>
  )
}
```

## With Separate Refs

Control each widget independently:

```tsx
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useRef } from 'react'

export default function MultiFormPage() {
  const newsletterRef = useRef<TurnstileInstance>(null)
  const contactRef = useRef<TurnstileInstance>(null)

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault()
    const token = newsletterRef.current?.getResponse()

    if (!token) {
      alert('Please complete the CAPTCHA')
      return
    }

    // Submit form...

    // Reset only this widget
    newsletterRef.current?.reset()
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    const token = contactRef.current?.getResponse()

    if (!token) {
      alert('Please complete the CAPTCHA')
      return
    }

    // Submit form...

    // Reset only this widget
    contactRef.current?.reset()
  }

  return (
    <>
      <section>
        <h2>Newsletter Signup</h2>
        <form onSubmit={handleNewsletterSubmit}>
          <input type="email" placeholder="Email" />
          <Turnstile
            ref={newsletterRef}
            id="newsletter-widget"
            siteKey="YOUR_SITE_KEY"
          />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      <section>
        <h2>Contact Form</h2>
        <form onSubmit={handleContactSubmit}>
          <input type="email" placeholder="Email" />
          <textarea placeholder="Message" />
          <Turnstile
            ref={contactRef}
            id="contact-widget"
            siteKey="YOUR_SITE_KEY"
          />
          <button type="submit">Send</button>
        </form>
      </section>
    </>
  )
}
```

## Manual Script Injection (Recommended for Multiple Widgets)

When using multiple widgets, manual script injection ensures optimal loading:

```tsx
import {
  Turnstile,
  SCRIPT_URL,
  DEFAULT_SCRIPT_ID
} from '@marsidev/react-turnstile'
import Script from 'next/script'

export default function MultiFormPage() {
  return (
    <>
      {/* Single script for all widgets */}
      <Script
        id={DEFAULT_SCRIPT_ID}
        src={SCRIPT_URL}
        strategy="afterInteractive"
      />

      <section>
        <h2>Form 1</h2>
        <Turnstile
          id="widget-1"
          siteKey="YOUR_SITE_KEY"
          injectScript={false}
        />
      </section>

      <section>
        <h2>Form 2</h2>
        <Turnstile
          id="widget-2"
          siteKey="YOUR_SITE_KEY"
          injectScript={false}
        />
      </section>
    </>
  )
}
```

## Dynamic Widgets (Conditional Rendering)

When widgets appear/disappear based on state:

```tsx
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useRef, useState } from 'react'

export default function DynamicForms() {
  const [showNewsletter, setShowNewsletter] = useState(false)
  const [showContact, setShowContact] = useState(false)

  const newsletterRef = useRef<TurnstileInstance>(null)
  const contactRef = useRef<TurnstileInstance>(null)

  return (
    <>
      <button onClick={() => setShowNewsletter(!showNewsletter)}>
        Toggle Newsletter
      </button>

      <button onClick={() => setShowContact(!showContact)}>
        Toggle Contact
      </button>

      {showNewsletter && (
        <section>
          <h2>Newsletter</h2>
          <Turnstile
            ref={newsletterRef}
            id="newsletter-widget"
            siteKey="YOUR_SITE_KEY"
          />
        </section>
      )}

      {showContact && (
        <section>
          <h2>Contact</h2>
          <Turnstile
            ref={contactRef}
            id="contact-widget"
            siteKey="YOUR_SITE_KEY"
          />
        </section>
      )}
    </>
  )
}
```

## Tabbed Interface

Multiple forms in tabs:

```tsx
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useRef, useState } from 'react'

export default function TabbedForms() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')

  const loginRef = useRef<TurnstileInstance>(null)
  const signupRef = useRef<TurnstileInstance>(null)

  return (
    <>
      <div role="tablist">
        <button onClick={() => setActiveTab('login')}>Login</button>
        <button onClick={() => setActiveTab('signup')}>Sign Up</button>
      </div>

      {activeTab === 'login' && (
        <form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <Turnstile
            ref={loginRef}
            id="login-widget"
            siteKey="YOUR_SITE_KEY"
          />
          <button type="submit">Login</button>
        </form>
      )}

      {activeTab === 'signup' && (
        <form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />
          <Turnstile
            ref={signupRef}
            id="signup-widget"
            siteKey="YOUR_SITE_KEY"
          />
          <button type="submit">Sign Up</button>
        </form>
      )}
    </>
  )
}
```

## Common Mistakes

### ❌ Using Same ID for Multiple Widgets

**Wrong:**
```tsx
<>
  <Turnstile siteKey="xxx" /> // Uses default "cf-turnstile" id
  <Turnstile siteKey="xxx" /> // Also uses "cf-turnstile" id - CONFLICT!
</>
```

**Result:** Widgets interfere with each other, only one works correctly.

**Correct:**
```tsx
<>
  <Turnstile id="widget-1" siteKey="xxx" />
  <Turnstile id="widget-2" siteKey="xxx" />
</>
```

### ❌ Script Loading Race Conditions

**Wrong:**
```tsx
// Each widget tries to inject the script independently
<Turnstile siteKey="xxx" />
<Turnstile siteKey="xxx" />
```

**Result:** Race conditions, widgets may fail to initialize.

**Correct:**
```tsx
// Single script injection for all widgets
<Script id={DEFAULT_SCRIPT_ID} src={SCRIPT_URL} />
<Turnstile id="widget-1" siteKey="xxx" injectScript={false} />
<Turnstile id="widget-2" siteKey="xxx" injectScript={false} />
```

### ❌ Sharing Refs Between Widgets

**Wrong:**
```tsx
const ref = useRef<TurnstileInstance>(null)

<>
  <Turnstile ref={ref} id="widget-1" siteKey="xxx" />
  <Turnstile ref={ref} id="widget-2" siteKey="xxx" /> // ❌ Same ref!
</>
```

**Result:** Both widgets share state, methods don't work correctly.

**Correct:**
```tsx
const ref1 = useRef<TurnstileInstance>(null)
const ref2 = useRef<TurnstileInstance>(null)

<>
  <Turnstile ref={ref1} id="widget-1" siteKey="xxx" />
  <Turnstile ref={ref2} id="widget-2" siteKey="xxx" />
</>
```

## Debugging Multiple Widgets

If widgets aren't working correctly:

1. **Check unique IDs:** Ensure all widgets have different `id` props
2. **Check console:** Look for "Turnstile has not been loaded" warnings
3. **Inspect DOM:** Verify containers have different IDs
4. **Script loading:** Use manual injection with `injectScript={false}`

## Performance Considerations

- Each widget makes a request to Cloudflare
- Consider if you really need multiple widgets vs. one widget protecting multiple actions
- Manual script injection prevents duplicate script loading

## See Also

- [basic-setup skill](./basic-setup/SKILL.md) - Single widget setup
- [token-lifecycle skill](./token-lifecycle/SKILL.md) - Handling tokens with multiple widgets
- [nextjs-ssr skill](./nextjs-ssr/SKILL.md) - Next.js integration with multiple widgets
