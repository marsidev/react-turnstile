declare global {
	interface Window {
		turnstile?: _Turnstile
	}
}

/* Available methods in the turnstile instance. */
interface _Turnstile {
	/**
	 * Method to explicit render a widget.
	 * @param container -  Element ID or HTML node element.
	 * @param params -  Optional. Render parameter options. See {@link https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#configurations the docs} for more info about this options.
	 * @returns The rendered widget ID.
	 */
	render: (container?: string | HTMLElement, params?: RenderOptions) => string | undefined

	/**
	 * Method to render a widget when `execution` is set to `'execute'`. This method should be called after the `.render()` method. If `execution` is set to `'render'` this method has no effect.
	 * @param container -  Element ID or HTML node element.
	 * @param params -  Optional. Render parameter options. See {@link https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#configurations the docs} for more info about this options.
	 */
	execute: (container?: string | HTMLElement, params?: RenderOptions) => void

	/**
	 * Method to reset a widget.
	 * @param id -  Optional. ID of the widget to reset, if not provided will target the last rendered widget.
	 */
	reset: (id?: string) => void

	/**
	 * Method to remove a widget.
	 * @param id -  Optional. ID of the widget to remove, if not provided will target the last rendered widget.
	 */
	remove: (id?: string) => void

	/**
	 * Method to get the token of a widget.
	 * @param id -  Optional. ID of the widget to get the token from, if not provided will target the last rendered widget.
	 * @returns The token response.
	 */
	getResponse: (id?: string) => string | undefined

	/**
	 * Check if a widget is expired.
	 * @param id -  Optional. ID of the widget to check, if not provided will target the last rendered widget.
	 * @returns `true` if the widget is expired, `false` otherwise.
	 */
	isExpired: (id?: string) => boolean
}

/* Same as _Turnstile but without custom widget IDs. */
interface TurnstileInstance {
	/**
	 * Method to explicit render a widget.
	 * @returns The rendered widget ID.
	 */
	render: () => string | undefined

	/**
	 * Method to render a widget when `options.execution` is set to `'execute'`. This method should be called after the `.render()` method. If `options.execution` is set to `'render'` this method has no effect.
	 */
	execute: () => void

	/**
	 * Method to reset the current rendered widget.
	 */
	reset: () => void

	/**
	 * Method to remove the current rendered widget.
	 */
	remove: () => void

	/**
	 * Method to get the token of the current rendered widget.
	 * @returns The token response.
	 */
	getResponse: () => string | undefined

	/**
	 * Method to get the token of the current rendered widget as a promise, it waits until the widget is rendered and solved.
	 * @param timeout - Optional. Timeout in milliseconds. Default to 30000.
	 * @param retry - Optional. Retry interval in milliseconds. Default to 250.
	 * @returns The token response.
	 */
	getResponsePromise: (timeout?: number, retry?: number) => Promise<string>

	/**
	 * Check if the current rendered widget is expired.
	 * @returns `true` if the widget is expired, `false` otherwise.
	 */
	isExpired: () => boolean | undefined
}

interface RenderOptions {
	/**
	 * The sitekey of your widget. This sitekey is created upon the widget creation.
	 */
	sitekey: string

	/**
	 * A customer value that can be used to differentiate widgets under the same sitekey in analytics and which is returned upon validation. This can only contain up to 32 alphanumeric characters including _ and -.
	 * @default undefined
	 */
	action?: string

	/**
	 * A customer payload that can be used to attach customer data to the challenge throughout its issuance and which is returned upon validation. This can only contain up to 255 alphanumeric characters including _ and -.
	 * @default undefined
	 */
	cData?: string

	/**
	 * Callback invoked upon success of the challenge. The callback is passed a token that can be validated.
	 * @param token - Token response.
	 */
	callback?: (token: string) => void

	/**
	 * Callback invoked when there is an error (e.g. network error or the challenge failed). Refer to [Client-side errors](https://developers.cloudflare.com/turnstile/reference/client-side-errors).
	 */
	'error-callback'?: () => void

	/**
	 * Execution controls when to obtain the token of the widget and can be on `'render'` (default) or on `'execute'`. See {@link https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#execution-modes the docs} for more info.
	 */
	execution?: 'render' | 'execute'

	/**
	 * Callback invoked when a challenge expires and does not reset the widget.
	 */
	'expired-callback'?: () => void

	/**
	 * Callback invoked before the challenge enters interactive mode.
	 */
	'before-interactive-callback'?: () => void

