import type { Browser, Page } from "@playwright/test";
import { chromium, expect, test } from "@playwright/test";

let browser: Browser;
let page: Page;

const route = "basic";

test.beforeAll(async () => {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto(`/${route}`);
});

test.afterAll(async () => {
  await browser?.close?.();
});

// A sitekey that is a well-formed string but does not belong to any widget is
// only rejected once Turnstile talks to Cloudflare, so the failure arrives
// through `error-callback` (observed code: 400020) rather than as a throw from
// `turnstile.render`.
test("`onError` is called when the site key does not exist", async () => {
  const wrapper = page.getByTestId("turnstile-wrapper");

  await page.getByTestId("widget-siteKey-value").click();
  await page.getByRole("option", { name: "Invalid site key" }).click();

  await expect(wrapper).toHaveAttribute("data-status", "error", { timeout: 15000 });
  await expect(wrapper).toHaveAttribute("data-error-code", /^\d{6}$/);
});
