import { expect, test } from "@playwright/test";
import { DEMO_SECRET } from "../../site/src/lib/constants";
import { SITE_URL } from "../../site/src/lib/seo";

// These run against `vite preview`, so the server routes execute in workerd,
// the same runtime as production.

test("robots.txt points crawlers at the sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/plain");

  const body = await response.text();
  expect(body).toContain("Disallow: /api/");
  expect(body).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
});

test("the sitemap lists every page in the nav", async ({ request }) => {
  const response = await request.get("/sitemap.xml");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("xml");

  const body = await response.text();
  for (const path of ["/", "/examples/multiple-widgets", "/examples/script-loading"]) {
    expect(body).toContain(`<loc>${SITE_URL}${path === "/" ? "/" : path}</loc>`);
  }
});

test("every page declares its own canonical url", async ({ request }) => {
  const pages = [
    ["/", `${SITE_URL}/`],
    ["/examples/multiple-widgets", `${SITE_URL}/examples/multiple-widgets`]
  ] as const;

  for (const [path, canonical] of pages) {
    const html = await (await request.get(path)).text();
    expect(html).toMatch(new RegExp(`<link[^>]*rel="canonical"[^>]*href="${canonical}"`));
    expect(html).toContain(`content="${SITE_URL}/og.png"`);
  }
});

test("the old playground path still resolves to the home page", async ({ request }) => {
  const response = await request.get("/playground");

  expect(response.status()).toBe(200);
  expect(new URL(response.url()).pathname).toBe("/");
});

test.describe("/api/verify", () => {
  test("verifies a token with one of Cloudflare's testing secrets", async ({ request }) => {
    const response = await request.post("/api/verify", {
      data: { token: "XXXX.DUMMY.TOKEN.XXXX", secret: DEMO_SECRET.pass }
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ success: true });
  });

  test("refuses to relay anything but a testing secret", async ({ request }) => {
    const response = await request.post("/api/verify", {
      data: { token: "XXXX.DUMMY.TOKEN.XXXX", secret: "0x000000000000000000000000000000000" }
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toMatchObject({ "error-codes": ["testing-secrets-only"] });
  });

  test("rejects a body that is not a token and a secret", async ({ request }) => {
    const response = await request.post("/api/verify", { data: { token: 42 } });

    expect(response.status()).toBe(400);
    expect(await response.json()).toMatchObject({ "error-codes": ["invalid-input"] });
  });
});
