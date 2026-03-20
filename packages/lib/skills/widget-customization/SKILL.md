---
name: widget-customization
description: >
  Customize widget appearance, theme, execution mode, and behavior.
  Activate when styling the widget, changing when/how tokens are generated,
  or integrating with specific UX flows like multi-step forms.
triggers:
  - 'turnstile theme dark mode'
  - 'turnstile invisible'
  - 'turnstile execution mode'
  - 'turnstile appearance'
  - 'customize turnstile widget'
  - 'turnstile callback not working'
  - 'rerenderOnCallbackChange'
category: core
metadata:
  library: '@marsidev/react-turnstile'
  library_version: '1.4.2'
  framework: React
---

# Widget Customization

Customize the Turnstile widget's appearance, behavior, and integration with your application's UX.

## Appearance Modes

Control when the widget is visible to users:

### `always` (default)
Widget is always visible.

```tsx
<Turnstile
  siteKey="YOUR_SITE_KEY"
  options={{ appearance: 'always' }}
/>
```

### `execute`
Widget is hidden until you call `execute()` method. Useful for custom triggers.

```tsx
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useRef } from 'react'

export default function CustomTrigger() {
  const ref = useRef<TurnstileInstance>(null)

  return (
    <>
      <Turnstile
        ref={ref}
        siteKey="YOUR_SITE_KEY"
        options={{
          appearance: 'execute',
          execution: 'execute'
        }}
      />

      <button onClick={() => ref.current?.execute()}>
        Verify I'm Human
      </button>
    </>
  )
}
```

### `interaction-only`
Widget only appears when user interaction is required (most privacy-friendly).

```tsx
<Turnstile
  siteKey="YOUR_SITE_KEY"
  options={{ appearance: 'interaction-only' }}
/>
```

## Execution Modes

Control when the token is generated:

### `render` (default)
Token is generated automatically when the widget renders.

### `execute`
Token is generated only when you explicitly call `execute()`. Useful for delaying verification.

## Themes

Match the widget to your application's color scheme:

```tsx
// Auto-detects from system preference
<Turnstile siteKey="xxx" options={{ theme: 'auto' }} />

// Force light theme
<Turnstile siteKey="xxx" options={{ theme: 'light' }} />

// Force dark theme
<Turnstile siteKey="xxx" options={{ theme: 'dark' }} />
```

## Language/Localization

Set the widget language:

```tsx
// Auto-detect from browser
<Turnstile siteKey="xxx" options={{ language: 'auto' }} />

// Specific language (ISO 639-1)
<Turnstile siteKey="xxx" options={{ language: 'en' }} />
<Turnstile siteKey="xxx" options={{ language: 'es' }} />
<Turnstile siteKey="xxx" options={{ language: 'de' }} />
```

See all supported languages: https://developers.cloudflare.com/turnstile/reference/supported-languages/

## Dynamic Callbacks

By default, callbacks access the latest state without re-rendering the widget. For cases where you need the widget to re-render when callbacks change:

```tsx
import { Turnstile } from '@marsidev/react-turnstile'
import { useCallback, useState } from 'react'

export default function DynamicForm() {
  const [userType, setUserType] = useState<'user' | 'admin'>('user')

  // IMPORTANT: Wrap callbacks with useCallback when using rerenderOnCallbackChange
  const handleSuccess = useCallback((token: string) => {
    if (userType === 'admin') {
      // Handle admin login
    } else {
      // Handle user login
    }
  }, [userType])

  return (
    <Turnstile
      siteKey="YOUR_SITE_KEY"
      rerenderOnCallbackChange={true}
      onSuccess={handleSuccess}
    />
  )
}
```

**⚠️ Warning:** Without `useCallback`, this causes infinite re-renders!

## Manual Script Injection

For better control over script loading (recommended for Next.js):

```tsx
import {
  Turnstile,
  SCRIPT_URL,
  DEFAULT_SCRIPT_ID
} from '@marsidev/react-turnstile'
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        id={DEFAULT_SCRIPT_ID}
        src={SCRIPT_URL}
        strategy="beforeInteractive"
      />

      <Turnstile
        siteKey="YOUR_SITE_KEY"
        injectScript={false}
      />
    </>
  )
}
```

## Custom Container Element

Change the HTML element used for the widget container:

```tsx
// Default: div
<Turnstile siteKey="xxx" />

// Use span
<Turnstile siteKey="xxx" as="span" />

// Use custom component
<Turnstile siteKey="xxx" as="section" className="my-turnstile" />
```

## Common Mistakes

### ❌ Forgetting useCallback with rerenderOnCallbackChange

**Wrong:**
```tsx
<Turnstile
  rerenderOnCallbackChange={true}
  onSuccess={(token) => handleToken(token)} // New function every render!
/>
```

**Correct:**
```tsx
const handleSuccess = useCallback((token: string) => {
  handleToken(token)
}, [])

<Turnstile
  rerenderOnCallbackChange={true}
  onSuccess={handleSuccess}
/>
```

### ❌ Calling execute() Without Proper Setup

**Wrong:**
```tsx
const ref = useRef<TurnstileInstance>(null)

// Button calls execute immediately
<button onClick={() => ref.current?.execute()}>Verify</button>

// Widget not configured for execution mode
<Turnstile ref={ref} siteKey="xxx" />
```

**Correct:**
```tsx
const ref = useRef<TurnstileInstance>(null)

<button onClick={() => ref.current?.execute()}>Verify</button>

// Must set execution and appearance modes
<Turnstile
  ref={ref}
  siteKey="xxx"
  options={{
    execution: 'execute',
    appearance: 'execute'
  }}
/>
```

## See Also

- [basic-setup skill](./basic-setup/SKILL.md) - Getting started
- [token-lifecycle skill](./token-lifecycle/SKILL.md) - Handling tokens and forms
- [nextjs-ssr skill](./nextjs-ssr/SKILL.md) - Next.js integration patterns
