import { Button } from "@cloudflare/kumo/components/button";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { CODE_COLORS } from "~/lib/highlight";
import type { Lang, WidgetSize } from "~/lib/types";

export interface SnippetConfig {
  siteKey: string;
  theme: string;
  size: WidgetSize;
  lang: Lang;
  execution: "render" | "execute";
  appearance: "always" | "execute" | "interaction-only";
  refreshExpired: "auto" | "manual" | "never";
}

interface Segment {
  text: string;
  color?: string;
}

const COLORS = CODE_COLORS;

function optionEntries(config: SnippetConfig): Array<[string, string]> {
  const entries: Array<[string, string]> = [["theme", config.theme]];
  if (config.size !== "normal") entries.push(["size", config.size]);
  if (config.lang !== "auto") entries.push(["language", config.lang]);
  if (config.execution === "execute") entries.push(["execution", config.execution]);
  if (config.appearance !== "always") entries.push(["appearance", config.appearance]);
  if (config.refreshExpired !== "auto") entries.push(["refreshExpired", config.refreshExpired]);
  return entries;
}

function buildOptionLines(options: Array<[string, string]>): Segment[][] {
  // Up to two options fit on one line; more read better one per line.
  if (options.length <= 2) {
    return [
      [
        { text: "  " },
        { text: "options", color: COLORS.attr },
        { text: "={{ " },
        ...options.flatMap(([key, value], index): Segment[] => [
          { text: index === 0 ? "" : ", " },
          { text: key, color: COLORS.attr },
          { text: ": " },
          { text: `"${value}"`, color: COLORS.string }
        ]),
        { text: " }}" }
      ]
    ];
  }

  return [
    [{ text: "  " }, { text: "options", color: COLORS.attr }, { text: "={{" }],
    ...options.map(([key, value]): Segment[] => [
      { text: "    " },
      { text: key, color: COLORS.attr },
      { text: ": " },
      { text: `"${value}"`, color: COLORS.string },
      { text: "," }
    ]),
    [{ text: "  }}" }]
  ];
}

function buildLines(config: SnippetConfig): Segment[][] {
  const options = optionEntries(config);

  return [
    [
      { text: "import", color: COLORS.keyword },
      { text: " { Turnstile } " },
      { text: "from", color: COLORS.keyword },
      { text: " " },
      { text: '"@marsidev/react-turnstile"', color: COLORS.string },
      { text: ";" }
    ],
    [],
    [{ text: "<" }, { text: "Turnstile", color: COLORS.component }],
    [
      { text: "  " },
      { text: "siteKey", color: COLORS.attr },
      { text: "=" },
      { text: `"${config.siteKey || ""}"`, color: COLORS.string }
    ],
    ...buildOptionLines(options),
    [
      { text: "  " },
      { text: "onSuccess", color: COLORS.attr },
      { text: "={" },
      { text: "token", color: COLORS.attr },
      { text: " " },
      { text: "=>", color: COLORS.keyword },
      { text: " setToken(token)}" }
    ],
    [{ text: "/>" }]
  ];
}

/** The exact JSX for the current configuration, ready to paste. */
export function CodeSnippet({ config }: { config: SnippetConfig }) {
  const [copied, setCopied] = useState(false);
  const lines = buildLines(config);
  const raw = lines.map(line => line.map(segment => segment.text).join("")).join("\n");

  const onCopy = async () => {
    await navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section data-testid="code-snippet">
      <div className="flex items-center justify-between">
        <h2 className="text-kumo-strong text-lg font-semibold">The code for this widget</h2>
        <Button
          icon={copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
          size="sm"
          variant="ghost"
          onClick={onCopy}
        >
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <pre className="bg-kumo-tint ring-kumo-line dark:bg-kumo-neutral-1000 mt-2 overflow-x-auto rounded-lg p-4 font-mono text-sm leading-6 ring">
        {lines.map((line, lineIndex) => (
          <div key={lineIndex} className={COLORS.plain}>
            {line.length === 0
              ? " "
              : line.map((segment, segmentIndex) => (
                  <span key={segmentIndex} className={segment.color}>
                    {segment.text}
                  </span>
                ))}
          </div>
        ))}
      </pre>
    </section>
  );
}
