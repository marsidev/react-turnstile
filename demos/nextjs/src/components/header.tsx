'use client'

import { GithubIcon, MenuIcon } from 'lucide-react'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { mobileNavExpandedAtom } from '~/store'
import { cn } from '~/utils'
import Link from './link'
import { ThemeToggle } from './theme-toggle'
import { Button, buttonVariants } from './button'

export default function Header() {
	const [mobileNavExpanded, setMobileNavExpanded] = useAtom(mobileNavExpandedAtom)

	useEffect(() => {
		const root = window.document.body

		if (mobileNavExpanded) {
			if (!root.classList.contains('overflow-hidden')) root.classList.add('overflow-hidden')
		} else {
			if (root.classList.contains('overflow-hidden')) root.classList.remove('overflow-hidden')
		}
	}, [mobileNavExpanded])

	return (
		<header className="sticky top-0 z-20 border-b border-slate-200/80 shadow-sm backdrop-blur dark:border-slate-800">
			<div className="relative z-10 mx-auto max-w-8xl">
				<div className="mx-4 flex h-16 items-center px-4 lg:mx-0 lg:px-8">
					<Link
						className="rounded-md px-2 py-1 text-gray-800 no-underline hover:text-cloudflare-light-400 focus:outline-none focus:ring-cloudflare-light-600 focus-visible:ring-4 dark:text-white dark:hover:text-cloudflare-400 dark:focus:ring-cloudflare-500"
						href="/"
					>
						<span className="text-md truncate font-bold sm:text-lg lg:text-xl">
							React Turnstile Demo
						</span>
					</Link>

					<div className="flex flex-1 shrink-0 items-center justify-end gap-2">
						<Link
							className={cn(
								buttonVariants({ variant: 'ghost', size: 'sm' }),
								'text-gray-800 hover:text-white dark:text-white dark:hover:text-white'
							)}
							href="https://github.com/marsidev/react-turnstile"
						>
							<GithubIcon />
						</Link>

						<ThemeToggle />

						<div className="flex items-center lg:hidden">
							<Button
								aria-label="Toggle menu visibility"
								size="sm"
								variant="ghost"
								onClick={() => setMobileNavExpanded(prev => !prev)}
							>
								<MenuIcon />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}
