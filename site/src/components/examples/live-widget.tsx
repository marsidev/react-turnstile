import type { TurnstileProps } from "@marsidev/react-turnstile";
import { Turnstile } from "@marsidev/react-turnstile";
import { useState } from "react";
import { DEMO_SITEKEY } from "~/lib/constants";
import { useTheme } from "~/lib/theme";
import type { WidgetSize } from "~/lib/types";

interface LiveWidgetProps {
  id: string;
  size?: WidgetSize;
  injectScript?: TurnstileProps["injectScript"];
  scriptOptions?: TurnstileProps["scriptOptions"];
  onLoad?: () => void;
}

/** A demo widget with a one-line status readout, themed with the site. */
export function LiveWidget({
  id,
  size = "normal",
  injectScript,
  scriptOptions,
  onLoad
}: LiveWidgetProps) {
  const siteTheme = useTheme().resolvedTheme;
  const [status, setStatus] = useState("loading…");

  return (
    <div className="flex flex-col items-center gap-2" data-testid={`live-widget-${id}`}>
      <Turnstile
        id={id}
        injectScript={injectScript}
        scriptOptions={scriptOptions}
        siteKey={DEMO_SITEKEY.pass}
        options={{ theme: siteTheme ?? "auto", size }}
        onError={reason => setStatus(`error · ${reason}`)}
        onSuccess={token => setStatus(`solved · ${token.slice(0, 16)}…`)}
        onWidgetLoad={widgetId => {
          setStatus(`ready · ${widgetId}`);
          onLoad?.();
        }}
      />
      <span className="text-kumo-subtle font-mono text-xs">{status}</span>
    </div>
  );
}
