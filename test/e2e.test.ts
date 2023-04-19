import type { Browser, Page } from '@playwright/test'
import fsPromises from 'node:fs/promises'
import fs from 'node:fs'
import path from 'node:path'
import { chromium, expect, test } from '@playwright/test'

const scriptId = 'cf-turnstile-script'
const containerId = 'cf-turnstile'
const demoToken = 'XXXX.DUMMY.TOKEN.XXXX'
const isCI = process.env.CI
let browser: Browser
let page: Page

const deleteScreenshots = async (dir: string) => {
	for (const file of await fsPromises.readdir(dir)) {
		await fsPromises.unlink(path.join(dir, file))
	}
}

const ensureDirectory = (dir: string) => {
	if (!fs.existsSync(dir)) fs.mkdirSync(dir)
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

const ssPath = './test/output'

test.beforeAll(async () => {
	!isCI && ensureDirectory(ssPath)
	!isCI && (await deleteScreenshots(ssPath))
	browser = await chromium.launch()
	page = await browser.newPage()
	await page.goto('/')
	!isCI && (await page.screenshot({ path: `${ssPath}/0-before-all.png` }))
})

test.afterAll(async () => {
	await browser.close()
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

test('widget can be sized', async () => {
	// check default width
	const iframe = page.frameLocator('iframe[src^="https://challenges.cloudflare.com"]')
	const box = await iframe.locator('body').boundingBox()
	expect(box).toBeDefined()
	expect(box!.width).toBeCloseTo(300)

	// change size
	await page.getByTestId('widget-size-value').click()
	await page.getByRole('option', { name: 'compact' }).click()

	await ensureFrameVisible()

	// check new width
	const iframeAfter = page.frameLocator('iframe[src^="https://challenges.cloudflare.com"]')
	const boxAfter = await iframeAfter.locator('body').boundingBox()
	expect(boxAfter).toBeDefined()
	expect(boxAfter!.width).toBeCloseTo(130)
})

test('widget can change language', async () => {
	await ensureFrameVisible()
	const iframe = page.frameLocator('iframe[src^="https://challenges.cloudflare.com"]')
	await expect(iframe.locator('#success-text')).toContainText('Success!')

	await page.getByTestId('widget-lang-value').click()
	await page.getByRole('option', { name: 'Español' }).click()
	await ensureFrameVisible()
	await expect(iframe.locator('#success-text')).toContainText('¡Operación exitosa!')

	await page.getByTestId('widget-lang-value').click()
	await page.getByRole('option', { name: 'Deutsch' }).click()
	await ensureFrameVisible()
	await expect(iframe.locator('#success-text')).toContainText('Erfolg!')

	await page.getByTestId('widget-lang-value').click()
	await page.getByRole('option', { name: '日本語' }).click()
	await ensureFrameVisible()
	await expect(iframe.locator('#success-text')).toContainText('成功しました!')
})
