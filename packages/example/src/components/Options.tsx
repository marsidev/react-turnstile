interface Option {
	label: string
	value: string
}

interface OptionsProps {
	title: string
	name: string
	options: Option[]
	helperUrl?: string
	onChange?: (value: string) => void
}

const Options: React.FC<OptionsProps> = props => {
	return (
		<label className='flex flex-col max-w-fit min-w-[80px]'>
			<span className='font-medium'>
				{props.title}
				{props.helperUrl && (
					<span>
						<a
							className='text-[#f4a15d] ml-2'
							href={props.helperUrl}
							rel='noreferrer'
							target='_blank'
						>
							?
						</a>
					</span>
				)}
			</span>

			<select
				className='rounded-md px-2 py-2'
				defaultValue={props.options[0].value}
				name={props.name}
				onChange={e => {
					e.preventDefault()
					if (!props.onChange) return
					props.onChange(e.currentTarget.value)
				}}
			>
				{props.options.map(option => {
					return (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					)
				})}
			</select>
		</label>
	)
}

export default Options
