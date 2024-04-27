import type { Browser, Page } from '@playwright/test'
import { chromium, expect, test } from '@playwright/test'
import { DEFAULT_CONTAINER_ID } from '../../packages/lib/src/utils'
import {
	deleteScreenshots,
	demoToken,
	ensureChallengeNotSolved,
	ensureChallengeSolved,
	ensureDirectory,
	ensureFrameHidden,
	ensureFrameVisible,
	sleep,
	ssPath
} from './helpers'

const isCI = process.env.CI

let browser: Browser
let page: Page

const route = 'manual-script-injection-with-custom-script-props'

test.beforeAll(async () => {
	!isCI && ensureDirectory(ssPath)
	!isCI && (await deleteScreenshots(ssPath))
	browser = await chromium.launch()
	page = await browser.newPage()
	await page.goto(`/${route}`)
})

test.afterAll(async () => {
	await browser.close()
})

test('script injected', async () => {
	await expect(page.locator(`#turnstile-script`)).toHaveCount(1)
})

test('widget container rendered', async () => {
	await expect(page.locator(`#${DEFAULT_CONTAINER_ID}`)).toHaveCount(1)
})

test('widget iframe is visible', async () => {
	await sleep(3500)
	const iframe = page.frameLocator('iframe[src^="https://challenges.cloudflare.com"]')
	await expect(iframe.locator('body')).toContainText('Testing only.', {
		timeout: 15000
	})
	!isCI &&
		(await page.screenshot({
			path: `${ssPath}/${route}_1-widget-visible.png`
		}))
})

test('challenge has been solved', async () => {
	await ensureChallengeSolved(page)
	!isCI &&
		(await page.screenshot({
			path: `${ssPath}/${route}_2-challenge-solved.png`
		}))
})

test('widget can be removed', async () => {
	await page.locator('button', { hasText: 'Remove' }).click()
	await ensureFrameHidden(page)
	!isCI &&
		(await page.screenshot({
			path: `${ssPath}/${route}_3-widget-removed.png`
		}))
})

test('widget can be explicity rendered', async () => {
	await page.locator('button', { hasText: 'Render' }).click()
	await ensureFrameVisible(page)
	await ensureChallengeSolved(page)
	!isCI &&
		(await page.screenshot({
			path: `${ssPath}/${route}_4-widget-rendered.png`
		}))
})

test('widget can be reset', async () => {
	await page.locator('button', { hasText: 'Reset' }).click()
	await ensureChallengeNotSolved(page)
	await ensureChallengeSolved(page)
	!isCI && (await page.screenshot({ path: `${ssPath}/${route}_5-widget-reset.png` }))
})

test('can get the token', async () => {
	page.once('dialog', async dialog => {
		expect(dialog.message()).toContain(demoToken)
		await dialog.accept()
	})

	await page.getByRole('button', { name: 'Get response', exact: true }).click()
})

test('can get the token using the promise method', async () => {
	page.once('dialog', async dialog => {
		expect(dialog.message()).toContain(demoToken)
		await dialog.accept()
	})

	await page.locator('button', { hasText: 'Remove' }).click()
	await ensureFrameHidden(page)
	await page.locator('button', { hasText: 'Render' }).click()

	await page.getByRole('button', { name: 'Get response (promise)', exact: true }).click()
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

	await ensureFrameVisible(page)

	// check new width
	const iframeAfter = page.frameLocator('iframe[src^="https://challenges.cloudflare.com"]')
	const boxAfter = await iframeAfter.locator('body').boundingBox()
	expect(boxAfter).toBeDefined()
	expect(boxAfter!.width).toBeCloseTo(130)
})

test('widget can change language', async () => {
	await ensureFrameVisible(page)
	const iframe = page.frameLocator('iframe[src^="https://challenges.cloudflare.com"]')
	await expect(iframe.locator('#success-text')).toContainText('Success!')

	await page.getByTestId('widget-lang-value').click()
	await page.getByRole('option', { name: 'Español' }).click()
	await ensureFrameVisible(page)
	await expect(iframe.locator('#success-text')).toContainText('¡Operación exitosa!')

	await page.getByTestId('widget-lang-value').click()
	await page.getByRole('option', { name: 'Deutsch' }).click()
	await ensureFrameVisible(page)
	await expect(iframe.locator('#success-text')).toContainText('Erfolg!')

	await page.getByTestId('widget-lang-value').click()
	await page.getByRole('option', { name: '日本語' }).click()
	await ensureFrameVisible(page)
	await expect(iframe.locator('#success-text')).toContainText('成功しました!')
})
