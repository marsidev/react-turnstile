import type { TurnstileInstance } from '@marsidev/react-turnstile'

interface StateLabelsProps {
	turnstile: React.MutableRefObject<TurnstileInstance | null>
	onRestartStates: () => void
}

const WidgetMethods: React.FC<StateLabelsProps> = ({ turnstile, onRestartStates }) => {
	const onGetResponse = () => {
		alert(turnstile.current?.getResponse())
	}

	const onReset = () => {
		turnstile.current?.reset()
		onRestartStates()
	}

	const onRemove = () => {
		turnstile.current?.remove()
		onRestartStates()
	}

	const onRender = () => {
		turnstile.current?.render()
	}

	return (
		<div className="flex gap-2">
			<button
				className="mt-2 rounded-lg bg-[#f4a15d] px-4 py-2 text-black shadow-md hover:bg-[#e06d10]"
				type="button"
				onClick={onGetResponse}
			>
				Get response
			</button>

			<button
				className="mt-2 rounded-lg bg-[#f4a15d] px-4 py-2 text-black shadow-md hover:bg-[#e06d10]"
				onClick={onReset}
			>
				Reset
			</button>

			<button
				className="mt-2 rounded-lg bg-[#f4a15d] px-4 py-2 text-black shadow-md hover:bg-[#e06d10]"
				onClick={onRemove}
			>
				Remove
			</button>

			<button
				className="mt-2 rounded-lg bg-[#f4a15d] px-4 py-2 text-black shadow-md hover:bg-[#e06d10]"
				onClick={onRender}
			>
				Render
			</button>
		</div>
	)
}

export default WidgetMethods
