'use client'

import type { TurnstileInstance, TurnstileProps } from '@marsidev/react-turnstile'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { useTheme } from 'next-themes'
import ConfigForm from './config-form'
import StateLabels from './state-labels'
import WidgetMethods from './widget-methods'
import TokenValidation from './token-validation'
import { DEMO_SITEKEY } from '~/constants'
import type { Lang, SiteKeyType, Theme, WidgetSize, WidgetStatus } from '~/types'

interface Props extends Omit<TurnstileProps, 'siteKey'> {
	initialTheme?: Theme
	initialSize?: WidgetSize
	initialLang?: Lang
	initialSiteKeyType?: SiteKeyType
}

export default function DemoWidget({
	initialTheme,
	initialSize,
	initialLang,
	initialSiteKeyType,
	...props
}: Props) {
	const siteTheme = useTheme().resolvedTheme as Theme | undefined
	// const { resolvedTheme: siteTheme } = useTheme()
	const [theme, setTheme] = useState<Theme | undefined>(initialTheme ?? siteTheme)
	const [size, setSize] = useState<WidgetSize>(initialSize ?? 'normal')
	const [siteKeyType, setSiteKeyType] = useState<SiteKeyType>(initialSiteKeyType ?? 'pass')
	const [lang, setLang] = useState<Lang>(initialLang ?? 'auto')
	const [status, setStatus] = useState<WidgetStatus>(null)
	const [token, setToken] = useState<string>()
	const [rerenderCount, setRerenderCount] = useState(0)

	useEffect(() => {
		if (siteTheme && !theme) {
			setTheme(siteTheme as Theme)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteTheme])

	const configFormRef = useRef<HTMLFormElement>(null)
	const turnstileRef = useRef<TurnstileInstance>(null)
	const testingSiteKey = DEMO_SITEKEY[siteKeyType]

	const incrementRerender = () => setRerenderCount(prev => prev + 1)

	const onRestartStates = () => {
		setStatus(null)
		incrementRerender()
	}

	const onChangeTheme = (value: string) => {
		setTheme(value as Theme)
		onRestartStates()
	}

	const onChangeSize = (value: string) => {
		setSize(value as WidgetSize)
		onRestartStates()
	}

	const onChangeSiteKeyType = (value: string) => {
		setSiteKeyType(value as SiteKeyType)
		onRestartStates()
	}

	const onChangeLang = (value: string) => {
		setLang(value as Lang)
		onRestartStates()
	}

	return (
		<Fragment>
			<Turnstile
				{...props}
				ref={turnstileRef}
				options={{ theme, size, language: lang }}
				siteKey={testingSiteKey}
				onError={() => setStatus('error')}
				onExpire={() => setStatus('expired')}
				onSuccess={token => {
					setToken(token)
					setStatus('solved')
				}}
			/>

			<h3>Configuration</h3>
			<ConfigForm
				ref={configFormRef}
				initialSize={size}
				initialTheme={theme}
				onChangeLang={onChangeLang}
				onChangeSiteKeyType={onChangeSiteKeyType}
				onChangeSize={onChangeSize}
				onChangeTheme={onChangeTheme}
			/>

			<h3>Challenge States</h3>
			<StateLabels status={status} />

			<h3>Widget Methods</h3>
			<WidgetMethods turnstile={turnstileRef} onRestartStates={onRestartStates} />

			<h3>Token validation (server-side)</h3>
			<TokenValidation
				challengeSolved={status === 'solved'}
				token={token}
				widgetRerenderCount={rerenderCount}
			/>
		</Fragment>
	)
}
