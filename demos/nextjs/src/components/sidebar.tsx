'use client'

import { SidebarCloseIcon } from 'lucide-react'
import { useAtom } from 'jotai'
import cn from 'classnames'
import Link from '~/components/sidebar-link'
import { mobileNavExpandedAtom } from '~/store'
import { pages } from '~/constants'
import { useBreakpoint } from '~/hooks/use-breakpoint'
import Footer from './footer'
import { Button } from './button'

export default function Sidebar() {
	const [mobileNavExpanded, setMobileNavExpanded] = useAtom(mobileNavExpandedAtom)
	const isLargeScreen = useBreakpoint('lg')

	const noTabbable = !isLargeScreen && !mobileNavExpanded

	return (
		<aside
			className={cn(
				'fixed right-auto top-16 bottom-0 left-0 z-20 flex w-[19.5rem] -translate-x-full flex-col justify-between overflow-y-auto border-t border-slate-200 border-opacity-80 bg-white px-6 pb-6 transition-transform dark:border-slate-800 dark:bg-dark sm:px-8 md:px-10 lg:left-[max(0px,calc(50%-46rem))] lg:translate-x-0',
				{
					'translate-x-0': mobileNavExpanded,
					'shadow-lg': mobileNavExpanded,
					border: mobileNavExpanded
				}
			)}
		>
			<div className="mt-4 lg:mt-0">
				<div className="z-40 flex flex-row justify-end opacity-75 lg:hidden">
					<Button
						aria-label="Close menu"
						size="sm"
						tabIndex={noTabbable ? -1 : 0}
						variant="ghost"
						onClick={() => setMobileNavExpanded(false)}
					>
						<SidebarCloseIcon />
					</Button>
				</div>

				<nav className="flex overscroll-contain lg:mt-9">
					<ul className="lg:text-sm lg:leading-6">
						{pages.map(page => (
							<li key={page.href}>
								<Link className="mb-3" href={page.href} tabIndex={noTabbable ? -1 : 0}>
									{page.title}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>

			<Footer />
		</aside>
	)
}
