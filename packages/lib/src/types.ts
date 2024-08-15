import * as Turnstile from './turnstile'

declare global {
	interface Window {
		turnstile?: Turnstile.Turnstile
	}
}

export * from './turnstile'

/** React Turnstile instance to use with the `useRef` hook. */
export interface TurnstileInstance extends Omit<Turnstile.Turnstile, 'ready'> {
	/**
	 * Explicitly render the Turnstile widget.
	 * @returns The rendered widget ID.
	 */
	render: Turnstile.Turnstile['render']

	/** Render a widget when `options.execution` is set to `'execute'`. This method should be called after the `.render()` method. If `options.execution` is set to `'render'` this method has no effect. */
	execute: Turnstile.Turnstile['execute']

	/** Resets the Turnstile widget. */
	reset: Turnstile.Turnstile['reset']

	/** Fully removes the Turnstile widget from the DOM. */
	remove: Turnstile.Turnstile['remove']

	/**
	 * Gets the response of a Turnstile widget.
	 * @returns The token response.
	 */
	getResponse: Turnstile.Turnstile['getResponse']

	/**
	 *  Gets the response of a Turnstile widget as a promise, it waits until the widget is rendered and solved.
	 * @param timeout - Optional. Timeout in milliseconds. Default to 30000.
	 * @param retry - Optional. Retry interval in milliseconds. Default to 250.
	 * @returns A promise that resolves with the token response.
	 */
	getResponsePromise: (
		timeout?: number,
		retry?: number
	) => Promise<ReturnType<Turnstile.Turnstile['getResponse']>>

	/** Checks whether or not the token returned by the given widget is expired. */
	isExpired: Turnstile.Turnstile['isExpired']
}

/** Render options or parameters for the `<Turnstile />` component. */
export interface ComponentRenderOptions
	extends Pick<
		Turnstile.RenderParameters,
		'action' | 'cData' | 'theme' | 'retry' | 'language' | 'execution' | 'appearance'
	> {
	/**
	 * The tabindex of Turnstile’s iframe for accessibility purposes.
	 * @default 0
	 */
	tabIndex?: Turnstile.RenderParameters['tabindex']

	/**
	 * Whether to add or not a hidden response input element with the turnstile token.
	 * @default true
	 */
	responseField?: Turnstile.RenderParameters['response-field']

	/**
	 * The name of the hidden input element added to the container where Turnstile is injected.
	 * @default "cf-turnstile-response"
	 */
	responseFieldName?: Turnstile.RenderParameters['response-field-name']

	/**
	 * Duration in milliseconds before the widget automatically retries.
	 * @default 8000
	 */
	retryInterval?: Turnstile.RenderParameters['retry-interval']

	/**
	 * The size of the Turnstile widget.
	 * Accepted values: "normal", "compact", "flexible", "invisible".
	 * Normal: 300x65px, compact: 150x140px, flexible: 100% width (min: 300px) x 65px.
	 * Invisible will show no widget and is only to be used with invisible type widgets.
	 * @default "normal"
	 */
	size?: Turnstile.WidgetSize

	/**
	 * The refresh mode to use when the given Turnstile token expires.
	 * The default is "auto". "never" will never refresh the widget, "manual" will prompt the user with a refresh button.
	 * @default "auto"
	 */
	refreshExpired?: Turnstile.RenderParameters['refresh-expired']

	/**
	 * The refresh mode to use when the widget times out.
	 * The default is "auto". "never" will never refresh the widget, "manual" will prompt the user with a refresh button.
	 * @default "auto"
	 */
	refreshTimeout?: Turnstile.RenderParameters['refresh-timeout']
}

/** Custom options for the injected script. */
export interface ScriptOptions {
	/**
	 * Custom nonce for the injected script.
	 * @default undefined
	 */
	nonce?: string

	/**
	 * Define if set the injected script as defer.
	 * @default true
	 */
	defer?: boolean

	/**
	 * Define if set the injected script as async.
	 * @default true
	 */
	async?: boolean

	/**
	 * Define if inject the script in the head or in the body.
	 * @default "head"
	 */
	appendTo?: 'head' | 'body'

	/**
	 * Custom ID of the injected script.
	 * @default "cf-turnstile-script"
	 */
	id?: string

	/**
	 * Custom name of the onload callback.
	 * @default "onloadTurnstileCallback"
	 */
	onLoadCallbackName?: string

	/** Callback invoked when script fails to load (e.g. Cloudflare has an outage). */
	onError?: () => void

	/**
	 * Custom crossOrigin for the injected script.
	 * @default undefined
	 */
	crossOrigin?: string
}

