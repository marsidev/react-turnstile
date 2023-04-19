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
		options = {},
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
	const widgetSize = options.size ?? 'normal'
	const [containerStyle, setContainerStyle] = useState(
		options.execution === 'execute'
			? CONTAINER_STYLE_SET.invisible
			: CONTAINER_STYLE_SET[widgetSize]
	)
	const containerRef = useRef<HTMLElement | null>(null)
	const firstRendered = useRef(false)
	const [widgetId, setWidgetId] = useState<string | undefined | null>()
	const [turnstileLoaded, setTurnstileLoaded] = useState(false)
	const scriptId = scriptOptions?.id || DEFAULT_SCRIPT_ID
	const scriptLoaded = useObserveScript(scriptId)
	const containerId = id ?? DEFAULT_CONTAINER_ID

	const onLoadCallbackName = `${
		scriptOptions?.onLoadCallbackName || DEFAULT_ONLOAD_NAME
	}#${containerId}`

	const renderConfig = useMemo(
		(): RenderOptions => ({
			sitekey: siteKey,
			action: options.action,
			cData: options.cData,
			callback: onSuccess,
			'error-callback': onError,
			'expired-callback': onExpire,
			theme: options.theme ?? 'auto',
			language: options.language ?? 'auto',
			tabindex: options.tabIndex,
			'response-field': options.responseField,
			'response-field-name': options.responseFieldName,
			size: getTurnstileSizeOpts(widgetSize),
			retry: options.retry ?? 'auto',
			'retry-interval': options.retryInterval ?? 8000,
			'refresh-expired': options.refreshExpired ?? 'auto',
			execution: options.execution ?? 'render',
			appearance: options.appearance ?? 'always'
		}),
		[siteKey, options, onSuccess, onError, onExpire, widgetSize]
	)

	const renderConfigStringified = useMemo(() => JSON.stringify(renderConfig), [renderConfig])

	useImperativeHandle(
		ref,
		() => {
			if (typeof window === 'undefined' || !scriptLoaded || !widgetId) {
				return
			}

			const { turnstile } = window
			return {
				getResponse() {
					if (!turnstile?.getResponse) {
						console.warn('Turnstile has not been loaded')
						return
					}

					return turnstile.getResponse(widgetId)
				},

				reset() {
					if (!turnstile?.reset) {
						console.warn('Turnstile has not been loaded')
						return
					}

					if (options.execution === 'execute') {
						setContainerStyle(CONTAINER_STYLE_SET.invisible)
					}

					turnstile.reset(widgetId)
				},

				remove() {
					if (!turnstile?.remove) {
						console.warn('Turnstile has not been loaded')
						return
					}

					setWidgetId('')
					setContainerStyle(CONTAINER_STYLE_SET.invisible)
					turnstile.remove(widgetId)
				},

				render() {
					if (!turnstile?.render || !containerRef.current || widgetId) {
						console.warn('Turnstile has not been loaded or widget already rendered')
						return
					}

					const id = turnstile.render(containerRef.current, renderConfig)
					setWidgetId(id)

					if (options.execution !== 'execute') {
						setContainerStyle(CONTAINER_STYLE_SET[widgetSize])
					}

					return id
				},

				execute() {
					if (options.execution !== 'execute') {
						return
					}

					if (!turnstile?.execute || !containerRef.current || !widgetId) {
						console.warn('Turnstile has not been loaded or widget has not been rendered')
						return
					}

					turnstile.execute(containerRef.current, renderConfig)
					setContainerStyle(CONTAINER_STYLE_SET[widgetSize])
				}
			}
		},
		[scriptLoaded, widgetId, options.execution, widgetSize, renderConfig, containerRef]
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
			injectTurnstileScript({ onLoadCallbackName, scriptOptions })
		}
	}, [injectScript, turnstileLoaded, onLoadCallbackName, scriptOptions])

	/* if the script is injected by the user, we need to wait for turnstile to be loaded
	and set turnstileLoaded to true. Different from the case when handle the injection,
	where we set turnstileLoaded in the script.onload callback */
	useEffect(() => {
		if (!injectScript && scriptLoaded && !turnstileLoaded && window.turnstile) {
			setTurnstileLoaded(true)
		}
	}, [injectScript, turnstileLoaded, scriptLoaded])

	useEffect(() => {
		if (!siteKey) {
			console.warn('sitekey was not provided')
			return
		}

		if (!scriptLoaded || !containerRef.current || !turnstileLoaded || firstRendered.current) {
			return
		}

		const id = window.turnstile!.render(containerRef.current, renderConfig)
		setWidgetId(id)
		firstRendered.current = true
	}, [scriptLoaded, siteKey, renderConfig, firstRendered, turnstileLoaded])

	// re-render widget when renderConfig changes
	useEffect(() => {
		if (containerRef.current && widgetId) {
			window.turnstile!.remove(widgetId)
			const newWidgetId = window.turnstile!.render(containerRef.current, renderConfig)
			setWidgetId(newWidgetId)
			firstRendered.current = true
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [renderConfigStringified, siteKey])

	useEffect(() => {
		setContainerStyle(
			options.execution === 'execute'
				? CONTAINER_STYLE_SET.invisible
				: CONTAINER_STYLE_SET[widgetSize]
		)
	}, [options.execution, widgetSize])

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
