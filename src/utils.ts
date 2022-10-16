import { InjectTurnstileScriptParams } from './types'

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
export const DEFAULT_SCRIPT_ID = 'cf-turnstile-script'
export const DEFAULT_ONLOAD_NAME = 'onloadTurnstileCallback'
export const DEFAULT_CONTAINER_ID = 'cf-turnstile'

/**
 * Function to check if script has already been injected
 *
 * @param scriptId
 * @returns
 */
export const isScriptInjected = (scriptId: string) => !!document.querySelector(`#${scriptId}`)

/**
 * Function to remove default widget
 *
 * @returns
 */
const removeDefaultWidget = () => {
	const nodeWidget = document.querySelector('.cf-turnstile')
	if (nodeWidget && nodeWidget.parentNode) {
		nodeWidget.parentNode.removeChild(nodeWidget)
	}
}

/**
 * Function to remove custom widget
 *
 * @returns
 */
const removeCustomWidget = (customWidget: HTMLElement | null) => {
	if (!customWidget) {
		return
	}

	while (customWidget.lastChild) {
		customWidget.lastChild.remove()
	}
}

/**
 * Function to remove node of widget element
 *
 * @param container
 * @returns
 */
export const removeWidget = (container?: HTMLElement | string) => {
	if (!container) {
		removeDefaultWidget()

		return
	}

	const customWidget = typeof container === 'string' ? document.getElementById(container) : container

	removeCustomWidget(customWidget)
}

/**
 * Function to remove the cloudflare turnstile script and his widget
 *
 * @param scriptId
 * @param container
 */
export const removeTurnstile = (scriptId?: string, container?: HTMLElement | string) => {
	// remove widget
	removeWidget(container)

	// remove turnstile instance from window
	window.turnstile = undefined

	// remove script
	const id = scriptId || DEFAULT_SCRIPT_ID
	let script = document.querySelector(`#${id}`)
	if (script) {
		script.remove()
	}

	// this might not be necessary
	script = document.querySelector(`script[src^="${SCRIPT_URL}"]`)
	if (script) {
		script.remove()
	}
}

/**
 * Function to inject the cloudflare turnstile script
 *
 * @param param0
 * @returns
 */
export const injectTurnstileScript = ({
	render,
	onLoadCallbackName,
	onLoad,
	scriptOptions: { nonce = '', defer = true, async = true, id = '', appendTo } = {}
}: InjectTurnstileScriptParams) => {
	const scriptId = id || DEFAULT_SCRIPT_ID

	// Script has already been injected, just call onLoad and does nothing else
	if (isScriptInjected(scriptId)) {
		onLoad()
		return
	}

	// Generate the js script
	const js = document.createElement('script')
	js.id = scriptId

	const params = {
		render: render === 'explicit' ? render : '',
		onload: render === 'explicit' ? onLoadCallbackName : ''
	}
	const searchParams = new URLSearchParams(params)
	js.src = `${SCRIPT_URL}?${searchParams}`

	if (nonce) {
		js.nonce = nonce
	}

	js.defer = !!defer
	js.async = !!async
	js.onload = onLoad

	// Append it to the body|head
	const elementToInjectScript = appendTo === 'body' ? document.body : document.getElementsByTagName('head')[0]

	elementToInjectScript!.appendChild(js)
}