	/**
	 * Callback invoked when challenge has left interactive mode.
	 */
	'after-interactive-callback'?: () => void

	/**
	 * Callback invoked when a given client/browser is not supported by Turnstile.
	 */
	'unsupported-callback'?: () => void

	/**
	 * The widget theme. This can be forced to light or dark by setting the theme accordingly.
	 *
	 * @default `auto`
	 */
	theme?: TurnstileTheme

	/**
	 * Language to display, must be either: `auto` (default) to use the language that the visitor has chosen, or an ISO 639-1 two-letter language code (e.g. `en`) or language and country code (e.g. `en-US`). Refer to the [list of supported languages](https://developers.cloudflare.com/turnstile/reference/supported-languages/) for more information.
	 * @default `auto`
	 */
	language?: 'auto' | TurnstileLangCode | (string & Record<never, never>)

	/**
	 * The tabindex of Turnstile’s iframe for accessibility purposes.
	 * @default 0
	 */
	tabindex?: number

	/**
	 * A boolean that controls if an input element with the response token is created.
	 * @default true
	 */
	'response-field'?: boolean

	/**
	 * Name of the input element.
	 * @default `cf-turnstile-response`
	 */
	'response-field-name'?: string

	/**
	 * The widget size. Can take the following values: `normal`, `compact`. The normal size is 300x65px, the compact size is 130x120px.
	 * @default `normal`
	 */
	size?: 'normal' | 'compact'

	/**
	 * Controls whether the widget should automatically retry to obtain a token if it did not succeed. The default is `'auto'`, which will retry automatically. This can be set to `'never'` to disable retry upon failure.
	 * @default `auto`
	 */
	retry?: 'auto' | 'never'

	/**
	 * When `retry` is set to `'auto'`, `retry-interval` controls the time between retry attempts in milliseconds. The value must be a positive integer less than `900000`. When `retry` is set to `'never'`, this parameter has no effect.
	 * @default 8000
	 */
	'retry-interval'?: number

	/**
	 * Automatically refreshes the token when it expires. Can take `'auto'`, `'manual'` or `'never'`.
	 * @default `auto`
	 */
	'refresh-expired'?: 'auto' | 'manual' | 'never'

	/**
	 * Appearance controls when the widget is visible. It can be `'always'` (default), `'execute'`, or `'interaction-only'`. See {@link https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#appearance-modes the docs} for more info.
	 */
	appearance?: 'always' | 'execute' | 'interaction-only'
}

/** Props needed for the `options` prop in the `<Turnstile />` component. */
interface ComponentRenderOptions
	extends Pick<
		RenderOptions,
		'action' | 'cData' | 'theme' | 'retry' | 'language' | 'execution' | 'appearance'
	> {
	/**
	 * The tabindex of Turnstile’s iframe for accessibility purposes.
	 * @default 0
	 */
	tabIndex?: RenderOptions['tabindex']

	/**
	 * A boolean that controls if an input element with the response token is created.
	 * @default true
	 */
	responseField?: RenderOptions['response-field']

	/**
	 * Name of the input element.
	 * @default `cf-turnstile-response`
	 */
	responseFieldName?: RenderOptions['response-field-name']

	/**
	 * When `retry` is set to `'auto'`, `retryInterval` controls the time between retry attempts in milliseconds. The value must be a positive integer less than `900000`. When `retry` is set to `'never'`, this parameter has no effect.
	 * @default 8000
	 */
	retryInterval?: RenderOptions['retry-interval']

	/**
	 * The widget size. Can take the following values: `normal`, `compact`, and `invisible`. The normal size is 300x65px, the compact size is 130x120px, invisible will show no widget.
	 * @default `normal`
	 */
	size?: RenderOptions['size'] | 'invisible'

	/**
	 * Automatically refreshes the token when it expires. Can take `'auto'`, `'manual'` or `'never'`.
	 * @default `auto`
	 */
	refreshExpired?: RenderOptions['refresh-expired']
}

/** Custom options for the injected script. */
interface ScriptOptions {
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
	 * @default `head`
	 */
	appendTo?: 'head' | 'body'

	/**
	 * Custom ID of the injected script.
	 * @default `cf-turnstile-script`
	 */
	id?: string

	/**
	 * Custom name of the onload callback.
	 * @default `onloadTurnstileCallback`
	 */
	onLoadCallbackName?: string

	/**
	 * Callback invoked when script fails to load (e.g. Cloudflare has an outage).
	 */
	onError?: () => void

