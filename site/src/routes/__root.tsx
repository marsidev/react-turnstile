import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "~/components/header";
import { Sidebar } from "~/components/sidebar";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "~/lib/seo";
import { themeInitScript, ThemeProvider } from "~/lib/theme";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      // Title and description are per route (see `~/lib/seo`); these are the
      // fallbacks for anything that renders without its own head.
      { title: SITE_NAME },
      { name: "description", content: SITE_DESCRIPTION },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${SITE_URL}/og.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "React Turnstile" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_URL}/og.png` }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      // Every page renders the widget; warming the connection saves a round trip.
      { rel: "preconnect", href: "https://challenges.cloudflare.com" }
    ],
    scripts: [{ children: themeInitScript }]
  }),
  component: RootComponent
});

function RootComponent() {
  const [mobileNavExpanded, setMobileNavExpanded] = useState(false);

  return (
    <RootDocument>
      <ThemeProvider>
        <a
          className="focus:bg-kumo-base focus:ring-kumo-line sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:px-3 focus:py-2 focus:ring"
          href="#content"
        >
          Skip to content
        </a>

        <Header
          mobileNavExpanded={mobileNavExpanded}
          onToggleMobileNav={() => setMobileNavExpanded(prev => !prev)}
        />

        <Sidebar
          mobileNavExpanded={mobileNavExpanded}
          onClose={() => setMobileNavExpanded(false)}
        />

        <div className="lg:pl-80" id="content">
          <Outlet />
        </div>
      </ThemeProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: React.PropsWithChildren) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <meta content="#ffffff" media="(prefers-color-scheme: light)" name="theme-color" />
        <meta content="#171717" media="(prefers-color-scheme: dark)" name="theme-color" />
        <HeadContent />
      </head>
      <body className="min-h-screen">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
