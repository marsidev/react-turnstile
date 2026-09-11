import type { PlaywrightTestConfig } from "@playwright/test";
import { defineConfig } from "@playwright/test";

// Both apps are served locally so a run always tests the code in the checkout,
// never a deployment.
const DEMO_PORT = +(process.env.PORT || 3001);
const SITE_PORT = +(process.env.SITE_PORT || 4173);

/** Projects named with `--project`; empty means "run them all". */
const selected = new Set<string>();
process.argv.forEach((arg, index) => {
  if (arg === "--project") selected.add(process.argv[index + 1]);
  else if (arg.startsWith("--project=")) selected.add(arg.slice("--project=".length));
});

// Playwright has no per-project web server, so a filtered run would otherwise
// still pay for (and depend on) the app it is not testing.
const runs = (project: string) => selected.size === 0 || selected.has(project);

type WebServer = Extract<NonNullable<PlaywrightTestConfig["webServer"]>, unknown[]>[number];
const webServer: WebServer[] = [];

if (runs("nextjs")) {
  webServer.push({
    port: DEMO_PORT,
    command: `pnpm run --filter=nextjs-demo dev -p ${DEMO_PORT}`,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  });
}

if (runs("site")) {
  webServer.push({
    port: SITE_PORT,
    // `vite preview` serves the built Worker in workerd, the same runtime as
    // production, so the server routes (/api/verify, /sitemap.xml) are real.
    command: `pnpm run --filter=site build && pnpm run --filter=site preview --port ${SITE_PORT}`,
    // The command builds before it serves, so this covers a cold CI build.
    timeout: 300 * 1000,
    reuseExistingServer: !process.env.CI
  });
}

export default defineConfig({
  timeout: 30 * 1000,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,

  webServer,

  projects: [
    {
      name: "nextjs",
      testDir: "test/e2e",
      use: { baseURL: `http://localhost:${DEMO_PORT}` }
    },
    {
      name: "site",
      testDir: "test/site",
      use: { baseURL: `http://localhost:${SITE_PORT}` }
    }
  ],

  use: {
    trace: "retry-with-trace",
    headless: true,
    locale: "en-US",
    colorScheme: "dark"
  }
});
