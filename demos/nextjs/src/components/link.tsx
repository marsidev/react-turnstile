import type { LinkProps } from 'next/link'
import NextLink from 'next/link'
import { cn } from '~/utils'

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
	LinkProps & {
		children?: React.ReactNode
	} & React.RefAttributes<HTMLAnchorElement>

const Link: React.FC<Props> = ({ href, children, className, ...rest }) => {
	return (
		<NextLink
			className={cn(
				'text-cloudflare-light-500 hover:text-cloudflare-light-600 focus:ring-cloudflare-light-600 dark:text-cloudflare-400 dark:hover:text-cloudflare-500 dark:focus:ring-cloudflare-500 rounded-sm px-1 underline focus:outline-none focus-visible:ring-2',
				className
			)}
			href={href}
			rel="noreferrer"
			target="_blank"
			{...rest}
		>
			{children}
		</NextLink>
	)
}

export default Link
