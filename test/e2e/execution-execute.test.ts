import type { Browser, Page } from "@playwright/test";
import { chromium, expect, test } from "@playwright/test";
import { CONTAINER_STYLE_SET, DEFAULT_CONTAINER_ID } from "../../packages/lib/src/utils";
import { ensureChallengeSolved } from "./helpers";

// Give the per-assertion timeouts below room to fail before the test budget.
test.describe.configure({ timeout: 60000 });

let browser: Browser;
let page: Page;

const route = "execution-execute";
const container = () => page.locator(`#${DEFAULT_CONTAINER_ID}`);
const wrapper = () => page.getByTestId("turnstile-wrapper");

test.beforeAll(async () => {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto(`/${route}`);
});

test.afterAll(async () => {
  await browser?.close?.();
});

test("container occupies no space before execute()", async () => {
  await expect(wrapper()).toHaveAttribute("data-status", "loaded");
  await expect(container()).toHaveCSS("width", "0px");
  await expect(container()).toHaveCSS("height", "0px");
});

// Regression test for #244: with `execution: 'execute'` the container was
// re-pinned to 0x0 after execute(), so the interactive challenge required by
// `appearance: 'interaction-only'` could never become visible.
test("interactive challenge becomes visible after execute()", async () => {
  await page.getByRole("button", { name: "Execute", exact: true }).click();
  await expect(wrapper()).toHaveAttribute("data-status", "interactive", { timeout: 15000 });
  await expect(container()).not.toHaveCSS("width", "0px");

  // The width applies as soon as the style flushes, but the height only grows
  // once Cloudflare renders the challenge inside the `height: auto` container,
  // so poll on it and assert both dimensions from the same measurement.
  let box: { x: number; y: number; width: number; height: number } | null = null;
  await expect
    .poll(
      async () => {
        box = await container().boundingBox();
        return box?.height ?? 0;
      },
      { timeout: 10000 }
    )
    .toBeGreaterThanOrEqual(CONTAINER_STYLE_SET.normal.height as number);

  expect(box!.width).toBeGreaterThanOrEqual(CONTAINER_STYLE_SET.normal.width as number);
});

test("interactive challenge can be solved", async () => {
  // The checkbox is rendered inside a closed shadow root within Cloudflare's
  // challenge frame, so no locator can reach it; click it by coordinates
  // instead (left edge of the widget, vertically centered).
  const box = (await container().boundingBox())!;
  await page.mouse.click(box.x + 30, box.y + box.height / 2);

  await expect(wrapper()).toHaveAttribute("data-status", "solved", { timeout: 30000 });
  await ensureChallengeSolved(page);
});
