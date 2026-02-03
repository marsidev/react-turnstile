import fsPromises from 'node:fs/promises'
import fs from 'node:fs'
import path from 'node:path'
import { Page, expect } from '@playwright/test'

export const demoToken = 'XXXX.DUMMY.TOKEN.XXXX'
export const ssPath = './test/e2e/output'

export const deleteScreenshots = async (dir: string) => {
	for (const file of await fsPromises.readdir(dir)) {
		await fsPromises.unlink(path.join(dir, file)).catch(() => {})
	}
}

export const ensureDirectory = (dir: string) => {
	if (!fs.existsSync(dir)) fs.mkdirSync(dir)
}

export const ensureFrameHidden = async (page: Page) => {
	await expect(page.locator('iframe')).toBeHidden()
	await expect(page.locator('iframe')).toHaveCount(0)
}

export const ensureChallengeSolved = async (page: Page) => {
	await sleep(1500)
	await expect(page.locator('[name="cf-turnstile-response"]')).toHaveValue(demoToken)
}

export const ensureChallengeNotSolved = async (page: Page) => {
	await expect(page.locator('[name="cf-turnstile-response"]')).toHaveValue('')
}

export async function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

export async function getWidgetFrames(page: Page) {
	await sleep(1500)
	return page.frames().filter(f => f.url().startsWith('https://challenges.cloudflare.com'))
}

export async function getFirstWidgetFrame(page: Page) {
	await sleep(1500)
	return page.frames().filter(f => f.url().startsWith('https://challenges.cloudflare.com'))[0]
}
