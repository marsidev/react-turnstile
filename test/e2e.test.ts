import type { Browser, Page } from '@playwright/test'
import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium, expect, test } from '@playwright/test'

const scriptId = 'cf-turnstile-script'
const containerId = 'cf-turnstile'
const demoToken = 'XXXX.DUMMY.TOKEN.XXXX'
const isCI = process.env.CI
let browser: Browser
let page: Page

const deleteScreenshots = async (directory: string) => {
	for (const file of await fs.readdir(directory)) {
		await fs.unlink(path.join(directory, file))
	}
}

const ensureFrameVisible = async () => {
	await expect(page.locator('iframe')).toBeVisible()
	await expect(page.locator('iframe')).toHaveCount(1)
}

const ensureFrameHidden = async () => {
	await expect(page.locator('iframe')).toBeHidden()
	await expect(page.locator('iframe')).toHaveCount(0)
}

const ensureChallengeSolved = async () => {
	await expect(page.locator('[name="cf-turnstile-response"]')).toHaveValue(demoToken)
}

const ensureChallengeNotSolved = async () => {
	await expect(page.locator('[name="cf-turnstile-response"]')).toHaveValue('')
}

test.describe.configure({ mode: 'serial' })
const ssPath = './test/output'

test.use({
	colorScheme: 'dark'
})

test.beforeAll(async () => {
	!isCI && (await deleteScreenshots(ssPath))
	browser = await chromium.launch()
	page = await browser.newPage()
	await page.goto('/')
	!isCI && (await page.screenshot({ path: `${ssPath}/0-before-all.png` }))
})

test.afterAll(async () => {
	await browser.close()
})

test('demo page rendered', async () => {
	await expect(page.locator('h1')).toContainText('React Turnstile Demo')
})

test('script injected', async () => {
	await expect(page.locator(`#${scriptId}`)).toHaveCount(1)
})

test('widget container rendered', async () => {
	await expect(page.locator(`#${containerId}`)).toHaveCount(1)
})

test('widget iframe is visible', async () => {
	await ensureFrameVisible()
	const iframe = page.frameLocator('iframe[src^="https://challenges.cloudflare.com"]')
	await expect(iframe.locator('body')).toContainText('Testing only.')
	!isCI && (await page.screenshot({ path: `${ssPath}/1-widget-visible.png` }))
})

test('challenge has been solved', async () => {
	await ensureChallengeSolved()
	!isCI && (await page.screenshot({ path: `${ssPath}/2-challenge-solved.png` }))
})

test('widget can be removed', async () => {
	await page.locator('button', { hasText: 'Remove' }).click()
	await ensureFrameHidden()
	!isCI && (await page.screenshot({ path: `${ssPath}/3-widget-removed.png` }))
})

test('widget can be explicity rendered', async () => {
	await page.locator('button', { hasText: 'Render' }).click()
	await ensureFrameVisible()
	await ensureChallengeSolved()
	!isCI && (await page.screenshot({ path: `${ssPath}/4-widget-rendered.png` }))
})

test('widget can be reset', async () => {
	await page.locator('button', { hasText: 'Reset' }).click()
	await ensureChallengeNotSolved()
	await ensureChallengeSolved()
	!isCI && (await page.screenshot({ path: `${ssPath}/7-widget-reset.png` }))
})

test('can get the token', async () => {
	page.on('dialog', async dialog => {
		expect(dialog.message()).toContain(demoToken)
		await dialog.accept()
	})

	await page.locator('button', { hasText: 'Get response' }).click()
})
