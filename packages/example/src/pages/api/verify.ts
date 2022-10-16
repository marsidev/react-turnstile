import type { NextApiRequest, NextApiResponse } from 'next'
import type { TurnstileValidationResponse } from '../../types'

const endpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<TurnstileValidationResponse>
) {
	const { token, secret } = req.body

	const data = (await fetch(endpoint, {
		method: 'POST',
		body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		}
	}).then(response => response.json())) as TurnstileValidationResponse

	if (!data.success) {
		return res.status(400).json(data)
	}

	res.status(200).json(data)
}
