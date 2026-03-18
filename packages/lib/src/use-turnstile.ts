"use client"

import { useState } from "react";

type Props = {
	action: (widgetToken: string) => Promise<{ success: boolean }>;
	tries?: number;
}

export function useTurnstile({ tries = 5, action }: Props) {
	const [allowedTriesWithoutCaptcha, setAllowedTriesWithoutCaptcha] = useState(0)
	const [serverValidationError, setServerValidationError] = useState<string | null>(null)

	async function turnstileAction(widgetToken: string): Promise<string> {
		let error = ""

		try {
			if (allowedTriesWithoutCaptcha === 0) {
				const result = await action(widgetToken)
				if (result.success) {
					setAllowedTriesWithoutCaptcha(tries)
					setServerValidationError(null)
				} else {
					error = "Captcha validation failed"
					setServerValidationError(error)
				}
			} else {
				setAllowedTriesWithoutCaptcha(prev => prev - 1)
			}
		} catch (err) {
			error = "Internal server error"
			setServerValidationError(error)
		}

		return error
	}

	return { turnstileAction, serverValidationError }
}