	/**
	 * Custom crossOrigin for the injected script.
	 * @default undefined
	 */
	crossOrigin?: string
}

/** `<Turnstile />` component props */
interface TurnstileProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * The sitekey of your widget. This sitekey is created upon the widget creation.
	 */
	siteKey: RenderOptions['sitekey']

	/**
	 * Callback invoked when the widget is loaded or reloaded (e.g. after a reset).
	 */
	onWidgetLoad?: (widgetID: string) => void

	/**
	 * Callback invoked upon success of the challenge. The callback is passed a token that can be validated.
	 * @param token - Token response.
	 */
	onSuccess?: RenderOptions['callback']

	/**
	 * Callback invoked when a challenge expires and does not reset the widget.
	 */
	onExpire?: RenderOptions['expired-callback']

	/**
	 * Callback invoked when there is an error (e.g. network error or the challenge failed).
	 */
	onError?: RenderOptions['error-callback']

	/**
	 * Callback invoked before the challenge enters interactive mode.
	 */
	onBeforeInteractive?: RenderOptions['before-interactive-callback']

	/**
	 * Callback invoked when challenge has left interactive mode.
	 */
	onAfterInteractive?: RenderOptions['after-interactive-callback']

	/**
	 * Callback invoked when a given client/browser is not supported by Turnstile.
	 */
	onUnsupported?: RenderOptions['unsupported-callback']

	/**
	 * Custom widget render options. See {@link https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#configurations the docs} for more info about this options.
	 */
	options?: ComponentRenderOptions

	/**
	 * Custom injected script options.
	 */
	scriptOptions?: ScriptOptions

	/**
	 * Define the HTML tag of the widget container. Default to `'div'`.
	 */
	as?: React.ElementType

	/**
	 * Controls if the script is automatically injected or not. If you want to inject the script manually, set this property to `false`. Default to `true`.
	 */
	injectScript?: boolean

	/**
	 * Callback invoked when the script is injected and loaded.
	 */
	onLoadScript?: () => void
}

interface InjectTurnstileScriptParams {
	render?: string
	onLoadCallbackName?: string
	scriptOptions?: Omit<ScriptOptions, 'onLoadCallbackName'>
}

type ContainerSizeSet = {
	[size in NonNullable<ComponentRenderOptions['size']> | 'interactionOnly']: React.CSSProperties
}

type TurnstileLangCode =
	| 'ar'
	| 'ar-EG'
	| 'de'
	| 'en'
	| 'es'
	| 'fa'
	| 'fr'
	| 'id'
	| 'it'
	| 'ja'
	| 'ko'
	| 'nl'
	| 'pl'
	| 'pt'
	| 'pt-BR'
	| 'ru'
	| 'tlh'
	| 'tr'
	| 'uk'
	| 'uk-ua'
	| 'zh'
	| 'zh-CN'
	| 'zh-TW'

type TurnstileTheme = 'light' | 'dark' | 'auto'

interface TurnstileServerValidationResponse {
	/** Indicate if the token validation was successful or not. */
	success: boolean
	/** A list of errors that occurred. */
	'error-codes': TurnstileServerValidationErrorCode[] | []
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
 * See {@link https://developers.cloudflare.com/turnstile/get-started/server-side-validation/#error-codes the docs} for more info about this error codes.
 */
type TurnstileServerValidationErrorCode =
	/** 	The secret parameter was not passed. */
	| 'missing-input-secret'
	/** 	The secret parameter was invalid or did not exist. */
	| 'invalid-input-secret'
	/** 	The response parameter was not passed. */
	| 'missing-input-response'
	/** 	The response parameter is invalid or has expired. */
	| 'invalid-input-response'
	/** 	The widget ID extracted from the parsed site secret key was invalid or did not exist. */
	| 'invalid-widget-id'
	/** 	The secret extracted from the parsed site secret key was invalid. */
	| 'invalid-parsed-secret'
	/** 	The request was rejected because it was malformed. */
	| 'bad-request'
	/** 	The response parameter has already been validated before. */
	| 'timeout-or-duplicate'
	/** 	An internal error happened while validating the response. The request can be retried. */
	| 'internal-error'

export type {
	TurnstileInstance,
	RenderOptions,
	TurnstileProps,
	InjectTurnstileScriptParams,
	ContainerSizeSet,
	TurnstileServerValidationResponse,
	TurnstileServerValidationErrorCode,
	TurnstileTheme,
	TurnstileLangCode
}
