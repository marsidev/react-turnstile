import type { TurnstileValidationResponse } from '../types'
import { type FC, useEffect, useRef, useState } from 'react'
import Options from './Options'

interface TokenValidationProps {
	token: string | undefined
	widgetRerenderCount: number
	challengeSolved: boolean | null
}

/** testing demo secretKeys */
enum DEMO_SECRET {
	pass = '1x0000000000000000000000000000000AA',
	fail = '2x0000000000000000000000000000000AA',
	spent = '3x0000000000000000000000000000000AA'
}

type SecretKeyType = keyof typeof DEMO_SECRET

const TokenValidation: FC<TokenValidationProps> = ({
	token,
	widgetRerenderCount,
	challengeSolved
}) => {
	const [response, setResponse] = useState<TurnstileValidationResponse | null>(null)
	const [loading, setLoading] = useState(false)
	const submitFormRef = useRef<HTMLFormElement>(null)

	// reset response when widget rerenders
	useEffect(() => {
		setResponse(null)
	}, [widgetRerenderCount])

	const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!challengeSolved || !token) {
			alert('The challenge has not been solved')
			return
		}

		const formData = new FormData(submitFormRef.current!)
		const secretType = formData.get('secret') as SecretKeyType
		const secret = DEMO_SECRET[secretType]

		setLoading(true)
		setResponse(null)

		const res = await fetch('/api/verify', {
			method: 'POST',
			body: JSON.stringify({ token, secret }),
			headers: {
				'content-type': 'application/json'
			}
		})

		const data = await res.json()
		console.log({ data })

		setLoading(false)
		setResponse(data)
	}

	return (
		<div className='flex flex-col gap-2'>
			<form
				ref={submitFormRef}
				className='text-left accent-[#f4a15d] flex flex-col gap-2'
				onSubmit={onSubmitForm}
			>
				<Options
					helperUrl='https://developers.cloudflare.com/turnstile/frequently-asked-questions/#are-there-sitekeys-and-secret-keys-that-can-be-used-for-testing'
					name='secret'
					options={[
						{ label: 'Always pass', value: 'pass' },
						{ label: 'Always fail', value: 'fail' },
						{ label: '"Token already spent" error', value: 'spent' }
					]}
					title='Demo Secret Key Type'
				/>

				<button
					className='bg-[#f4a15d] hover:bg-[#e06d10] text-black px-4 py-2 rounded-lg shadow-md mt-2 max-w-fit'
					disabled={loading}
					type='submit'
				>
					Validate
				</button>
			</form>

			{loading && <span>Loading...</span>}

			{response && !loading && <pre>{JSON.stringify(response, null, 2)}</pre>}
		</div>
	)
}

export default TokenValidation
