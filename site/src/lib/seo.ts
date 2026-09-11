/** The production origin. Absolute URLs (canonical, og:url, og:image, sitemap)
 * have to be baked in: crawlers and social scrapers reject relative ones. */
export const SITE_URL = "https://turnstile.marsidev.com";

export const SITE_NAME = "React Turnstile";

export const SITE_DESCRIPTION =
  "Interactive playground and examples for @marsidev/react-turnstile, a React wrapper for Cloudflare Turnstile.";

/** Absolute URL for a route path, in the same shape the site links to and the
 * sitemap lists: no trailing slash except on the home page. */
export function canonicalUrl(path: string) {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** Per-page head tags: title, description, and the absolute URLs that identify
 * the page. Site-wide tags that never vary per route (og:image, og:site_name,
 * twitter:card) live in the root route, so nothing here collides with them. */
export function seo({
  title,
  description,
  path
}: {
  title: string;
  description: string;
  /** Route path with a leading slash, e.g. `/examples/script-loading`. */
  path: string;
}) {
  const url = canonicalUrl(path);
  const fullTitle = `${title} · ${SITE_NAME}`;

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description }
    ],
    links: [{ rel: "canonical", href: url }]
  };
}
