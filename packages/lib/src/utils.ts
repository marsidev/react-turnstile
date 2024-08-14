import { ContainerSizeSet, InjectTurnstileScriptParams } from './types'

export const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
export const DEFAULT_SCRIPT_ID = 'cf-turnstile-script'
export const DEFAULT_CONTAINER_ID = 'cf-turnstile'
export const DEFAULT_ONLOAD_NAME = 'onloadTurnstileCallback'

/**
 * Function to check if an element with the given id exists in the document.
 *
 * @param id Id of the element to check.
 * @returns
 */
export const checkElementExistence = (id: string) => !!document.getElementById(id)

/**
 * Function to inject the cloudflare turnstile script
 *
 * @param param0
 * @returns
 */
export const injectTurnstileScript = ({
	render = 'explicit',
	onLoadCallbackName = DEFAULT_ONLOAD_NAME,
	scriptOptions: {
		nonce = '',
		defer = true,
		async = true,
		id = '',
		appendTo,
		onError,
		crossOrigin = ''
	} = {}
}: InjectTurnstileScriptParams) => {
	const scriptId = id || DEFAULT_SCRIPT_ID

	if (checkElementExistence(scriptId)) {
		return
	}

	const script = document.createElement('script')
	script.id = scriptId

	script.src = `${SCRIPT_URL}?onload=${onLoadCallbackName}&render=${render}`

	// Prevent duplicate script injection with the same src
	if (document.querySelector(`script[src="${script.src}"]`)) {
		return
	}

	script.defer = !!defer
	script.async = !!async

	if (nonce) {
		script.nonce = nonce
	}

	if (crossOrigin) {
		script.crossOrigin = crossOrigin
	}

	if (onError) {
		script.onerror = onError
		// @ts-expect-error implicit any
		delete window[onLoadCallbackName]
	}

	const parentEl = appendTo === 'body' ? document.body : document.getElementsByTagName('head')[0]

	parentEl!.appendChild(script)
}

/**
 * A list of possible sizes for the container to reserve a place for the widget
 * to load.
 *
 * A note for `invisible` size: The option added for the Invisible type of
 * Turnstile. Invisible Turnstile will not show any of the widget, hence there
 * is no height and width set to the style. This is only consumed in this
 * library, and will not be forwarded to Turnstile. See
 * {@link https://github.com/marsidev/react-turnstile/issues/7 marsidev/react-turnstile#7}
 * to learn more.
 *
 * @link https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#widget-size
 *
 * @link https://developers.cloudflare.com/turnstile/reference/widget-types/#invisible
 */
export const CONTAINER_STYLE_SET: ContainerSizeSet = {
	normal: {
		width: 300,
		height: 65
	},
	compact: {
		width: 130,
		height: 120
	},
	invisible: {
		width: 0,
		height: 0,
		overflow: 'hidden'
	},
	interactionOnly: {
		width: 'fit-content',
		height: 'auto',
		display: 'flex'
	}
}

/**
 * Convert the size from component props, and filter it for Turnstile parameters
 * while keeping the types.
 *
 * @param size Size from props.
 * @returns
 */
export function getTurnstileSizeOpts(size: keyof ContainerSizeSet | undefined) {
	if (size !== 'invisible' && size !== 'interactionOnly') {
		return size
	}

	return undefined
}
