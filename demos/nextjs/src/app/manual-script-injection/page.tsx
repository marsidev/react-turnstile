'use client'

import Script from 'next/script'
import { DEFAULT_SCRIPT_ID, SCRIPT_URL } from '@marsidev/react-turnstile'
import React from 'react'
import DemoWidget from '~/components/demo-widget'

export default function Page() {
	return (
		<React.Fragment>
			<Script id={DEFAULT_SCRIPT_ID} src={SCRIPT_URL} strategy="beforeInteractive" />

			<h1>Manual script injection</h1>
			<DemoWidget injectScript={false} />
		</React.Fragment>
	)
}
