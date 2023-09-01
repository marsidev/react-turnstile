import type { Browser } from '@playwright/test'
import { devices as allDevices, chromium, expect, firefox, test, webkit } from '@playwright/test'
import { DEFAULT_CONTAINER_ID, DEFAULT_SCRIPT_ID } from '../../packages/lib/src/utils'
import { ensureDirectory, ensureFrameVisible, ssPath } from './helpers'

const { describe } = test
const isCI = process.env.CI
let currentBrowser: Browser

const devices = [
	{ name: 'Chrome', config: allDevices['Desktop Chrome'] },
	{ name: 'Chrome (2)', config: allDevices['Desktop Chrome'], channel: 'chrome' },
	{ name: 'Chrome Beta', config: allDevices['Desktop Chrome'], channel: 'chrome-beta' },
	{ name: 'Desktop Edge', config: allDevices['Desktop Edge'] },
	{ name: 'Desktop Edge (2)', config: allDevices['Desktop Edge'], channel: 'msedge' },
	{ name: 'Desktop Edge Beta', config: allDevices['Desktop Edge'], channel: 'msedge-beta' },
	{ name: 'Desktop Safari', config: allDevices['Desktop Safari'] },
	{ name: 'Desktop Firefox', config: allDevices['Desktop Firefox'] },
	{ name: 'Galaxy S9+', config: allDevices['Galaxy S9+'] },
	{ name: 'Galaxy Tab S4', config: allDevices['Galaxy Tab S4'] },
	{ name: 'iPad Pro 11', config: allDevices['iPad Pro 11'] },
	{ name: 'iPhone 13 Pro Max', config: allDevices['iPhone 13 Pro Max'] }
]

test.beforeAll(async () => {
	!isCI && ensureDirectory(ssPath)
	// !isCI && (await deleteScreenshots(ssPath))
})

describe('Browsers', async () => {
	const engines = [chromium, webkit, firefox]

	engines.forEach(engine => {
		const browserName = engine.name()
		describe(`${browserName}`, async () => {
			devices
				// use branded chromium versions (channels) only on chromium
				.filter(({ channel }) => {
					return !channel || browserName === 'chromium'
				})
				.forEach(({ name, config, channel }) => {
					const tokenizedDeviceName = name.replace(/\s/g, '-').toLowerCase()

					test(`${tokenizedDeviceName} renders the widget`, async () => {
						let browser: Browser
						if (currentBrowser?.browserType().name() === browserName) {
							browser = currentBrowser
						} else {
							await currentBrowser?.close()
							browser = await engine.launch({
								channel: browserName === 'chromium' ? channel : undefined
							})
						}

						currentBrowser = browser

						let deviceConfig = config
						if (browserName === 'firefox' && config.isMobile) {
							deviceConfig = { ...config, isMobile: false }
						}
						const context = await browser.newContext(deviceConfig)

						const page = await context.newPage()
						await page.goto('/')

						await expect(
							page.locator(`#${DEFAULT_SCRIPT_ID}__${DEFAULT_CONTAINER_ID}`)
						).toHaveCount(1)
						await expect(page.locator(`#${DEFAULT_CONTAINER_ID}`)).toHaveCount(1)
						await ensureFrameVisible(page)
						const iframe = page.frameLocator('iframe[src^="https://challenges.cloudflare.com"]')
						await expect(iframe.locator('body')).toContainText('Testing only.')
						!isCI &&
							(await page.screenshot({
								path: `${ssPath}/${browserName}-${tokenizedDeviceName}-visible.png`
							}))
					})
				})
		})
	})
})
