import type { LinkProps as NextLinkProps } from 'next/link'
import NextLink from 'next/link'
import cn from 'classnames'

interface LinkProps extends NextLinkProps, React.HTMLAttributes<HTMLAnchorElement> {}

const Link: React.FC<LinkProps> = ({ href, children, className, ...rest }) => {
	return (
		<NextLink
			className={cn(className, 'underline text-[#f4a15d] hover:text-[#e06d10]')}
			href={href}
			rel='noreferrer'
			target='_blank'
			{...rest}
		>
			{children}
		</NextLink>
	)
}

export default Link
