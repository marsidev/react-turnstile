import { forwardRef, useState } from 'react'
import { LangOptions } from '../constants'
import Options from './Options'

interface FormProps {
	onChangeTheme: (value: string) => void
	onChangeSiteKeyType: (value: string) => void
	onChangeSize: (value: string) => void
	onChangeLang: (value: string) => void
}

const ThemeOptions = [
	{ label: 'Auto', value: 'auto' },
	{ label: 'Light', value: 'light' },
	{ label: 'Dark', value: 'dark' }
] as const

const SizeOptions = [
	{ label: 'Normal', value: 'normal' },
	{ label: 'Compact', value: 'compact' },
	{ label: 'Invisible', value: 'invisible' }
] as const

const SiteKeyOptions = [
	{ label: 'Always pass', value: 'pass' },
	{ label: 'Always fail', value: 'fail' },
	{ label: 'Force interactive challenge', value: 'interactive' }
] as const

type SizeType = typeof SizeOptions[number]['value']
type SiteKeyType = typeof SiteKeyOptions[number]['value']

const ConfigForm = forwardRef<HTMLFormElement, FormProps>((props, ref) => {
	const [sizeType, setSizeType] = useState<SizeType>('normal')
	const [siteKeyType, setSiteKeyType] = useState<SiteKeyType>('pass')

	const isInvisibleType = sizeType === 'invisible'

	function onChangeSiteKeyTypeProxy(val: string) {
		setSiteKeyType(val as SiteKeyType)
		props.onChangeSiteKeyType(val)
	}

	function onChangeSizeProxy(val: string) {
		if (val === 'invisible' && siteKeyType === 'interactive') {
			// Change the siteKey type to `pass` when the user choose the invisible
			// widget type. Will prevent interactive challenge being chosen on
			// invisible widget.
			onChangeSiteKeyTypeProxy('pass')
		}
		setSizeType(val as SizeType)
		props.onChangeSize(val)
	}

	return (
		<form ref={ref} className='text-left accent-[#f4a15d]'>
			<div className='flex gap-16'>
				<Options
					name='theme'
					options={[...ThemeOptions]}
					title='Theme'
					onChange={props.onChangeTheme}
				/>

				<Options name='size' options={[...SizeOptions]} title='Size' onChange={onChangeSizeProxy} />

				<Options
					helperUrl='https://developers.cloudflare.com/turnstile/frequently-asked-questions/#are-there-sitekeys-and-secret-keys-that-can-be-used-for-testing'
					name='siteKey'
					options={SiteKeyOptions.map(option => ({
						...option,
						// Option will be disabled when requesting interactive challenge on
						// invisible widget type
						disabled: option.value === 'interactive' && isInvisibleType
					}))}
					title='Demo Site Key Type'
					value={siteKeyType}
					onChange={onChangeSiteKeyTypeProxy}
				/>

				<Options
					name='lang'
					options={[...LangOptions]}
					title='Language'
					onChange={props.onChangeLang}
				/>
			</div>
		</form>
	)
})

ConfigForm.displayName = 'ConfigForm'

export default ConfigForm
