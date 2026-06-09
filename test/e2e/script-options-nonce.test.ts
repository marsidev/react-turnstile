import type { Browser, Page } from "@playwright/test";
import { chromium, expect, test } from "@playwright/test";
import { DEFAULT_CONTAINER_ID, SCRIPT_URL } from "../../packages/lib/src/utils";
import { ensureChallengeSolved } from "./helpers";

let browser: Browser;
let page: Page;

const route = "script-options-nonce";

// The library-injected api.js script, located via the library's own SCRIPT_URL
// so the test stays decoupled from the demo page's chosen script id / nonce.
const turnstileScript = (page: Page) => page.locator(`script[src*="${SCRIPT_URL}"]`);

test.beforeAll(async () => {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto(`/${route}`);
});

test.afterAll(async () => {
  await browser?.close?.();
});

test("script is injected", async () => {
  await expect(turnstileScript(page)).toHaveCount(1);
});

// Regression test for https://github.com/marsidev/react-turnstile/issues/166
// The nonce passed via `scriptOptions` must end up as a `nonce` content
// attribute on the injected <script>. Setting the `nonce` IDL property (the
// previous behavior) only writes the element's internal slot, so the attribute
// is absent in a real browser. This must run in a real browser - jsdom reflects
// the IDL property to the attribute and would pass either way.
test("nonce from scriptOptions is set as a content attribute on the script", async () => {
  await expect(turnstileScript(page)).toHaveAttribute("nonce", /.+/);
});

test("widget container rendered", async () => {
  await expect(page.locator(`#${DEFAULT_CONTAINER_ID}`)).toHaveCount(1);
});

test("widget is rendered and solved despite the nonce", async () => {
  const wrapper = page.getByTestId("turnstile-wrapper");
  await expect(wrapper).toHaveAttribute("data-status", "solved", { timeout: 10000 });
  await ensureChallengeSolved(page);
});
