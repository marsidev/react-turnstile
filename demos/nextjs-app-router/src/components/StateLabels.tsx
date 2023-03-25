import cn from 'classnames'
import type { WidgetStatus } from '~/types'

interface StateLabelsProps {
	status: WidgetStatus
}

interface LabelProps {
	value: boolean | null
	label: string
}

const Label: React.FC<LabelProps> = props => {
	return (
		<div
			className={`rounded-sm py-1 px-2 text-sm ${cn({
				'bg-blue-600': props.value,
				'bg-gray-600': !props.value
			})}`}
		>
			{props.label}
		</div>
	)
}

const StateLabels: React.FC<StateLabelsProps> = props => {
	return (
		<div className="flex gap-2">
			<Label label="Solved" value={props.status === 'solved'} />
			<Label label="Error" value={props.status === 'error'} />
			<Label label="Expired" value={props.status === 'expired'} />
		</div>
	)
}

export default StateLabels
