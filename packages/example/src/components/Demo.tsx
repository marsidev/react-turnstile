import { useRef, useState } from 'react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { LangOptions } from '../constants'
import ConfigForm from './ConfigForm'
import StateLabels from './StateLabels'
import WidgetMethods from './WidgetMethods'
import TokenValidation from './TokenValidation'
import Footer from './Footer'

/** testing demo siteKeys */
enum DEMO_SITEKEY {
	pass = '1x00000000000000000000AA',
	fail = '2x00000000000000000000AB',
	interactive = '3x00000000000000000000FF'
}

type Theme = 'light' | 'dark' | 'auto'
type Size = 'normal' | 'compact'
export type WidgetStatus = 'solved' | 'error' | 'expired' | null
type SiteKeyType = keyof typeof DEMO_SITEKEY
type LangType = (typeof LangOptions)[number]['value']

const Demo = () => {
	const [theme, setTheme] = useState<Theme>('auto')
	const [size, setSize] = useState<Size>('normal')
	const [siteKeyType, setSiteKeyType] = useState<SiteKeyType>('pass')
	const [status, setStatus] = useState<WidgetStatus>(null)
	const [lang, setLang] = useState<LangType>('auto')
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
		setSize(value as Size)
		onRestartStates()
	}

	const onChangeSiteKeyType = (value: string) => {
		setSiteKeyType(value as SiteKeyType)
		onRestartStates()
	}

	const onChangeLang = (value: string) => {
		setLang(value as LangType)
		onRestartStates()
	}

	const onSuccess = (token: string) => {
		setToken(token)
		setStatus('solved')
	}

	const onExpire = () => {
		setStatus('expired')
		turnstileRef.current?.reset()
	}

	return (
		<div className='flex flex-col items-center justify-center w-full min-h-screen py-24'>
			<main className='w-full max-w-[740px] flex justify-center flex-col text-white p-4 gap-2'>
				<h1 className='font-semibold text-4xl mb-4'>React Turnstile Demo</h1>

				<Turnstile
					ref={turnstileRef}
					autoResetOnExpire={false}
					options={{
						theme,
						size,
						language: lang
					}}
					siteKey={testingSiteKey}
					onError={() => setStatus('error')}
					onExpire={onExpire}
					onSuccess={onSuccess}
				/>

				<h2 className='font-semibold text-2xl mt-8'>Configuration</h2>
				<ConfigForm
					ref={configFormRef}
					onChangeLang={onChangeLang}
					onChangeSiteKeyType={onChangeSiteKeyType}
					onChangeSize={onChangeSize}
					onChangeTheme={onChangeTheme}
				/>

				<h2 className='font-semibold text-2xl mt-8'>Challenge States</h2>
				<StateLabels status={status} />

				<h2 className='font-semibold text-2xl mt-8'>Widget Methods</h2>
				<WidgetMethods turnstile={turnstileRef} onRestartStates={onRestartStates} />

				<h2 className='font-semibold text-2xl mt-8'>Token validation (server-side)</h2>
				<TokenValidation
					challengeSolved={status === 'solved'}
					token={token}
					widgetRerenderCount={rerenderCount}
				/>
			</main>

			<Footer />
		</div>
	)
}

export default Demo
