import type { TurnstileServerValidationResponse } from '@marsidev/react-turnstile'
import { type FC, useEffect, useRef, useState } from 'react'
import type { SecretKeyType } from '~/types'
import { DEMO_SECRET, secretOptions } from '~/constants'
import Options from './options'
import { Button } from './button'

interface TokenValidationProps {
	token: string | undefined
	widgetRerenderCount: number
	challengeSolved: boolean | null
}

const TokenValidation: FC<TokenValidationProps> = ({
	token,
	widgetRerenderCount,
	challengeSolved
}) => {
	const [response, setResponse] = useState<TurnstileServerValidationResponse | null>(null)
	const [loading, setLoading] = useState(false)
	const submitFormRef = useRef<HTMLFormElement>(null)

	// reset response when widget  rerenders
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
		<div className="flex flex-col gap-2">
			<form
				ref={submitFormRef}
				className="flex flex-col gap-2 text-left accent-cloudflare-400"
				onSubmit={onSubmitForm}
			>
				<Options
					helperUrl="https://developers.cloudflare.com/turnstile/frequently-asked-questions/#are-there-sitekeys-and-secret-keys-that-can-be-used-for-testing"
					name="secret"
					options={[...secretOptions]}
					title="Demo Secret Key Type"
				/>

				<Button className="max-w-fit" disabled={loading} type="submit">
					Validate
				</Button>
			</form>

			{loading && <span>Loading...</span>}

			{response && !loading && <pre>{JSON.stringify(response, null, 2)}</pre>}
		</div>
	)
}

export default TokenValidation
