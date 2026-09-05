import { Button } from "@cloudflare/kumo/components/button";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { CODE_COLORS, tokenizeLine } from "~/lib/highlight";
import { copyToClipboard } from "~/lib/utils";

/** A static code sample in the same slab style as the playground snippet. */
export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!(await copyToClipboard(code))) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative">
      <pre className="bg-kumo-tint ring-kumo-line dark:bg-kumo-neutral-1000 overflow-x-auto rounded-lg p-4 font-mono text-sm leading-6 ring">
        {code.split("\n").map((line, lineIndex) => (
          <div key={lineIndex} className={CODE_COLORS.plain}>
            {line
              ? tokenizeLine(line).map((token, tokenIndex) => (
                  <span key={tokenIndex} className={token.color}>
                    {token.text}
                  </span>
                ))
              : " "}
          </div>
        ))}
      </pre>
      <div className="absolute top-2 right-2">
        <Button
          icon={copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
          size="sm"
          variant="ghost"
          onClick={onCopy}
        >
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
