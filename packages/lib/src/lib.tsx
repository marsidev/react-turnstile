import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState
} from 'react'
import Container from './container'
import { RenderParameters, TurnstileInstance, TurnstileProps } from './types'
import useObserveScript from './use-observe-script'
import {
	CONTAINER_STYLE_SET,
	DEFAULT_CONTAINER_ID,
	DEFAULT_ONLOAD_NAME,
	DEFAULT_SCRIPT_ID,
	getTurnstileSizeOpts,
	injectTurnstileScript
} from './utils'

let turnstileState: 'unloaded' | 'loading' | 'ready' = 'unloaded'

let turnstileLoad: {
	resolve: (value?: unknown) => void
	reject: (reason?: unknown) => void
}

const turnstileLoadPromise = new Promise((resolve, reject) => {
	turnstileLoad = { resolve, reject }
	if (turnstileState === 'ready') resolve(undefined)
})

const ensureTurnstile = (onLoadCallbackName = DEFAULT_ONLOAD_NAME) => {
	if (turnstileState === 'unloaded') {
		turnstileState = 'loading'
		// @ts-expect-error implicit any
		window[onLoadCallbackName] = () => {
			turnstileLoad.resolve()
			turnstileState = 'ready'
			// @ts-expect-error implicit any
			delete window[onLoadCallbackName]
		}
	}
	return turnstileLoadPromise
}

