import type { TurnstileServerValidationResponse } from '@marsidev/react-turnstile'

const verifyEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

const responseHeaders = {
	'content-type': 'application/json'
}

export async function POST(request: Request) {
	const body = (await request.json()) as { token: string; secret: string }
	const { token, secret } = body

	const data = (await fetch(verifyEndpoint, {
		method: 'POST',
		body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		}
	}).then(res => res.json())) as TurnstileServerValidationResponse

	if (!data.success) {
		return new Response(JSON.stringify(data), {
			status: 400,
			headers: responseHeaders
		})
	}

	return new Response(JSON.stringify(data), {
		status: 200,
		headers: responseHeaders
	})
}
