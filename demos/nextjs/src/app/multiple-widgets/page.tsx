import React from 'react'
import DemoWidget from '~/components/demo-widget'

export default function Page() {
	return (
		<React.Fragment>
			<h1>Multiple widgets</h1>

			<h2>Widget 1</h2>
			<DemoWidget id="widget-1" />

			<h2>Widget 2</h2>
			<DemoWidget id="widget-2" initialSize="compact" />
		</React.Fragment>
	)
}
