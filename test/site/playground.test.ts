import { expect, test } from "@playwright/test";

/** Cloudflare's testing widget solves on its own, but not instantly. */
const SOLVE_TIMEOUT = 20 * 1000;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("renders the widget and records the run", async ({ page }) => {
  const log = page.getByTestId("event-log");

  await expect(log).toContainText("onWidgetLoad", { timeout: SOLVE_TIMEOUT });
  await expect(log).toContainText("onSuccess", { timeout: SOLVE_TIMEOUT });
  await expect(page.getByTestId("lifecycle-rail")).toContainText("onSuccess");
  await expect(page.getByTestId("token-countdown")).toContainText("expires in");
});

test("validates the issued token through /api/verify", async ({ page }) => {
  const tray = page.getByTestId("token-tray");
  const validate = tray.getByRole("button", { name: "Validate token" });

  await validate.click({ timeout: SOLVE_TIMEOUT });

  await expect(tray.locator("pre")).toContainText('"success": true');
  await expect(page.getByTestId("event-log")).toContainText("siteverify");
});

test("a config change starts a new run", async ({ page }) => {
  const log = page.getByTestId("event-log");
  await expect(log).toContainText("onSuccess", { timeout: SOLVE_TIMEOUT });

  // Size, not theme: the run starts in dark mode already (Playwright sets
  // `colorScheme: dark`), so picking the dark theme would change no render
  // option and the widget would rightly stay as it is.
  await page.getByTestId("widget-size-options").locator("button").click();
  await page.getByRole("option", { name: "Compact" }).click();

  await expect(log).toContainText("compact");
  await expect(log.locator("li").filter({ hasText: "onWidgetLoad" })).toHaveCount(2, {
    timeout: SOLVE_TIMEOUT
  });
});

test("an imperative method is recorded in the event log", async ({ page }) => {
  const log = page.getByTestId("event-log");
  await expect(log).toContainText("onSuccess", { timeout: SOLVE_TIMEOUT });

  await page.getByRole("button", { name: "getResponse()" }).click();

  await expect(log).toContainText("getResponse()");
});
