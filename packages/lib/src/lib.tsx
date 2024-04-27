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
import { RenderOptions, TurnstileInstance, TurnstileProps } from './types'
import useObserveScript from './use-observe-script'
import {
	CONTAINER_STYLE_SET,
	DEFAULT_CONTAINER_ID,
	DEFAULT_ONLOAD_NAME,
	DEFAULT_SCRIPT_ID,
	checkElementExistence,
	getTurnstileSizeOpts,
	injectTurnstileScript
} from './utils'

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
		onLoadScript,
		id,
		style,
		as = 'div',
		injectScript = true,
		...divProps
	} = props
	const widgetSize = options.size || 'normal'

	const [containerStyle, setContainerStyle] = useState(
		options.execution === 'execute'
			? CONTAINER_STYLE_SET.invisible
			: options.appearance === 'interaction-only'
				? CONTAINER_STYLE_SET.interactionOnly
				: CONTAINER_STYLE_SET[widgetSize]
	)
	const containerRef = useRef<HTMLElement | null>(null)
	const firstRendered = useRef(false)
	const [turnstileLoaded, setTurnstileLoaded] = useState(false)
	const widgetId = useRef<string | undefined | null>()
	const widgetSolved = useRef(false)
	const containerId = id || DEFAULT_CONTAINER_ID
	const scriptId = injectScript
		? scriptOptions?.id || `${DEFAULT_SCRIPT_ID}__${containerId}`
		: scriptOptions?.id || DEFAULT_SCRIPT_ID
	const scriptLoaded = useObserveScript(scriptId)

	const onLoadCallbackName = scriptOptions?.onLoadCallbackName
		? `${scriptOptions.onLoadCallbackName}__${containerId}`
		: `${DEFAULT_ONLOAD_NAME}__${containerId}`

	const renderConfig = useMemo(
		(): RenderOptions => ({
			sitekey: siteKey,
			action: options.action,
			cData: options.cData,
			callback: token => {
				widgetSolved.current = true
				onSuccess?.(token)
			},
			'error-callback': onError,
			'expired-callback': onExpire,
			'before-interactive-callback': onBeforeInteractive,
			'after-interactive-callback': onAfterInteractive,
			'unsupported-callback': onUnsupported,
			theme: options.theme || 'auto',
			language: options.language || 'auto',
			tabindex: options.tabIndex,
			'response-field': options.responseField,
			'response-field-name': options.responseFieldName,
			size: getTurnstileSizeOpts(widgetSize),
			retry: options.retry || 'auto',
			'retry-interval': options.retryInterval || 8000,
			'refresh-expired': options.refreshExpired || 'auto',
			execution: options.execution || 'render',
			appearance: options.appearance || 'always'
		}),
		[
			siteKey,
			options,
			onSuccess,
			onError,
			onExpire,
			widgetSize,
			onBeforeInteractive,
			onAfterInteractive,
			onUnsupported
		]
	)

	const renderConfigStringified = useMemo(() => JSON.stringify(renderConfig), [renderConfig])

	const checkIfTurnstileLoaded = useCallback(() => {
		return typeof window !== 'undefined' && !!window.turnstile
	}, [])

	useImperativeHandle(
		ref,
		() => {
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
						console.warn('Turnstile has not been loaded or widget already rendered')
						return
					}

					const id = turnstile.render(containerRef.current, renderConfig)
					widgetId.current = id

					if (options.execution !== 'execute') {
						setContainerStyle(CONTAINER_STYLE_SET[widgetSize])
					}

					return id
				},

				execute() {
					if (options.execution !== 'execute') {
						return
					}

					if (
						!turnstile?.execute ||
						!containerRef.current ||
						!widgetId.current ||
						!checkIfTurnstileLoaded()
					) {
						console.warn('Turnstile has not been loaded or widget has not been rendered')
						return
					}

					turnstile.execute(containerRef.current, renderConfig)
					setContainerStyle(CONTAINER_STYLE_SET[widgetSize])
				},

				isExpired() {
					if (!turnstile?.isExpired || !widgetId.current || !checkIfTurnstileLoaded()) {
						console.warn('Turnstile has not been loaded')
						return
					}

					return turnstile.isExpired(widgetId.current)
				}
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			widgetId,
			options.execution,
			widgetSize,
			renderConfig,
			containerRef,
			checkIfTurnstileLoaded,
			turnstileLoaded
		]
	)

	useEffect(() => {
		// @ts-expect-error implicit any
		window[onLoadCallbackName] = () => setTurnstileLoaded(true)

		return () => {
			// @ts-expect-error implicit any
			delete window[onLoadCallbackName]
		}
	}, [onLoadCallbackName])

	useEffect(() => {
		if (injectScript && !turnstileLoaded) {
			injectTurnstileScript({
				onLoadCallbackName,
				scriptOptions: {
					...scriptOptions,
					id: scriptId
				}
			})
		}
	}, [injectScript, turnstileLoaded, onLoadCallbackName, scriptOptions, scriptId])

	/* Set the turnstile as loaded, in case the onload callback never runs. (e.g., when manually injecting the script without specifying the `onload` param) */
	useEffect(() => {
		if (scriptLoaded && !turnstileLoaded && window.turnstile) {
			setTurnstileLoaded(true)
		}
	}, [turnstileLoaded, scriptLoaded])

	useEffect(() => {
		if (!siteKey) {
			console.warn('sitekey was not provided')
			return
		}

		if (!scriptLoaded || !containerRef.current || !turnstileLoaded || firstRendered.current) {
			return
		}

		const id = window.turnstile!.render(containerRef.current, renderConfig)
		widgetId.current = id
		firstRendered.current = true
	}, [scriptLoaded, siteKey, renderConfig, firstRendered, turnstileLoaded])

	// re-render widget when renderConfig changes
	useEffect(() => {
		if (!window.turnstile) return

		if (containerRef.current && widgetId.current) {
			if (checkElementExistence(widgetId.current)) {
				window.turnstile.remove(widgetId.current)
			}
			const newWidgetId = window.turnstile.render(containerRef.current, renderConfig)
			widgetId.current = newWidgetId
			firstRendered.current = true
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [renderConfigStringified, siteKey])

	useEffect(() => {
		if (!window.turnstile) return
		if (!widgetId.current) return
		if (!checkElementExistence(widgetId.current)) return

		onWidgetLoad?.(widgetId.current)
	}, [widgetId, onWidgetLoad])

	useEffect(() => {
		setContainerStyle(
			options.execution === 'execute'
				? CONTAINER_STYLE_SET.invisible
				: renderConfig.appearance === 'interaction-only'
					? CONTAINER_STYLE_SET.interactionOnly
					: CONTAINER_STYLE_SET[widgetSize]
		)
	}, [options.execution, widgetSize, renderConfig.appearance])

	// onLoadScript callback
	useEffect(() => {
		if (!scriptLoaded || typeof onLoadScript !== 'function') return

		onLoadScript()
	}, [scriptLoaded, onLoadScript])

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
