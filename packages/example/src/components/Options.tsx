interface Option {
	label: string
	value: string
	disabled?: boolean
}

interface OptionsProps {
	title: string
	name: string
	options: Option[]
	helperUrl?: string
	onChange?: (value: string) => void
	value?: this['options'][number]['value']
}

const Options: React.FC<OptionsProps> = props => {
	let defaultValue: string | undefined

	// Sets the defaultValue only if the value is not defined.
	if (!props.value) {
		defaultValue = props.options[0].value
	}

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
				defaultValue={defaultValue}
				name={props.name}
				value={props.value}
				onChange={e => {
					e.preventDefault()
					if (!props.onChange) return
					props.onChange(e.currentTarget.value)
				}}
			>
				{props.options.map(option => {
					return (
						<option key={option.value} disabled={(option.disabled === true)} value={option.value}>
							{option.label}
						</option>
					)
				})}
			</select>
		</label>
	)
}

export default Options
