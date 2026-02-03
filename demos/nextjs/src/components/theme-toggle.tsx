'use client'

import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '~/components/button'

export function ThemeToggle() {
	const { setTheme, theme } = useTheme()

	const onToggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

	return (
		<Button aria-label="Toggle theme" size="sm" variant="ghost" onClick={onToggleTheme}>
			<SunIcon className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
			<MoonIcon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}
