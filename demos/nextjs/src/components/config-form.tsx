import { forwardRef, useState } from 'react'
import Options from './options'
import { langOptions, siteKeyOptions, sizeOptions, themeOptions } from '~/constants'
import type { SiteKeyType, Theme, WidgetSize } from '~/types'

interface FormProps {
	onChangeTheme: (value: string) => void
	onChangeSiteKeyType: (value: string) => void
	onChangeSize: (value: string) => void
	onChangeLang: (value: string) => void
	initialTheme?: Theme
	initialSize?: WidgetSize
}

const ConfigForm = forwardRef<HTMLFormElement, FormProps>((props, ref) => {
	const [sizeType, setSizeType] = useState<WidgetSize>('normal')
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
		setSizeType(val as WidgetSize)
		props.onChangeSize(val)
	}

	return (
		<form ref={ref} className="text-left accent-cloudflare-400">
			<div className="flex flex-wrap gap-6">
				<Options
					name="theme"
					options={[...themeOptions]}
					title="Theme"
					value={props.initialTheme}
					onChange={props.onChangeTheme}
				/>

				<Options
					name="size"
					options={[...sizeOptions]}
					title="Size"
					value={props.initialSize}
					onChange={onChangeSizeProxy}
				/>

				<Options
					helperUrl="https://developers.cloudflare.com/turnstile/frequently-asked-questions/#are-there-sitekeys-and-secret-keys-that-can-be-used-for-testing"
					name="siteKey"
					options={siteKeyOptions.map(option => ({
						...option,
						// Option will be disabled when requesting interactive challenge on
						// invisible widget type
						disabled: option.value === 'interactive' && isInvisibleType
					}))}
					title="Demo Site Key Type"
					value={siteKeyType}
					onChange={onChangeSiteKeyTypeProxy}
				/>

				<Options
					name="lang"
					options={[...langOptions]}
					title="Language"
					onChange={props.onChangeLang}
				/>
			</div>
		</form>
	)
})

ConfigForm.displayName = 'ConfigForm'

export default ConfigForm
