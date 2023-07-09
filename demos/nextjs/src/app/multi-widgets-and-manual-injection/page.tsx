'use client'

import Script from 'next/script'
import { DEFAULT_SCRIPT_ID, SCRIPT_URL } from '@marsidev/react-turnstile'
import React from 'react'
import DemoWidget from '~/components/demo-widget'

export default function Page() {
	return (
		<React.Fragment>
			<Script id={DEFAULT_SCRIPT_ID} src={SCRIPT_URL} strategy="afterInteractive" />

			<h1>Multiple widgets with manual script injection</h1>

			<h2 className="mt-8 text-2xl font-semibold">Widget 1</h2>
			<DemoWidget id="widget-1" injectScript={false} />

			<h2 className="mt-8 text-2xl font-semibold">Widget 2</h2>
			<DemoWidget id="widget-2" initialSize="compact" injectScript={false} />
		</React.Fragment>
	)
}
