import type { Browser, Page } from '@playwright/test'
import { chromium, expect, test } from '@playwright/test'
import { CONTAINER_STYLE_SET, DEFAULT_CONTAINER_ID, DEFAULT_SCRIPT_ID } from '../../packages/lib/src/utils'
import {
	deleteScreenshots,
	demoToken,
	ensureChallengeNotSolved,
	ensureChallengeSolved,
	ensureDirectory,
	ensureFrameHidden,
	getFirstWidgetFrame,
	ssPath
} from './helpers'

const isCI = process.env.CI

let browser: Browser
let page: Page

const route = 'basic'

test.beforeAll(async () => {
	!isCI && ensureDirectory(ssPath)
	!isCI && (await deleteScreenshots(ssPath))
	browser = await chromium.launch()
	page = await browser.newPage()
	await page.goto(`/${route}`)
})

test.afterAll(async () => {
	await browser?.close?.()
})

test('script injected', async () => {
	await expect(page.locator(`#${DEFAULT_SCRIPT_ID}`)).toHaveCount(1)
})

test('widget container rendered', async () => {
	await expect(page.locator(`#${DEFAULT_CONTAINER_ID}`)).toHaveCount(1)
})

test('widget is rendered and solved', async () => {
	await ensureChallengeSolved(page)
	const wrapper = page.getByTestId('turnstile-wrapper')
	await expect(wrapper).toHaveAttribute('data-status', 'solved')

	!isCI &&
		(await page.screenshot({
			path: `${ssPath}/${route}_1-widget-visible.png`
		}))
})

test('`onWidgetLoad` callback is called', async () => {
	const wrapper = page.getByTestId('turnstile-wrapper')
	await expect(wrapper).toHaveAttribute('data-widget-id', /.+/, { timeout: 10000 })
	const widgetId = await wrapper.getAttribute('data-widget-id')
	expect(widgetId).toBeTruthy()
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
	const iframe = await getFirstWidgetFrame(page)
	const box = await iframe?.locator('body').boundingBox()
	expect(box).toBeDefined()
	expect(box!.width).toBeCloseTo(CONTAINER_STYLE_SET.normal.width as number)

	// change size
	await page.getByTestId('widget-size-value').click()
	await page.getByRole('option', { name: 'compact' }).click()

	// check new width
	const iframeAfter = await getFirstWidgetFrame(page)
	const boxAfter = await iframeAfter?.locator('body').boundingBox()
	expect(boxAfter).toBeDefined()
	expect(boxAfter!.width).toBeCloseTo(CONTAINER_STYLE_SET.compact.width as number)
})

test('widget can change language', async () => {
	const wrapper = page.getByTestId('turnstile-wrapper')
	await expect(wrapper).toHaveAttribute('data-lang', 'auto')

	await page.getByTestId('widget-lang-value').click()
	await page.getByRole('option', { name: 'Español' }).click()

	await expect(wrapper).toHaveAttribute('data-lang', 'es')
	await ensureChallengeSolved(page)
	await expect(wrapper).toHaveAttribute('data-status', 'solved')
})

test('widget can change theme', async () => {
	const wrapper = page.getByTestId('turnstile-wrapper')

	await page.getByTestId('widget-theme-value').click()
	await page.getByRole('option', { name: 'Dark' }).click()

	await ensureChallengeSolved(page)
	await expect(wrapper).toHaveAttribute('data-status', 'solved')
})

test('widget shows error state with failing site key', async () => {
	const wrapper = page.getByTestId('turnstile-wrapper')

	await page.getByTestId('widget-siteKey-value').click()
	await page.getByRole('option', { name: 'Always fail' }).click()

	await expect(wrapper).toHaveAttribute('data-status', 'error', { timeout: 10000 })
})
