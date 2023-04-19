'use client'

import { PropsWithChildren } from 'react'
import cn from 'classnames'
import { useAtom } from 'jotai'
import { mobileNavExpandedAtom } from '~/store'

export default function Content({ children }: PropsWithChildren) {
	const [mobileNavExpanded] = useAtom(mobileNavExpandedAtom)

	return (
		<div className="overflow-y-auto lg:pl-[18rem]">
			<div className="flex flex-col py-9">
				<div className="relative mx-auto contents max-w-3xl flex-grow text-slate-500 dark:text-slate-400 xl:-ml-12 xl:max-w-[47rem] xl:pr-1 xl:pl-12">
					<main
						className={cn(
							'prose max-w-none px-2 dark:prose-invert prose-h1:mb-[1rem] prose-h2:mb-[0.5rem] prose-h3:mb-0 prose-p:leading-loose prose-strong:break-words',
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
