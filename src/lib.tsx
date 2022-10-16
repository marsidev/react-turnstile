import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { DEFAULT_CONTAINER_ID, DEFAULT_ONLOAD_NAME, injectTurnstileScript } from './utils'
import { RenderParameters, TurnstileInstance, TurnstileProps } from './types'

export const Turnstile = forwardRef<TurnstileInstance, TurnstileProps>((props, ref) => {
	const { scriptOptions, options, siteKey, onSuccess, onExpire, onError, ...divProps } = props
	const { container, ...config } = options ?? {}

	const [widgetId, setWidgetId] = useState<string | undefined | null>()
	const [scriptLoaded, setScriptLoaded] = useState(false)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const firstRendered = useRef(false)

	const containerId = typeof container === 'string' ? container : DEFAULT_CONTAINER_ID
	const onLoadCallbackName = scriptOptions?.onLoadCallbackName || DEFAULT_ONLOAD_NAME
	const scriptOptionsJson = JSON.stringify(scriptOptions)
	const configJson = JSON.stringify(config)

	useImperativeHandle(
		ref,
		() => {
			const { turnstile } = window
			return {
				getResponse() {
					if (!window.turnstile || !window.turnstile?.getResponse || !widgetId) {
						console.warn('Turnstile has not been loaded')
						return
					}

					return turnstile!.getResponse(widgetId)
				},
				reset() {
					if (!window.turnstile || !window.turnstile?.reset || !widgetId) {
						console.warn('Turnstile has not been loaded')
						return
					}

					return turnstile!.reset(widgetId)
				},
				remove() {
					if (!window.turnstile || !window.turnstile?.remove || !widgetId) {
						console.warn('Turnstile has not been loaded')
						return
					}

					window.turnstile!.remove(widgetId)
					setWidgetId('')
				},
				render() {
					if (!window.turnstile || !window.turnstile?.render) {
						console.warn('Turnstile has not been loaded')
						return
					}

					if (!containerRef.current) {
						console.warn('Container has not rendered')
						return
					}

					if (widgetId) {
						console.warn('Widget already rendered')
						return widgetId
					}

					const id = window.turnstile!.render(containerRef.current, renderConfig)
					setWidgetId(id)
					return id
				}
			}
		},
		[scriptLoaded, window.turnstile, widgetId]
	)

	const renderConfig: RenderParameters = {
		action: config.action,
		cData: config.cData,
		theme: config.theme ?? 'auto',
		sitekey: siteKey,
		tabindex: config.tabIndex,
		callback: onSuccess,
		'expired-callback': onExpire,
		'error-callback': onError
	}

	const onLoadScript = () => {
		setScriptLoaded(true)
	}

	const onLoadScriptError = () => {
		console.error('Error loading turnstile script')
	}

	/** define onload function and inject turnstile script */
	useEffect(() => {
		if (!siteKey) {
			console.warn('sitekey was not provided')
			return
		}

		// define onLoad function
		window[onLoadCallbackName] = () => {
			if (!firstRendered.current) {
				const id = window.turnstile?.render(containerRef.current!, renderConfig)
				setWidgetId(id)
				firstRendered.current = true
			}
		}

		// inject turnstile script
		injectTurnstileScript({
			render: 'explicit',
			onLoadCallbackName,
			scriptOptions,
			onLoad: onLoadScript,
			onError: onLoadScriptError
		})

		/** Once a token has been issued, it can be validated within the next 300 seconds. After 300 seconds, the token is no longer valid and another challenge needs to be solved. */
		const timerId = setInterval(() => window.turnstile?.reset(), 250 * 250)

		return () => {
			clearInterval(timerId)
		}
	}, [configJson, scriptOptionsJson, container])

	useEffect(
		function rerenderWidget() {
			if (containerRef.current && window.turnstile) {
				const { turnstile } = window
				turnstile.remove(widgetId!)
				const id = turnstile.render(containerRef.current, renderConfig)
				setWidgetId(id)
				firstRendered.current = true
			}
		},
		[configJson, siteKey]
	)

	return <div ref={containerRef} id={containerId} {...divProps} />
})

Turnstile.displayName = 'Turnstile'
export default Turnstile
