import { render, screen, waitFor } from '@testing-library/react'
import { DEFAULT_CONTAINER_ID, DEFAULT_SCRIPT_ID, SCRIPT_URL, Turnstile } from '../src'
import { DEMO_SITEKEY } from './constants'

function resetDom() {
	document.body.innerHTML = ''
	document.head.innerHTML = ''
}

describe('Basic setup', () => {
	beforeAll(() => {
		render(<Turnstile siteKey={DEMO_SITEKEY.pass} />)
	})

	afterAll(() => {
		resetDom()
	})

	it('renders the widget container', async () => {
		const container = document.querySelector(`#${DEFAULT_CONTAINER_ID}`)
		expect(container).toBeTruthy()
	})

	it('injects the script', async () => {
		const script = document.querySelector('script')
		expect(script).toBeTruthy()
		expect(script?.id).toBe(`${DEFAULT_SCRIPT_ID}__${DEFAULT_CONTAINER_ID}`)
		expect(script?.src).toContain(SCRIPT_URL)
	})

	// this is not working, maybe Cloudflare is detecting the test as a bot
	it.skip('loads the cloudflare iframe', async () => {
		await waitFor(
			() => {
				const widget = screen.getByTitle('Widget containing a Cloudflare security challenge')
				expect(widget).toBeInTheDocument()
			},
			{ timeout: 15000 }
		)
	})
})

describe('Manual script injection', () => {
	beforeAll(() => {
		render(<Turnstile injectScript={false} siteKey={DEMO_SITEKEY.pass} />)
	})

	afterAll(() => {
		resetDom()
	})

	it('renders the widget container', async () => {
		const container = document.querySelector(`#${DEFAULT_CONTAINER_ID}`)
		expect(container).toBeTruthy()
	})

	it('does not injects the script', async () => {
		const script = document.querySelector('script')
		expect(script).toBeFalsy()
	})
})
