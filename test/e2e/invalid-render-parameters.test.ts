import type { Browser, Page } from "@playwright/test";
import { chromium, expect, test } from "@playwright/test";
import { ensureFrameHidden } from "./helpers";

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

// An empty sitekey is rejected by `turnstile.render` itself, before the widget
// is created, so the failure arrives as a throw rather than through
// `error-callback`. Sitekeys that are well-formed but unknown to Cloudflare are
// the opposite case: the widget is created and the rejection comes back later as
// an error code.
test("`onError` receives the validation message when the render parameters are invalid", async () => {
  const wrapper = page.getByTestId("turnstile-wrapper");

  await page.getByTestId("widget-siteKey-value").click();
  await page.getByRole("option", { name: "Empty site key" }).click();

  await expect(wrapper).toHaveAttribute("data-status", "error");
  await expect(wrapper).toHaveAttribute("data-error", /sitekey/i);
  await expect(page.getByTestId("widget-error")).toBeVisible();
});

test("no widget is mounted when the render parameters are invalid", async () => {
  await ensureFrameHidden(page);
});
