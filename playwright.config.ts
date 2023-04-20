import { defineConfig } from '@playwright/test'

const PORT = process.env.PORT || 3001

export default defineConfig({
	timeout: 30 * 1000,
	testDir: 'test/e2e',
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,

	webServer: {
		port: +PORT,
		command: `pnpm run --filter=nextjs-demo dev -p ${PORT}`,
		timeout: 120 * 1000,
		reuseExistingServer: !process.env.CI
	},

	use: {
		trace: 'retry-with-trace',
		headless: true,
		locale: 'en-US',
		colorScheme: 'dark'
	}
})
