import { DEFAULT_SCRIPT_ID, SCRIPT_URL } from "@marsidev/react-turnstile";
import { Button } from "@cloudflare/kumo/components/button";
import { ArrowClockwiseIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CodeBlock } from "~/components/examples/code-block";
import { LiveWidget } from "~/components/examples/live-widget";
import { InlineCode } from "~/components/inline-code";

export const Route = createFileRoute("/examples/script-loading")({
  head: () => ({
    meta: [
      { title: "Script loading · React Turnstile" },
      {
        name: "description",
        content:
          "Control how react-turnstile loads Cloudflare's script: manual injection, custom script props, and CSP nonces."
      }
    ]
  }),
  component: ScriptLoading
});

const MANUAL_SNIPPET = `<!-- Load Cloudflare's script yourself, e.g. in your document head -->
<script
  id="cf-turnstile-script"
  src="https://challenges.cloudflare.com/turnstile/v0/api.js"
  async
  defer
></script>

// …and tell the widget not to inject it again:
<Turnstile siteKey={SITE_KEY} injectScript={false} />`;

const SCRIPT_OPTIONS_SNIPPET = `<Turnstile
  siteKey={SITE_KEY}
  scriptOptions={{
    id: "my-turnstile-script",       // the script tag's id
    appendTo: "body",                // "head" (default) or "body"
    defer: false,                    // defer / async default to true
    onLoadCallbackName: "myOnLoad"   // name of the global onload callback
  }}
/>`;

const NONCE_SNIPPET = `// With a strict Content-Security-Policy, tag the injected
// script with your per-request nonce so the browser runs it:
<Turnstile siteKey={SITE_KEY} scriptOptions={{ nonce: cspNonce }} />`;

function ScriptLoading() {
  const [runId, setRunId] = useState(0);

  // What the snippet's <script> tag does, done from an effect since this is a
  // client-routed page. Skipped when another page already loaded the script.
  useEffect(() => {
    if (window.turnstile || document.getElementById(DEFAULT_SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = DEFAULT_SCRIPT_ID;
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    document.head.append(script);
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-kumo-strong text-3xl font-semibold">Script loading</h1>
      <p className="text-kumo-subtle mt-2 text-sm">
        By default the component injects Cloudflare's <InlineCode>api.js</InlineCode> into the page
        for you. <InlineCode>scriptOptions</InlineCode> and <InlineCode>injectScript</InlineCode>{" "}
        control how that script tag is created, or let you take over entirely.
      </p>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="text-kumo-strong text-lg font-semibold">Manual script injection</h2>
        <p className="text-kumo-default text-sm">
          Ship the script tag yourself (from your HTML, your framework's script loader, or earlier
          in the page lifecycle) and pass <InlineCode>injectScript=&#123;false&#125;</InlineCode> so
          the widget waits for your script instead of adding its own. Keep the tag's id at the
          default <InlineCode>cf-turnstile-script</InlineCode>, or point the widget at yours with{" "}
          <InlineCode>scriptOptions.id</InlineCode>.
        </p>
        <CodeBlock code={MANUAL_SNIPPET} />
        <div className="ring-kumo-line rounded-xl ring">
          <div className="bench flex min-h-44 items-center justify-center rounded-t-xl p-6">
            <LiveWidget
              key={`manual-injection-${runId}`}
              id="manual-injection"
              injectScript={false}
            />
          </div>
          <div className="border-kumo-hairline flex items-center justify-between gap-3 border-t px-6 py-3">
            <p className="text-kumo-subtle text-sm">
              This widget renders with <InlineCode>injectScript=&#123;false&#125;</InlineCode>; the
              script tag comes from this page, not from the component.
            </p>
            <Button
              icon={<ArrowClockwiseIcon size={16} />}
              size="sm"
              variant="secondary"
              onClick={() => setRunId(id => id + 1)}
            >
              Reload widget
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="text-kumo-strong text-lg font-semibold">Custom script props</h2>
        <p className="text-kumo-default text-sm">
          When the component does the injecting, <InlineCode>scriptOptions</InlineCode> shapes the
          tag it creates. The widget behaves identically; only the script tag differs.
        </p>
        <CodeBlock code={SCRIPT_OPTIONS_SNIPPET} />
      </section>

      <section className="mt-10 flex flex-col gap-3">
        <h2 className="text-kumo-strong text-lg font-semibold">CSP nonce</h2>
        <p className="text-kumo-default text-sm">
          Sites that enforce a Content-Security-Policy without{" "}
          <InlineCode>'unsafe-inline'</InlineCode> can pass their nonce through{" "}
          <InlineCode>scriptOptions.nonce</InlineCode>; it's set on the injected script tag so the
          policy allows it.
        </p>
        <CodeBlock code={NONCE_SNIPPET} />
      </section>
    </main>
  );
}
