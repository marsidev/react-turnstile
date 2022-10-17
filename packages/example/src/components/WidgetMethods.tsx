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
		<div className='flex gap-2'>
			<button
				className='bg-[#f4a15d] hover:bg-[#e06d10] text-black px-4 py-2 rounded-lg shadow-md mt-2'
				type='button'
				onClick={onGetResponse}
			>
				Get response
			</button>

			<button
				className='bg-[#f4a15d] hover:bg-[#e06d10] text-black px-4 py-2 rounded-lg shadow-md mt-2'
				onClick={onReset}
			>
				Reset
			</button>

			<button
				className='bg-[#f4a15d] hover:bg-[#e06d10] text-black px-4 py-2 rounded-lg shadow-md mt-2'
				onClick={onRemove}
			>
				Remove
			</button>

			<button
				className='bg-[#f4a15d] hover:bg-[#e06d10] text-black px-4 py-2 rounded-lg shadow-md mt-2'
				onClick={onRender}
			>
				Render
			</button>
		</div>
	)
}

export default WidgetMethods
