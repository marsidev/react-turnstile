import Link from './Link'

const Footer = () => {
	return (
		<footer className="flex flex-col items-center text-white">
			<div>
				<code>react-turnstile</code>{' '}
				<Link href="https://github.com/marsidev/react-turnstile">source code</Link>
			</div>

			<div>
				Cloudflare Turnstile{' '}
				<Link href="https://developers.cloudflare.com/turnstile/get-started">docs</Link>
			</div>

			<div>
				Built by <Link href="https://github.com/marsidev">Luis Marsiglia</Link>
			</div>
		</footer>
	)
}

export default Footer
