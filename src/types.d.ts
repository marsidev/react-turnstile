/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
	interface Window extends OnLoadFn {
		turnstile?: _Turnstile
	}
}

interface OnLoadFn {
	[key: string]: () => void
}

/** Available methods in the turnstile instance. */
interface _Turnstile {
	/**
	 * Method to explicit render a widget.
	 * @param container -  Element ID or HTML node element.
	 * @param params -  Optional. Render parameter options. See {@link https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#configurations the docs} for more info about this options.
	 * @returns The rendered widget ID.
	 */
	render: (container?: string | HTMLElement, params?: RenderParameters) => string | undefined
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
}

/** Same as _Turnstile but without custom widget IDs. */
interface TurnstileInstance {
	/**
	 * Method to explicit render a widget.
	 * @returns The rendered widget ID.
	 */
	render: () => string | undefined
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
}

/** Common options for the `.render()` function and the `options` prop in the `<Turnstile />` component */
interface CommonRenderOptions {
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
	 * The widget theme. This can be forced to light or dark by setting the theme accordingly.
	 *
	 * @default `auto`
	 */
	theme?: 'light' | 'dark' | 'auto'
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
}

/** Props needed for the `options` prop in the `<Turnstile />` component */
interface ComponentRenderOptions extends CommonRenderOptions {
	/**
	 * The tabindex of Turnstile’s iframe for accessibility purposes.
	 * @default 0
	 */
	tabIndex?: number
	/**
	 * A boolean that controls if an input element with the response token is created.
	 * @default true
	 */
	responseField?: boolean
	/**
	 * Name of the input element.
	 * @default `cf-turnstile-response`
	 */
	responseFieldName?: string
	/**
	 * When `retry` is set to `'auto'`, `retryInterval` controls the time between retry attempts in milliseconds. The value must be a positive integer less than `900000`. When `retry` is set to `'never'`, this parameter has no effect.
	 * @default 8000
	 */
	retryInterval?: number
}

/** Props needed for the `.render()` function */
interface RenderParameters extends CommonRenderOptions {
	/**
	 * Every widget has a sitekey. This sitekey is associated with the corresponding widget configuration and is created upon the widget creation.
	 */
	sitekey: string
	/**
	 * The tabindex of Turnstile’s iframe for accessibility purposes.
	 * @default 0
	 */
	tabindex?: number
	/**
	 * JavaScript callback that is invoked upon success of the challenge. The callback is passed a token that can be validated.
	 * @param token - Token response.
	 */
	callback?: (token: string) => void
	/**
	 * JavaScript callback that is invoked when a challenge expires.
	 */
	'expired-callback'?: () => void
	/**
	 * JavaScript callback that is invoked when there is a network error.
	 */
	'error-callback'?: () => void
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
	 * When `retry` is set to `'auto'`, `retry-interval` controls the time between retry attempts in milliseconds. The value must be a positive integer less than `900000`. When `retry` is set to `'never'`, this parameter has no effect.
	 * @default 8000
	 */
	'retry-interval'?: number
}

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
}

/** `<Turnstile />` component props */
interface TurnstileProps extends React.HTMLAttributes<HTMLDivElement> {
	// instance: React.RefObject<TurnstileInstance>
	/**
	 * Every widget has a sitekey. This sitekey is associated with the corresponding widget configuration and is created upon the widget creation.
	 */
	siteKey: string
	/**
	 * Callback that is invoked upon success of the challenge. The callback is passed a token that can be validated.
	 * @param token - Token response.
	 */
	onSuccess?: (token: string) => void
	/**
	 * Callback that is invoked when a challenge expires.
	 */
	onExpire?: () => void
	/**
	 * Callback that is invoked when there is a network error.
	 */
	onError?: () => void
	/**
	 * Custom widget render options. See {@link https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#configurations the docs} for more info about this options.
	 */
	options?: ComponentRenderOptions
	/**
	 * Custom injected script options.
	 */
	scriptOptions?: ScriptOptions
	/**
	 * Controls whether the widget should automatically reset when it expires.
	 * @default true
	 */
	autoResetOnExpire?: boolean
}

interface InjectTurnstileScriptParams {
	render: string
	onLoadCallbackName: string
	onLoad: () => void
	onError: () => void
	scriptOptions?: Omit<ScriptOptions, 'onLoadCallbackName'>
}

export type { TurnstileInstance, RenderParameters, TurnstileProps, InjectTurnstileScriptParams }
