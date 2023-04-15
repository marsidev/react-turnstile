import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import {
	CONTAINER_STYLE_SET,
	DEFAULT_CONTAINER_ID,
	DEFAULT_ONLOAD_NAME,
	DEFAULT_SCRIPT_ID,
	getTurnstileSizeOpts,
	injectTurnstileScript
} from './utils'
import { RenderOptions, TurnstileInstance, TurnstileProps } from './types'
import Container from './container'
import useObserveScript from './use-observe-script'

export const Turnstile = forwardRef<TurnstileInstance | undefined, TurnstileProps>((props, ref) => {
	const {
		scriptOptions,
		options,
		siteKey,
		onSuccess,
		onExpire,
		onError,
		id,
		style,
		as = 'div',
		injectScript = true,
		...divProps
	} = props
	const config = useMemo(() => options ?? {}, [options])
	const widgetSize = config.size ?? 'normal'
	const containerId = id ?? DEFAULT_CONTAINER_ID

	const [widgetId, setWidgetId] = useState<string | undefined | null>()
	const [containerStyle, setContainerStyle] = useState(
		config.execution === 'execute' ? CONTAINER_STYLE_SET.invisible : CONTAINER_STYLE_SET[widgetSize]
	)
	const containerRef = useRef<HTMLElement | null>(null)
	const firstRendered = useRef(false)

	const onLoadCallbackName = scriptOptions?.onLoadCallbackName || DEFAULT_ONLOAD_NAME
	const scriptId = scriptOptions?.id || DEFAULT_SCRIPT_ID
	const scriptLoaded = useObserveScript(scriptId)

	const renderConfig: RenderOptions = useMemo(
		() => ({
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
		}),
		[siteKey, config, onSuccess, onError, onExpire, widgetSize]
	)

	const renderConfigStringified = useMemo(() => JSON.stringify(renderConfig), [renderConfig])

	useImperativeHandle(
		ref,
		() => {
			if (typeof window === 'undefined') return
			if (!scriptLoaded) return

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

					if (config.execution !== 'execute') {
						setContainerStyle(CONTAINER_STYLE_SET[widgetSize])
					}

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
		[scriptLoaded, widgetId, config.execution, widgetSize, renderConfig]
	)

	/** define onload function and inject turnstile script */
	useEffect(() => {
		if (!siteKey) {
			console.warn('sitekey was not provided')
			return
		}

		// define onLoad function
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(window as any)[onLoadCallbackName] = () => {
			if (!firstRendered.current) {
				const id = window.turnstile?.render(containerRef.current!, renderConfig)
				setWidgetId(id)
				firstRendered.current = true
			}
		}

		if (injectScript) {
			injectTurnstileScript({
				render: 'explicit',
				onLoadCallbackName,
				scriptOptions
			})
		}
	}, [siteKey, renderConfig, onLoadCallbackName, scriptOptions, injectScript])

	useEffect(
		function rerenderWidget() {
			if (containerRef.current && window.turnstile) {
				window.turnstile.remove(widgetId!)
				const newWidgetId = window.turnstile.render(containerRef.current, renderConfig)
				setWidgetId(newWidgetId)
				firstRendered.current = true
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[renderConfigStringified, siteKey]
	)

	useEffect(() => {
		setContainerStyle(
			config.execution === 'execute'
				? CONTAINER_STYLE_SET.invisible
				: CONTAINER_STYLE_SET[widgetSize]
		)
	}, [widgetSize, config.execution])

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
