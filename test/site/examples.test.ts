import { expect, test } from "@playwright/test";

const SOLVE_TIMEOUT = 20 * 1000;

test("two widgets share a single injected script", async ({ page }) => {
  await page.goto("/examples/multiple-widgets");

  await expect(page.getByTestId("live-widget-widget-1")).toContainText("solved", {
    timeout: SOLVE_TIMEOUT
  });
  await expect(page.getByTestId("live-widget-widget-2")).toContainText("solved", {
    timeout: SOLVE_TIMEOUT
  });
  await expect(page.getByTestId("script-count")).toContainText("1 script tag");

  // Remounting both widgets must not inject a second script.
  await page.getByRole("button", { name: "Reload widgets" }).click();

  await expect(page.getByTestId("live-widget-widget-1")).toContainText("solved", {
    timeout: SOLVE_TIMEOUT
  });
  await expect(page.getByTestId("script-count")).toContainText("1 script tag");
});

test("a widget renders against a script the page injected itself", async ({ page }) => {
  await page.goto("/examples/script-loading");

  await expect(page.getByTestId("live-widget-manual-injection")).toContainText("solved", {
    timeout: SOLVE_TIMEOUT
  });
});
