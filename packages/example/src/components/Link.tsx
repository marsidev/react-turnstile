interface LinkProps extends React.ComponentProps<'a'> {
	href: string
	label: string
}

const Link: React.FC<LinkProps> = ({ href, label, ...rest }) => {
	return (
		<a
			className='underline text-[#f4a15d] hover:text-[#e06d10]'
			href={href}
			rel='noreferrer'
			target='_blank'
			{...rest}
		>
			{label}
		</a>
	)
}

export default Link
