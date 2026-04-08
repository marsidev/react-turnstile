<div align="center">
 <h1>React Turnstile</h1>
 <img src="https://raw.githubusercontent.com/marsidev/react-turnstile/main/preview.png" width="300" alt="Cloudflare Turnstile widget" />
 <p>Cloudflare Turnstile integration for React.</p>
 <a href="https://npmx.dev/package/@marsidev/react-turnstile">
  <img src="https://nodei.co/npm/@marsidev/react-turnstile.svg?style=shields&data=v,u,d&color=%23f58d1a">
 </a>
 <img src="https://img.shields.io/npm/unpacked-size/%40marsidev%2Freact-turnstile?style=square-flat&color=f58d1a" alt="unpacked size" />
 <img src="https://img.shields.io/bundlephobia/minzip/%40marsidev%2Freact-turnstile?style=square-flat&color=f58d1a" alt="npm bundle size" />
</div>

## Features

* 🕵️‍♀️ **Privacy-first** - No user tracking, no cookies, GDPR-friendly by design
* 📦 **Lightweight** - Only 6.3 KB minified
* 💪 **Smart verification** - Often invisible to users with minimal interaction
* 💉 **Zero config** - Automatic script injection, works out of the box
* 📐 **Multiple widget sizes** - normal, compact, flexible, invisible
* 🎮 **Imperative API** - Control via ref: `reset()`, `execute()`, `getResponse()`, `isExpired()`
* ⚡️ **SSR ready** - Works with Next.js, Remix, and any React SSR framework
* 💻 **Full TypeScript support**

### **[📖 Read the docs →](https://docs.page/marsidev/react-turnstile/)**    **[🚀 See the demo →](https://react-turnstile.vercel.app/)**

## Getting started

1. [Follow these steps](https://developers.cloudflare.com/turnstile/get-started/) to obtain a free site key and secret key from Cloudflare.
2. Install `@marsidev/react-turnstile` into your React project.

 ```bash
 npm i @marsidev/react-turnstile -E
 ```

## Usage

### Basic

```jsx
import { Turnstile } from '@marsidev/react-turnstile'

function Widget() {
  return <Turnstile siteKey='1x00000000000000000000AA' />
}
```

### With form and imperative API

```tsx
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useRef } from 'react'

function LoginForm() {
  const turnstileRef = useRef<TurnstileInstance | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const token = turnstileRef.current?.getResponse()
    // Send token to your server...
    turnstileRef.current?.reset() // Reset after submission
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <Turnstile
        ref={turnstileRef}
        siteKey='1x00000000000000000000AA'
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

## Star history

[![Star History Chart](https://api.star-history.com/svg?repos=marsidev/react-turnstile&type=Date)](https://star-history.com/#marsidev/react-turnstile&Date)

## Contributing

Any contributions are greatly appreciated. If you have a suggestion that would make this project better, please fork the repo and create a Pull Request. You can also [open an issue](https://github.com/marsidev/react-turnstile/issues/new).

## Development

* [Fork](https://github.com/marsidev/react-turnstile/fork) or clone this repository.
* Install dependencies with `pnpm install`.
* Run `pnpm dev` to start both the library (with HMR) and the Next.js demo app concurrently

For reference, the project structure is as follows:

```
.
├── packages/lib/    # Library source code
├── demos/nextjs/    # Next.js demo app
└── docs/            # Documentation
```

## Support

If you find this library useful, you can buy me a coffee:

<a href='https://ko-fi.com/K3K1D5PRI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi2.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Contributors

<a href="https://github.com/marsidev/react-turnstile/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=marsidev/react-turnstile" alt="Contributors" />
</a>

## License

Published under the [MIT License](./LICENCE).
