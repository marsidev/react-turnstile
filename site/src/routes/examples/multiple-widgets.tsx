import { SCRIPT_URL } from "@marsidev/react-turnstile";
import { Button } from "@cloudflare/kumo/components/button";
import { ArrowClockwiseIcon } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CodeBlock } from "~/components/examples/code-block";
import { LiveWidget } from "~/components/examples/live-widget";
import { InlineCode } from "~/components/inline-code";

export const Route = createFileRoute("/examples/multiple-widgets")({
  head: () => ({
    meta: [
      { title: "Multiple widgets · React Turnstile" },
      {
        name: "description",
        content:
          "Mount any number of Turnstile widgets on one page; the library loads Cloudflare's script exactly once."
      }
    ]
  }),
  component: MultipleWidgets
});

const SNIPPET = `import { Turnstile } from "@marsidev/react-turnstile";

// The first widget to mount injects Cloudflare's api.js;
// every later widget reuses the same script.
<Turnstile id="widget-1" siteKey={SITE_KEY} />
<Turnstile id="widget-2" siteKey={SITE_KEY} options={{ size: "compact" }} />`;

function MultipleWidgets() {
  const [scriptCount, setScriptCount] = useState<number | null>(null);
  const [runId, setRunId] = useState(0);

  const recount = () => {
    setScriptCount(document.querySelectorAll(`script[src^="${SCRIPT_URL}"]`).length);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-kumo-strong text-3xl font-semibold">Multiple widgets</h1>
      <p className="text-kumo-subtle mt-2 text-sm">
        Any number of <InlineCode>{"<Turnstile>"}</InlineCode> components can mount on one page, and
        the library loads Cloudflare's script exactly once. Give each widget its own{" "}
        <InlineCode>id</InlineCode> so their containers don't collide.
      </p>

      <div className="ring-kumo-line mt-8 rounded-xl ring">
        <div className="bench flex min-h-44 flex-wrap items-center justify-center gap-8 rounded-t-xl p-6">
          <LiveWidget key={`widget-1-${runId}`} id="widget-1" onLoad={recount} />
          <LiveWidget key={`widget-2-${runId}`} id="widget-2" size="compact" onLoad={recount} />
        </div>
        <div className="border-kumo-hairline flex items-center justify-between gap-3 border-t px-6 py-3">
          <p className="text-kumo-subtle font-mono text-xs" data-testid="script-count">
            {scriptCount === null
              ? "counting script tags…"
              : `2 widgets · ${scriptCount} script tag${scriptCount === 1 ? "" : "s"} in this page's DOM`}
          </p>
          <Button
            icon={<ArrowClockwiseIcon size={16} />}
            size="sm"
            variant="secondary"
            onClick={() => setRunId(id => id + 1)}
          >
            Reload widgets
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <CodeBlock code={SNIPPET} />
      </div>

      <p className="text-kumo-subtle mt-6 text-sm">
        This also holds when you load the script yourself: pass{" "}
        <InlineCode>injectScript=&#123;false&#125;</InlineCode> to every widget and ship one script
        tag. See{" "}
        <Link className="text-kumo-default underline" to="/examples/script-loading">
          Script loading
        </Link>
        .
      </p>
    </main>
  );
}
