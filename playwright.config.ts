import { defineConfig, devices } from '@playwright/test'

const PORT = process.env.PORT || 3000
const baseURL = `http://localhost:${PORT}`

// Reference: https://playwright.dev/docs/test-configuration
export default defineConfig({
	timeout: 30 * 1000,
	testDir: 'test',
	testMatch: 'test/e2e.test.ts',
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,

	// https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
	webServer: {
		command: 'pnpm run --filter=nextjs-demo dev',
		url: baseURL,
		timeout: 120 * 1000,
		reuseExistingServer: !process.env.CI
	},

	use: {
		trace: 'retry-with-trace',
		headless: true,
		baseURL,
		locale: 'en-US',
		colorScheme: 'dark'
	},

	projects: [
		{
			name: 'Desktop Chrome',
			use: {
				...devices['Desktop Chrome']
			}
		},
		{
			name: 'Mobile Safari',
			use: devices['iPhone 13']
		}
	]
})
