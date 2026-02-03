import type { Browser, Page } from '@playwright/test'
import { chromium, expect, test } from '@playwright/test'
import { DEFAULT_CONTAINER_ID } from '../../packages/lib/src/utils'
import { deleteScreenshots, demoToken, ensureDirectory, getWidgetFrames, ssPath } from './helpers'

const isCI = process.env.CI

let browser: Browser
let page: Page

const route = 'multiple-widgets'

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

test('widget containers rendered', async () => {
	await expect(page.locator(`#${DEFAULT_CONTAINER_ID}`)).toHaveCount(0)
	await expect(page.locator('#widget-1')).toHaveCount(1)
	await expect(page.locator('#widget-2')).toHaveCount(1)
})

test('widgets are rendered and solved', async () => {
	const wrapper1 = page.getByTestId('turnstile-wrapper-widget-1')
	const wrapper2 = page.getByTestId('turnstile-wrapper-widget-2')

	await expect(wrapper1).toHaveAttribute('data-status', 'solved', { timeout: 10000 })
	await expect(wrapper2).toHaveAttribute('data-status', 'solved', { timeout: 10000 })

	!isCI &&
		(await page.screenshot({
			path: `${ssPath}/${route}_1-widget-visible.png`
		}))
})

test('`onWidgetLoad` callbacks are called', async () => {
	const wrapper1 = page.getByTestId('turnstile-wrapper-widget-1')
	const wrapper2 = page.getByTestId('turnstile-wrapper-widget-2')

	await expect(wrapper1).toHaveAttribute('data-widget-id', /.+/, { timeout: 10000 })
	await expect(wrapper2).toHaveAttribute('data-widget-id', /.+/, { timeout: 10000 })
})

test('challenges have been solved', async () => {
	await expect(page.locator('[name="cf-turnstile-response"]')).toHaveCount(2)
	await expect(page.locator('[name="cf-turnstile-response"]').first()).toHaveValue(demoToken)
	await expect(page.locator('[name="cf-turnstile-response"]').last()).toHaveValue(demoToken)
})

test('widget can be removed', async () => {
	await page.locator('button', { hasText: 'Remove' }).first().click()
	await page.locator('button', { hasText: 'Remove' }).last().click()
	await expect(page.locator('iframe')).toHaveCount(0)

	!isCI &&
		(await page.screenshot({
			path: `${ssPath}/${route}_3-widget-removed.png`
		}))
})

test('widget can be explicity rendered', async () => {
	await page.locator('button', { hasText: 'Render' }).first().click()
	await page.locator('button', { hasText: 'Render' }).last().click()

	await expect(page.locator('[name="cf-turnstile-response"]')).toHaveCount(2)
	await expect(page.locator('[name="cf-turnstile-response"]').first()).toHaveValue(demoToken)
	await expect(page.locator('[name="cf-turnstile-response"]').last()).toHaveValue(demoToken)

	!isCI &&
		!isCI &&
		(await page.screenshot({
			path: `${ssPath}/${route}_4-widget-rendered.png`
		}))
})

test('widget can be reset', async () => {
	await page.locator('button', { hasText: 'Reset' }).first().click()
	await expect(page.locator('[name="cf-turnstile-response"]').first()).toHaveValue('')

	await page.locator('button', { hasText: 'Reset' }).last().click()
	await expect(page.locator('[name="cf-turnstile-response"]').last()).toHaveValue('')

	const frames = await getWidgetFrames(page)
	expect(frames).toHaveLength(2)

	await expect(page.locator('[name="cf-turnstile-response"]')).toHaveCount(2)
	await expect(page.locator('[name="cf-turnstile-response"]').first()).toHaveValue(demoToken)
	await expect(page.locator('[name="cf-turnstile-response"]').last()).toHaveValue(demoToken)
	!isCI && (await page.screenshot({ path: `${ssPath}/${route}_5-widget-reset.png` }))
})

test('can get the token', async () => {
	page.once('dialog', async dialog => {
		expect(dialog.message()).toContain(demoToken)
		await dialog.accept()
	})

	await page.getByRole('button', { name: 'Get response', exact: true }).first().click()
	await page.getByRole('button', { name: 'Get response', exact: true }).last().click()
})

test('can get the token using the promise method', async () => {
	page.once('dialog', async dialog => {
		expect(dialog.message()).toContain(demoToken)
		await dialog.accept()
	})

	await page.locator('button', { hasText: 'Remove' }).first().click()
	await page.locator('button', { hasText: 'Remove' }).last().click()
	await expect(page.locator('iframe')).toHaveCount(0)
	await page.locator('button', { hasText: 'Render' }).first().click()
	await page.locator('button', { hasText: 'Render' }).last().click()

	await page.getByRole('button', { name: 'Get response (promise)', exact: true }).first().click()
	await page.getByRole('button', { name: 'Get response (promise)', exact: true }).last().click()
})
