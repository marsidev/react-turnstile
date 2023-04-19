import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import Link from './link'

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

	// Sets the defaultValue only when the value property is not filled.
	if (!props.value) {
		defaultValue = props.options[0].value
	}

	return (
		<label className="flex min-w-[100px] max-w-fit flex-col text-black dark:text-white">
			<span className="font-medium">
				{props.title}
				{props.helperUrl && (
					<span>
						<Link className="ml-2" href={props.helperUrl}>
							?
						</Link>
					</span>
				)}
			</span>

			<Select
				defaultValue={defaultValue}
				name={props.name}
				value={props.value}
				onValueChange={value => {
					if (!props.onChange) return
					props.onChange(value)
				}}
			>
				<SelectTrigger>
					<SelectValue data-testid={`widget-${props.name}-value`} defaultValue={defaultValue} />
				</SelectTrigger>

				<SelectContent>
					{props.options.map(option => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</label>
	)
}

export default Options
