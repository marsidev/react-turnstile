import Script from 'next/script'
import { SCRIPT_URL } from '@marsidev/react-turnstile'
import React from 'react'
import DemoWidget from '~/components/demo-widget'

export default function Page() {
	return (
		<React.Fragment>
			<Script id="turnstile-script" src={SCRIPT_URL} strategy="afterInteractive" />

			<h1>Manual script injection with custom script props</h1>

			<DemoWidget
				injectScript={false}
				scriptOptions={{
					id: 'turnstile-script'
				}}
			/>
		</React.Fragment>
	)
}
