import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "~/components/header";
import { Sidebar } from "~/components/sidebar";
import { themeInitScript, ThemeProvider } from "~/lib/theme";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "React Turnstile" },
      {
        name: "description",
        content:
          "Interactive playground and examples for @marsidev/react-turnstile, a React wrapper for Cloudflare Turnstile."
      },
      { property: "og:site_name", content: "React Turnstile" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "React Turnstile" },
      {
        property: "og:description",
        content:
          "Interactive playground and examples for @marsidev/react-turnstile, a React wrapper for Cloudflare Turnstile."
      },
      { name: "twitter:card", content: "summary" },
      { name: "theme-color", media: "(prefers-color-scheme: light)", content: "#ffffff" },
      { name: "theme-color", media: "(prefers-color-scheme: dark)", content: "#171717" }
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

        <Header onToggleMobileNav={() => setMobileNavExpanded(prev => !prev)} />

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
        <HeadContent />
      </head>
      <body className="min-h-screen">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