/** `<Turnstile />` component props */
export interface TurnstileProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
	/** Your Cloudflare Turnstile sitekey. This sitekey is associated with the corresponding widget configuration and is created upon the widget creation. */
	siteKey: Turnstile.RenderParameters['sitekey']

	/** Callback invoked after a successful render of the widget. The callback is passed the widget ID. It does not trigger when the widget is reset. */
	onWidgetLoad?: (widgetID: string) => void

	/**
	 * Callback that is invoked upon success of the challenge.
	 * The callback is passed a token that can be validated.
	 */
	onSuccess?: Turnstile.RenderParameters['callback']

	/** Callback that is invoked when a challenge expires. */
	onExpire?: Turnstile.RenderParameters['expired-callback']

	/**
	 * Callback invoked when there is an error (e.g. network error or the challenge failed). The callback is passed an error code.
	 * Refer to [Client-side errors](https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/).
	 */
	onError?: Turnstile.RenderParameters['error-callback']

	/** Callback that is invoked before the user is prompted for interactivity. */
	onBeforeInteractive?: Turnstile.RenderParameters['before-interactive-callback']

	/** Callback that is invoked when the interactive challenge has been solved. */
	onAfterInteractive?: Turnstile.RenderParameters['after-interactive-callback']

	/** Callback that is invoked when the browser is not supported by Turnstile. */
	onUnsupported?: Turnstile.RenderParameters['unsupported-callback']

	/**
	 * Custom widget render options. See {@link https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#configurations the docs} for more info.
	 */
	options?: ComponentRenderOptions

	/**
	 * Custom injected script options.
	 */
	scriptOptions?: ScriptOptions

	/** Define the HTML tag of the widget container. Default to `'div'`. */
	as?: React.ElementType

	/**
	 * Controls if the script is automatically injected or not. If you want to inject the script manually, set this property to `false`.
	 * @default true
	 */
	injectScript?: boolean

	/** Callback that is invoked when the script is loaded. */
	onLoadScript?: () => void
}

export interface InjectTurnstileScriptParams {
	render?: string
	onLoadCallbackName?: string
	scriptOptions?: Omit<ScriptOptions, 'onLoadCallbackName'>
}

export type ContainerSizeSet = {
	[size in NonNullable<ComponentRenderOptions['size']> | 'interactionOnly']: React.CSSProperties
}

/**
 * Some language that are supported by Cloudflare Turnstile.
 * See {@link https://developers.cloudflare.com/turnstile/reference/supported-languages/} for more info.
 */
export type TurnstileLangCode =
	| 'ar'
	| 'ar-EG'
	| 'cs'
	| 'da'
	| 'de'
	| 'el'
	| 'en'
	| 'es'
	| 'fa'
	| 'fi'
	| 'fr'
	| 'he'
	| 'hi'
	| 'hr'
	| 'hu'
	| 'id'
	| 'it'
	| 'ja'
	| 'ko'
	| 'lt'
	| 'nl'
	| 'ms'
	| 'nb'
	| 'pl'
	| 'pt'
	| 'pt-BR'
	| 'ro'
	| 'ru'
	| 'sk'
	| 'sl'
	| 'sr'
	| 'sv'
	| 'th'
	| 'tl'
	| 'tlh'
	| 'tr'
	| 'uk'
	| 'zh'
	| 'zh-CN'
	| 'zh-TW'
	// eslint-disable-next-line @typescript-eslint/ban-types
	| (string & {})

/**
 * Server-side validation response from Cloudflare Turnstile.
 * See {@link https://developers.cloudflare.com/turnstile/get-started/server-side-validation the docs} for more info.
 */
export interface TurnstileServerValidationResponse {
	/** Indicate if the token validation was successful or not. */
	success: boolean
	/** A list of errors that occurred. */
	'error-codes': TurnstileServerValidationErrorCode[]
	/** The ISO timestamp for the time the challenge was solved. */
	challenge_ts?: string
	/** The hostname for which the challenge was served. */
	hostname?: string
	/** The customer widget identifier passed to the widget on the client side. This is used to differentiate widgets using the same sitekey in analytics. Its integrity is protected by modifications from an attacker. It is recommended to validate that the action matches an expected value. */
	action?: string
	/** The customer data passed to the widget on the client side. This can be used by the customer to convey state. It is integrity protected by modifications from an attacker. */
	cdata?: string
	/** Whether or not an interactive challenge was issued by Cloudflare */
	metadata?: { interactive: boolean }
	/** Error messages returned */
	messages?: string[]
}

/**
 * Error codes returned by Cloudflare Turnstile server-side validation.
 * See {@link https://developers.cloudflare.com/turnstile/get-started/server-side-validation/#error-codes the docs} for more info.
 */
export type TurnstileServerValidationErrorCode =
	/**  The secret parameter was not passed. */
	| 'missing-input-secret'
	/**  The secret parameter was invalid or did not exist. */
	| 'invalid-input-secret'
	/**  The response parameter was not passed. */
	| 'missing-input-response'
	/**  The response parameter is invalid or has expired. */
	| 'invalid-input-response'
	/**  The widget ID extracted from the parsed site secret key was invalid or did not exist. */
	| 'invalid-widget-id'
	/**  The secret extracted from the parsed site secret key was invalid. */
	| 'invalid-parsed-secret'
	/**  The request was rejected because it was malformed. */
	| 'bad-request'
	/**  The response parameter has already been validated before. */
	| 'timeout-or-duplicate'
	/**  An internal error happened while validating the response. The request can be retried. */
	| 'internal-error'
