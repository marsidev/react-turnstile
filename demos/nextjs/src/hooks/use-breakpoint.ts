import resolveConfig from 'tailwindcss/resolveConfig'
import { create } from '@kodingdotninja/use-tailwind-breakpoint'
import { useEffect } from 'react'
import tailwindConfig from '../../tailwind.config'

const config = resolveConfig(tailwindConfig)

type BreakpointKey = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const hooks = create(config.theme!.screens)

export function useBreakpoint(breakpoint: BreakpointKey) {
	const result = hooks.useBreakpoint(breakpoint)

	// Workaround for a bug with the use-tailwind-breakpoint library. See:
	// https://github.com/kodingdotninja/use-tailwind-breakpoint/issues/2#issuecomment-1030703188
	useEffect(() => {
		window.dispatchEvent(new Event('resize'))
	}, [])

	return result
}
