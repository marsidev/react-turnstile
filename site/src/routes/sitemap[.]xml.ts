import { createFileRoute } from "@tanstack/react-router";
import { navGroups } from "~/lib/constants";
import { canonicalUrl } from "~/lib/seo";

// Generated from the same nav the sidebar renders, so a new page is listed the
// moment it is linked. `/playground` is left out on purpose: it only redirects.
const urls = navGroups.flatMap(group => group.pages.map(page => canonicalUrl(page.href)));

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>
`;

        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600"
          }
        });
      }
    }
  }
});
