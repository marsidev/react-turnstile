import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import {
	CONTAINER_STYLE_SET,
	DEFAULT_CONTAINER_ID,
	DEFAULT_ONLOAD_NAME,
	getTurnstileSizeOpts,
	injectTurnstileScript
} from './utils'
import { RenderOptions, TurnstileInstance, TurnstileProps } from './types'

export const Turnstile = forwardRef<TurnstileInstance | undefined, TurnstileProps>((props, ref) => {
	const { scriptOptions, options, siteKey, onSuccess, onExpire, onError, id, style, ...divProps } =
		props
	const config = options ?? {}
	const widgetSize = config.size ?? 'normal'

	const [widgetId, setWidgetId] = useState<string | undefined | null>()
	const [containerStyle, setContainerStyle] = useState(
		config.execution === 'execute' ? CONTAINER_STYLE_SET.invisible : CONTAINER_STYLE_SET[widgetSize]
	)
	const [scriptLoaded, setScriptLoaded] = useState(false)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const firstRendered = useRef(false)

	const containerId = id ?? DEFAULT_CONTAINER_ID
	const onLoadCallbackName = scriptOptions?.onLoadCallbackName || DEFAULT_ONLOAD_NAME
	const scriptOptionsJson = JSON.stringify(scriptOptions)
	const configJson = JSON.stringify(config)

	const renderConfig: RenderOptions = {
		sitekey: siteKey,
		action: config.action,
		cData: config.cData,
		callback: onSuccess,
		'error-callback': onError,
		'expired-callback': onExpire,
		theme: config.theme ?? 'auto',
		language: config.language ?? 'auto',
		tabindex: config.tabIndex,
		'response-field': config.responseField,
		'response-field-name': config.responseFieldName,
		size: getTurnstileSizeOpts(widgetSize),
		retry: config.retry ?? 'auto',
		'retry-interval': config.retryInterval ?? 8000,
		'refresh-expired': config.refreshExpired ?? 'auto',
		execution: config.execution ?? 'render',
		appearance: config.appearance ?? 'always'
	}

	useImperativeHandle(
		ref,
		() => {
			if (typeof window === 'undefined') return

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

					if (config.execution === 'execute') {
						setContainerStyle(CONTAINER_STYLE_SET.invisible)
					}

					turnstile!.reset(widgetId)
				},

				remove() {
					if (!window.turnstile || !window.turnstile?.remove || !widgetId) {
						console.warn('Turnstile has not been loaded')
						return
					}

					setWidgetId('')
					setContainerStyle(CONTAINER_STYLE_SET.invisible)
					window.turnstile!.remove(widgetId)
				},

				render() {
					if (!window.turnstile || !window.turnstile?.render) {
						console.warn('Turnstile has not been loaded')
						return
					}

					if (!containerRef.current) {
						console.warn('The container has not been rendered yet')
						return
					}

					if (widgetId) {
						console.warn('Widget already rendered')
						return widgetId
					}

					const id = window.turnstile!.render(containerRef.current, renderConfig)
					setWidgetId(id)
					return id
				},

				execute() {
					if (config.execution !== 'execute') {
						return
					}

					if (!window.turnstile || !window.turnstile?.execute) {
						console.warn('Turnstile has not been loaded')
						return
					}

					if (!containerRef.current) {
						console.warn('The container has not been rendered yet')
						return
					}

					if (!widgetId) {
						console.warn('The widget needs to render before calling the `.execute()` method')
						return
					}

					window.turnstile!.execute(containerRef.current, renderConfig)
					setContainerStyle(CONTAINER_STYLE_SET[widgetSize])
				}
			}
		},
		[scriptLoaded, typeof window, widgetId, config.execution, widgetSize]
	)

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

		injectTurnstileScript({
			render: 'explicit',
			onLoadCallbackName,
			scriptOptions,
			onLoad: onLoadScript,
			onError: onLoadScriptError
		})
	}, [
		configJson,
		scriptOptionsJson,
		siteKey,
		renderConfig,
		onLoadCallbackName,
		scriptOptions,
		onLoadScript,
		onLoadScriptError
	])

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

	useEffect(() => {
		setContainerStyle(
			config.execution === 'execute'
				? CONTAINER_STYLE_SET.invisible
				: CONTAINER_STYLE_SET[widgetSize]
		)
	}, [widgetSize, config.execution])

	return (
		<div
			ref={containerRef}
			id={containerId}
			style={{ ...containerStyle, ...style }}
			{...divProps}
		/>
	)
})

Turnstile.displayName = 'Turnstile'

export default Turnstile
