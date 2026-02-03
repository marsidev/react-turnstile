import type { Browser } from '@playwright/test'
import { devices as allDevices, chromium, expect, test, webkit } from '@playwright/test'
import { DEFAULT_CONTAINER_ID, DEFAULT_SCRIPT_ID } from '../../packages/lib/src/utils'
import { ensureDirectory, ssPath } from './helpers'

const { describe } = test
const isCI = process.env.CI
let currentBrowser: Browser

const devices = [
	{ name: 'Chrome', config: allDevices['Desktop Chrome'] },
	{ name: 'Galaxy S24', config: allDevices['Galaxy S24'] },
	{ name: 'iPhone 15 Pro Max', config: allDevices['iPhone 15 Pro Max'] }
]

test.beforeAll(async () => {
	!isCI && ensureDirectory(ssPath)
	// !isCI && (await deleteScreenshots(ssPath))
})

describe('Browsers', async () => {
	const engines = [chromium, webkit]

	engines.forEach(engine => {
		const browserName = engine.name()
		describe(`${browserName}`, async () => {
			devices
				// use branded chromium versions (channels) only on chromium
				.filter(() => {
					return browserName === 'chromium'
				})
				.forEach(({ name, config }) => {
					const tokenizedDeviceName = name.replace(/\s/g, '-').toLowerCase()

					test(`${tokenizedDeviceName} renders the widget`, async () => {
						let browser: Browser
						if (currentBrowser?.browserType().name() === browserName) {
							browser = currentBrowser
						} else {
							await currentBrowser?.close()
							browser = await engine.launch()
						}

						currentBrowser = browser

						let deviceConfig = config
						if (browserName === 'firefox' && config.isMobile) {
							deviceConfig = { ...config, isMobile: false }
						}
						const context = await browser.newContext(deviceConfig)

						const page = await context.newPage()
						await page.goto('/')

						await expect(page.locator(`#${DEFAULT_SCRIPT_ID}`)).toHaveCount(1)
						await expect(page.locator(`#${DEFAULT_CONTAINER_ID}`)).toHaveCount(1)
						const wrapper = page.getByTestId('turnstile-wrapper')
						await expect(wrapper).toHaveAttribute('data-status', 'solved', { timeout: 10000 })

						!isCI &&
							(await page.screenshot({
								path: `${ssPath}/${browserName}-${tokenizedDeviceName}-visible.png`
							}))
					})
				})
		})
	})
})
