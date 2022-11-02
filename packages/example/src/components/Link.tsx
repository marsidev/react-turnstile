interface LinkProps extends React.ComponentProps<'a'> {
	href: string
	children: React.ReactNode
}

const Link: React.FC<LinkProps> = ({ href, children, ...rest }) => {
	return (
		<a
			className='underline text-[#f4a15d] hover:text-[#e06d10]'
			href={href}
			rel='noreferrer'
			target='_blank'
			{...rest}
		>
			{children}
		</a>
	)
}

export default Link
