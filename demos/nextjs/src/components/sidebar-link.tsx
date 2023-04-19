'use client'

import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import classNames from 'classnames'

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
	LinkProps & {
		children?: React.ReactNode
	} & React.RefAttributes<HTMLAnchorElement>

export default function NavLink({ href, children, className, ...rest }: Props) {
	const segment = useSelectedLayoutSegments()
	const active = href === `/${segment}`

	return (
		<Link
			className={classNames(
				'block rounded-sm px-1 font-semibold opacity-75 transition hover:opacity-100 focus:outline-none focus:ring-cloudflare-light-600 focus-visible:ring-2 dark:focus:ring-cloudflare-500',
				{
					'text-cloudflare-light-500 opacity-100 hover:text-cloudflare-light-600 dark:text-cloudflare-400 dark:hover:text-cloudflare-50':
						active
				},
				className
			)}
			href={href}
			{...rest}
		>
			{children}
		</Link>
	)
}
