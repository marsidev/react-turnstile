import { forwardRef } from 'react'
import Options from './Options'

interface FormProps {
	onChangeTheme: (value: string) => void
	onChangeSiteKeyType: (value: string) => void
}

const ConfigForm = forwardRef<HTMLFormElement, FormProps>((props, ref) => {
	return (
		<form ref={ref} className='text-left accent-[#f4a15d]'>
			<div className='flex gap-16'>
				<Options
					name='theme'
					options={[
						{ label: 'Auto', value: 'auto' },
						{ label: 'Light', value: 'light' },
						{ label: 'Dark', value: 'dark' }
					]}
					title='Theme'
					onChange={props.onChangeTheme}
				/>

				<Options
					helperUrl='https://developers.cloudflare.com/turnstile/frequently-asked-questions/#are-there-sitekeys-and-secret-keys-that-can-be-used-for-testing'
					name='siteKey'
					options={[
						{ label: 'Always pass', value: 'pass' },
						{ label: 'Always fail', value: 'fail' },
						{ label: 'Force interactive challenge', value: 'interactive' }
					]}
					title='Demo Site Key Type'
					onChange={props.onChangeSiteKeyType}
				/>
			</div>
		</form>
	)
})

ConfigForm.displayName = 'ConfigForm'

export default ConfigForm
