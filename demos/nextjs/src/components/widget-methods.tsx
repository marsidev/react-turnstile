import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useState } from 'react'
import { Button } from './button'

interface StateLabelsProps {
	turnstile: React.MutableRefObject<TurnstileInstance | null>
	onRestartStates: () => void
}

const WidgetMethods: React.FC<StateLabelsProps> = ({ turnstile, onRestartStates }) => {
	const [isGettingResponse, setIsGettingResponse] = useState(false)

	const onGetResponse = () => {
		alert(turnstile.current?.getResponse())
	}

	const onGetResponsePromise = () => {
		setIsGettingResponse(true)
		turnstile.current
			?.getResponsePromise()
			.then(alert)
			.catch(alert)
			.finally(() => setIsGettingResponse(false))
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
		<div className="flex flex-wrap gap-2">
			<Button onClick={onGetResponse}>Get response</Button>
			<Button disabled={isGettingResponse} onClick={onGetResponsePromise}>
				Get response (promise)
			</Button>
			<Button onClick={onReset}>Reset</Button>
			<Button onClick={onRemove}>Remove</Button>
			<Button onClick={onRender}>Render</Button>
		</div>
	)
}

export default WidgetMethods
