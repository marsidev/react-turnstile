'use client'

import Script from 'next/script'
import { SCRIPT_URL } from '@marsidev/react-turnstile'
import React from 'react'
import DemoWidget from '~/components/demo-widget'

export default function Page() {
	return (
		<React.Fragment>
			{/* We add a custom query param to the script URL to force a re-download of the script, since the manual script injection is also used in other demos. This is not needed if the script ID is the same. */}
			<Script id="turnstile-script" src={`${SCRIPT_URL}?v=2`} strategy="afterInteractive" />

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
