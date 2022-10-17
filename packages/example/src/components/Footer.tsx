import Link from './Link'

const Footer = () => {
	return (
		<footer className='text-white flex items-center flex-col'>
			<div>
				<code>react-turnstile</code> source code{' '}
				<Link href='https://github.com/marsidev/react-turnstile' label='here' />
			</div>

			<div>
				Source code of this demo{' '}
				<Link
					href='https://github.com/marsidev/react-turnstile/tree/main/packages/example'
					label='here'
				/>
			</div>

			<div>
				Cloudflare Turnstile{' '}
				<Link href='https://developers.cloudflare.com/turnstile/get-started/' label='docs' />
			</div>

			<div>
				Built by <Link href='https://github.com/marsidev' label='Luis Marsiglia' />
			</div>
		</footer>
	)
}

export default Footer
