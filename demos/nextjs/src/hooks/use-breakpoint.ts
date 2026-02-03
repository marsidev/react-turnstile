'use client'

import { useEffect, useState } from 'react'

const breakpoints = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	'2xl': 1536
} as const

type BreakpointKey = keyof typeof breakpoints

/**
 * Returns true if the viewport width is at or above the given breakpoint.
 */
export function useBreakpoint(breakpoint: BreakpointKey) {
	const [matches, setMatches] = useState(false)

	useEffect(() => {
		const query = `(min-width: ${breakpoints[breakpoint]}px)`
		const media = window.matchMedia(query)

		const updateMatch = () => setMatches(media.matches)
		updateMatch()

		media.addEventListener('change', updateMatch)
		return () => media.removeEventListener('change', updateMatch)
	}, [breakpoint])

	return matches
}
