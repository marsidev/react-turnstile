'use client'

import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '~/components/button'

export function ThemeToggle() {
	const { setTheme, theme } = useTheme()

	const onToggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

	return (
		<Button aria-label="Toggle theme" size="sm" variant="ghost" onClick={onToggleTheme}>
			<SunIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}