export const Turnstile = forwardRef<TurnstileInstance | undefined, TurnstileProps>((props, ref) => {
	const {
		scriptOptions,
		options = {},
		siteKey,
		onWidgetLoad,
		onSuccess,
		onExpire,
		onError,
		onBeforeInteractive,
		onAfterInteractive,
		onUnsupported,
		onTimeout,
		onLoadScript,
		id,
		style,
		as = 'div',
		injectScript = true,
		rerenderOnCallbackChange = false,
		...divProps
	} = props

	const widgetSize = options.size

	const calculateContainerStyle = useCallback(() => {
		return typeof widgetSize === 'undefined'
			? {}
			: options.execution === 'execute'
				? CONTAINER_STYLE_SET.invisible
				: options.appearance === 'interaction-only'
					? CONTAINER_STYLE_SET.interactionOnly
					: CONTAINER_STYLE_SET[widgetSize]
	}, [options.execution, widgetSize, options.appearance])

	const [containerStyle, setContainerStyle] = useState(calculateContainerStyle())
	const containerRef = useRef<HTMLElement | null>(null)
	const [turnstileLoaded, setTurnstileLoaded] = useState(false)
	const widgetId = useRef<string | undefined | null>()
	const widgetSolved = useRef(false)
	const containerId = id || DEFAULT_CONTAINER_ID

	// Stable callback references. Only used when rerenderOnCallbackChange is false
	const callbacksRef = useRef({
		onSuccess,
		onError,
		onExpire,
		onBeforeInteractive,
		onAfterInteractive,
		onUnsupported,
		onTimeout
	})

	// Update refs with latest callbacks when using stable callback mode
	useEffect(() => {
		if (!rerenderOnCallbackChange) {
			callbacksRef.current = {
				onSuccess,
				onError,
				onExpire,
				onBeforeInteractive,
				onAfterInteractive,
				onUnsupported,
				onTimeout
			}
		}
	})

	const scriptId = scriptOptions?.id || DEFAULT_SCRIPT_ID
	const scriptLoaded = useObserveScript(scriptId)
	const onLoadCallbackName = scriptOptions?.onLoadCallbackName || DEFAULT_ONLOAD_NAME

	const appearance = options.appearance || 'always'

	const renderConfig = useMemo(
		(): RenderParameters => ({
			sitekey: siteKey,
			action: options.action,
			cData: options.cData,
			theme: options.theme || 'auto',
			language: options.language || 'auto',
			tabindex: options.tabIndex,
			'response-field': options.responseField,
			'response-field-name': options.responseFieldName,
			size: getTurnstileSizeOpts(widgetSize),
			retry: options.retry || 'auto',
			'retry-interval': options.retryInterval || 8000,
			'refresh-expired': options.refreshExpired || 'auto',
			'refresh-timeout': options.refreshTimeout || 'auto',
			execution: options.execution || 'render',
			appearance: options.appearance || 'always',
			'feedback-enabled': options.feedbackEnabled || true,
			callback: token => {
				widgetSolved.current = true
				if (rerenderOnCallbackChange) {
					onSuccess?.(token)
				} else {
					callbacksRef.current.onSuccess?.(token)
				}
			},
			'error-callback': rerenderOnCallbackChange
				? onError
				: (...args) => callbacksRef.current.onError?.(...args),
			'expired-callback': rerenderOnCallbackChange
				? onExpire
				: (...args) => callbacksRef.current.onExpire?.(...args),
			'before-interactive-callback': rerenderOnCallbackChange
				? onBeforeInteractive
				: (...args) => callbacksRef.current.onBeforeInteractive?.(...args),
			'after-interactive-callback': rerenderOnCallbackChange
				? onAfterInteractive
				: (...args) => callbacksRef.current.onAfterInteractive?.(...args),
			'unsupported-callback': rerenderOnCallbackChange
				? onUnsupported
				: (...args) => callbacksRef.current.onUnsupported?.(...args),
			'timeout-callback': rerenderOnCallbackChange
				? onTimeout
				: (...args) => callbacksRef.current.onTimeout?.(...args)
		}),
		[
			options.action,
			options.appearance,
			options.cData,
			options.execution,
			options.language,
			options.refreshExpired,
			options.responseField,
			options.responseFieldName,
			options.retry,
			options.retryInterval,
			options.tabIndex,
			options.theme,
			options.feedbackEnabled,
			options.refreshTimeout,
			siteKey,
			widgetSize,
			rerenderOnCallbackChange,
			// Using either callbacks or null to keep the array length fixed
			rerenderOnCallbackChange ? onSuccess : null,
			rerenderOnCallbackChange ? onError : null,
			rerenderOnCallbackChange ? onExpire : null,
			rerenderOnCallbackChange ? onBeforeInteractive : null,
			rerenderOnCallbackChange ? onAfterInteractive : null,
			rerenderOnCallbackChange ? onUnsupported : null,
			rerenderOnCallbackChange ? onTimeout : null
		]
	)

	const checkIfTurnstileLoaded = useCallback(() => {
		return typeof window !== 'undefined' && !!window.turnstile
	}, [])

	useEffect(
		function inject() {
			if (injectScript && !turnstileLoaded) {
				injectTurnstileScript({
					onLoadCallbackName,
					scriptOptions: {
						...scriptOptions,
						id: scriptId
					}
				})
			}
		},
		[injectScript, turnstileLoaded, scriptOptions, scriptId]
	)

	useEffect(function waitForTurnstile() {
		if (turnstileState !== 'ready') {
			ensureTurnstile(onLoadCallbackName)
				.then(() => setTurnstileLoaded(true))
				.catch(console.error)
		}
	}, [])

	useEffect(
		function renderWidget() {
			if (!containerRef.current) return
			if (!turnstileLoaded) return
			let cancelled = false

			const render = async () => {
				if (cancelled || !containerRef.current) return
				const id = window.turnstile!.render(containerRef.current, renderConfig)
				widgetId.current = id
				if (widgetId.current) onWidgetLoad?.(widgetId.current)
			}

			render()

			return () => {
				cancelled = true
				if (widgetId.current) {
					window.turnstile!.remove(widgetId.current)
					widgetSolved.current = false
				}
			}
		},
		[containerId, turnstileLoaded, renderConfig]
	)

	useImperativeHandle(ref, () => {
		const { turnstile } = window
		return {
			getResponse() {
				if (!turnstile?.getResponse || !widgetId.current || !checkIfTurnstileLoaded()) {
					console.warn('Turnstile has not been loaded')
					return
				}

				return turnstile.getResponse(widgetId.current)
			},

			async getResponsePromise(timeout = 30000, retry = 100) {
				return new Promise((resolve, reject) => {
					let timeoutId: ReturnType<typeof setTimeout> | undefined

					const checkLoaded = async () => {
						if (widgetSolved.current && window.turnstile && widgetId.current) {
							try {
								const token = window.turnstile.getResponse(widgetId.current)
								if (timeoutId) clearTimeout(timeoutId)

								if (token) {
									return resolve(token)
								}

								return reject(new Error('No response received'))
							} catch (error) {
								if (timeoutId) clearTimeout(timeoutId)
								console.warn('Failed to get response', error)
								return reject(new Error('Failed to get response'))
							}
						}

						if (!timeoutId) {
							timeoutId = setTimeout(() => {
								if (timeoutId) clearTimeout(timeoutId)
								reject(new Error('Timeout'))
							}, timeout)
						}

						await new Promise(resolve => setTimeout(resolve, retry))
						await checkLoaded()
					}

					checkLoaded()
				})
			},

			reset() {
				if (!turnstile?.reset || !widgetId.current || !checkIfTurnstileLoaded()) {
					console.warn('Turnstile has not been loaded')
					return
				}

				if (options.execution === 'execute') {
					setContainerStyle(CONTAINER_STYLE_SET.invisible)
				}

				try {
					widgetSolved.current = false
					turnstile.reset(widgetId.current)
				} catch (error) {
					console.warn(`Failed to reset Turnstile widget ${widgetId}`, error)
				}
			},

			remove() {
				if (!turnstile?.remove || !widgetId.current || !checkIfTurnstileLoaded()) {
					console.warn('Turnstile has not been loaded')
					return
				}

				setContainerStyle(CONTAINER_STYLE_SET.invisible)
				widgetSolved.current = false
				turnstile.remove(widgetId.current)
				widgetId.current = null
			},

			render() {
				if (
					!turnstile?.render ||
					!containerRef.current ||
					!checkIfTurnstileLoaded() ||
					widgetId.current
				) {
					console.warn('Turnstile has not been loaded or container not found')
					return undefined
				}

				const id = turnstile.render(containerRef.current, renderConfig)
				widgetId.current = id
				if (widgetId.current) onWidgetLoad?.(widgetId.current)

				if (options.execution !== 'execute') {
					setContainerStyle(widgetSize ? CONTAINER_STYLE_SET[widgetSize] : {})
				}

				return id
			},

			execute() {
				if (options.execution !== 'execute') {
					console.warn('Execution mode is not set to "execute"')
					return
				}

				if (
					!turnstile?.execute ||
					!containerRef.current ||
					!widgetId.current ||
					!checkIfTurnstileLoaded()
				) {
					console.warn('Turnstile has not been loaded or container not found')
					return
				}

				turnstile.execute(containerRef.current, renderConfig)
				setContainerStyle(widgetSize ? CONTAINER_STYLE_SET[widgetSize] : {})
			},

			isExpired() {
				if (!turnstile?.isExpired || !widgetId.current || !checkIfTurnstileLoaded()) {
					console.warn('Turnstile has not been loaded')
					return false
				}

				return turnstile.isExpired(widgetId.current)
			}
		}
	}, [
		widgetId,
		options.execution,
		widgetSize,
		renderConfig,
		containerRef,
		checkIfTurnstileLoaded,
		turnstileLoaded,
		onWidgetLoad
	])

	/* Set the turnstile as loaded, in case the onload callback never runs. (e.g., when manually injecting the script without specifying the `onload` param) */
	useEffect(() => {
		if (scriptLoaded && !turnstileLoaded && window.turnstile) {
			setTurnstileLoaded(true)
		}
	}, [turnstileLoaded, scriptLoaded])

	// Update style
	useEffect(() => {
		setContainerStyle(calculateContainerStyle())
	}, [options.execution, widgetSize, appearance])

	// onLoadScript callback
	useEffect(() => {
		if (!scriptLoaded || typeof onLoadScript !== 'function') return
		onLoadScript()
	}, [scriptLoaded])

	return (
		<Container
			ref={containerRef}
			as={as}
			id={containerId}
			style={{ ...containerStyle, ...style }}
			{...divProps}
		/>
	)
})

Turnstile.displayName = 'Turnstile'

export default Turnstile
