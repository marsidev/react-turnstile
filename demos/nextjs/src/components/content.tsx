'use client'

import { PropsWithChildren } from 'react'
import { useAtom } from 'jotai'
import { mobileNavExpandedAtom } from '~/store'
import { cn } from '~/utils'

export default function Content({ children }: PropsWithChildren) {
	const [mobileNavExpanded] = useAtom(mobileNavExpandedAtom)

	return (
		<div className="overflow-y-auto lg:pl-72">
			<div className="flex flex-col py-9">
				<div className="relative mx-auto contents max-w-3xl grow text-slate-500 dark:text-slate-400 xl:-ml-12 xl:max-w-188 xl:pl-12 xl:pr-1">
					<main
						className={cn(
							'prose max-w-none px-2 dark:prose-invert prose-h1:mb-4 prose-h2:mb-2 prose-h3:mb-0 prose-p:leading-loose prose-strong:wrap-break-word',
							{
								'blur-sm': mobileNavExpanded
							}
						)}
					>
						{children}
					</main>
				</div>
			</div>
		</div>
	)
}
