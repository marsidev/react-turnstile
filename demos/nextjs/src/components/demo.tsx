'use client'

import { useRef, useState } from 'react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { Lang, SiteKeyType, Theme, WidgetSize, WidgetStatus } from '~/types'
import { DEMO_SITEKEY } from '~/constants'
import ConfigForm from './config-form'
import StateLabels from './state-labels'
import WidgetMethods from './widget-methods'
import TokenValidation from './token-validation'
import Footer from './footer'

export default function Demo() {
	const [theme, setTheme] = useState<Theme>('auto')
	const [size, setSize] = useState<WidgetSize>('normal')
	const [siteKeyType, setSiteKeyType] = useState<SiteKeyType>('pass')
	const [status, setStatus] = useState<WidgetStatus>(null)
	const [lang, setLang] = useState<Lang>('auto')
	const [token, setToken] = useState<string>()
	const [rerenderCount, setRerenderCount] = useState(0)

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
		<>
			<Turnstile
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

			<h2 className="mt-8 text-2xl font-semibold">Configuration</h2>
			<ConfigForm
				ref={configFormRef}
				onChangeLang={onChangeLang}
				onChangeSiteKeyType={onChangeSiteKeyType}
				onChangeSize={onChangeSize}
				onChangeTheme={onChangeTheme}
			/>

			<h2 className="mt-8 text-2xl font-semibold">Challenge States</h2>
			<StateLabels status={status} />

			<h2 className="mt-8 text-2xl font-semibold">Widget Methods</h2>
			<WidgetMethods turnstile={turnstileRef} onRestartStates={onRestartStates} />

			<h2 className="mt-8 text-2xl font-semibold">Token validation (server-side)</h2>
			<TokenValidation
				challengeSolved={status === 'solved'}
				token={token}
				widgetRerenderCount={rerenderCount}
			/>

			<Footer />
		</>
	)
}
