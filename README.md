<div align="center">
 <h1>React Turnstile</h1>
 <img src="https://raw.githubusercontent.com/marsidev/react-turnstile/main/preview.png" width="300" alt="Cloudflare Turnstile widget" />
 <p><a href="https://developers.cloudflare.com/turnstile/">Cloudflare Turnstile</a> integration for React.</p>
 <a href="https://npm.im/@marsidev/react-turnstile">
  <img src="https://badgen.net/npm/v/@marsidev/react-turnstile?style=flat-square" alt="npm version" />
 </a>
 <a href="https://npm.im/@marsidev/react-turnstile">
  <img src="https://badgen.net/npm/dm/@marsidev/react-turnstile?style=flat-square" alt="npm downloads" />
 </a>
 <a href="https://packagephobia.com/result?p=@marsidev/react-turnstile">
  <img src="https://badgen.net/packagephobia/install/@marsidev/react-turnstile?style=square-flat" alt="install size" />
 </a>
 <a href="https://bundlephobia.com/package/@marsidev/react-turnstile">
  <img src="https://badgen.net/bundlephobia/min/@marsidev/react-turnstile?style=square-flat" alt="bundle size" />
 </a>
 <!-- <a href="https://bundlejs.com">
  <img src="https://edge.bundlejs.com/?q=@marsidev/react-turnstile&badge&badge-style=flat-square" alt="bundle size powered by bundlejs.com" />
 </a> -->
 <a href="https://github.com/marsidev/react-turnstile/actions/workflows/ci.yml"><img src="https://badgen.net/github/checks/marsidev/react-turnstile/main?style=flat-square" alt="CI status"></a>
 <img src="https://img.shields.io/badge/tested_with-playwright-3ea744.svg?style=flat-square" alt="tested with playwright" />
 <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs are welcome" />
</div>

## Features

* 💪 Smart verification with minimal user interaction
* 🕵️‍♀️ Privacy-focused approach
* 💉 Automatic script injection
* ⚡️ SSR ready
* 💻 TypeScript support

## [Docs](https://docs.page/marsidev/react-turnstile/) | [Demo](https://react-turnstile.vercel.app/)

## Getting started

1. [Follow these steps](https://developers.cloudflare.com/turnstile/get-started/) to obtain a free site key and secret key from Cloudflare.
2. Install `@marsidev/react-turnstile` into your React project.

 ```bash
 npm i @marsidev/react-turnstile
 ```

## Usage

```jsx
import { Turnstile } from '@marsidev/react-turnstile'

function Widget() {
  return <Turnstile siteKey='1x00000000000000000000AA' />
}
```

> Checkout [the docs](https://docs.page/marsidev/react-turnstile) for more examples and for a detailed info about the `Turnstile` props.

> Checkout [the demo](https://react-turnstile.vercel.app/) for a live example.

## Contributing

Any contributions are greatly appreciated. If you have a suggestion that would make this project better, please fork the repo and create a Pull Request. You can also [open an issue](https://github.com/marsidev/react-turnstile/issues/new).

## Development

* [Fork](https://github.com/marsidev/react-turnstile/fork) or clone this repository.
* Install dependencies with `pnpm install`.
* You can use `pnpm dev` to start the demo page in dev mode, which also rebuild the library when file changes are detected in the `packages/lib` folder.

> The library is written under the `packages/lib` folder, the demo page is under the `demos/nextjs` folder and the docs are under the `docs` folder.

## Contributors

<a href="https://github.com/marsidev/react-turnstile/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=marsidev/react-turnstile" alt="Contributors" />
</a>

## Credits

Inspired by

* [nuxt-turnstile](https://github.com/danielroe/nuxt-turnstile)
* [svelte-turnstile](https://github.com/ghostdevv/svelte-turnstile)
* [react-google-recaptcha-v3](https://github.com/t49tran/react-google-recaptcha-v3)
* [reaptcha](https://github.com/sarneeh/reaptcha)

## Support

If you like this project, please consider supporting it through a [PayPal donation](https://paypal.me/marsigliacr). :blush:

## License

Published under the [MIT License](./LICENCE).
