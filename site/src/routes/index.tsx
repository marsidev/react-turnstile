import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { Turnstile } from "@marsidev/react-turnstile";
import { Button } from "@cloudflare/kumo/components/button";
import { Input } from "@cloudflare/kumo/components/input";
import { Link } from "@cloudflare/kumo/components/link";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { InlineCode } from "~/components/inline-code";
import { Options } from "~/components/options";
import { CodeSnippet } from "~/components/playground/code-snippet";
import type { PlaygroundEvent } from "~/components/playground/event-log";
import { EventLog } from "~/components/playground/event-log";
import type { LifecycleStages } from "~/components/playground/lifecycle-rail";
import { LifecycleRail } from "~/components/playground/lifecycle-rail";
import type { IssuedToken } from "~/components/playground/token-tray";
import { TokenTray } from "~/components/playground/token-tray";
import {
  appearanceOptions,
  DEMO_SITEKEY,
  executionOptions,
  langOptions,
  refreshExpiredOptions,
  siteKeyOptions,
  sizeOptions,
  themeOptions
} from "~/lib/constants";
import { useTheme } from "~/lib/theme";
import type { Lang, SiteKeyType, Theme, WidgetSize } from "~/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Playground · React Turnstile" },
      {
        name: "description",
        content:
          "Configure the Turnstile widget, watch its lifecycle fire in real time, and leave with the exact code and a validated token."
      }
    ]
  }),
  component: Playground
});

const IDLE_STAGES: LifecycleStages = {
  rendered: false,
  interactive: false,
  solved: false,
  expired: false
};

const MAX_EVENTS = 150;

function Playground() {
  const siteTheme = useTheme().resolvedTheme;
  const [themeOverride, setThemeOverride] = useState<Theme>();
  const theme: Theme = themeOverride ?? siteTheme ?? "auto";
  const [size, setSize] = useState<WidgetSize>("normal");
  const [siteKeyType, setSiteKeyType] = useState<SiteKeyType | "custom">("pass");
  const [customKeyInput, setCustomKeyInput] = useState("");
  const [customKey, setCustomKey] = useState("");
  const [lang, setLang] = useState<Lang>("auto");
  const [execution, setExecution] = useState<"render" | "execute">("render");
  const [appearance, setAppearance] = useState<"always" | "execute" | "interaction-only">("always");
  const [refreshExpired, setRefreshExpired] = useState<"auto" | "manual" | "never">("auto");

  const [stages, setStages] = useState<LifecycleStages>(IDLE_STAGES);
  const [error, setError] = useState<string>();
  const [token, setToken] = useState<IssuedToken | null>(null);
  const [events, setEvents] = useState<PlaygroundEvent[]>([]);

  const turnstileRef = useRef<TurnstileInstance>(null);
  const eventId = useRef(0);

  const log = (name: string, detail?: string, kind: PlaygroundEvent["kind"] = "event") => {
    setEvents(prev =>
      [{ id: eventId.current++, at: Date.now(), name, detail, kind }, ...prev].slice(0, MAX_EVENTS)
    );
  };

  const reach = (stage: keyof LifecycleStages) => {
    setStages(prev => ({ ...prev, [stage]: true }));
  };

  /** A config change re-creates the widget, so the run starts over. */
  const restartRun = () => {
    setStages(IDLE_STAGES);
    setError(undefined);
    setToken(null);
  };

  const onConfigChange = (name: string, value: string, apply: () => void) => {
    apply();
    restartRun();
    log(name, value, "method");
  };

  const onChangeSize = (value: string) => {
    if (value === "invisible" && siteKeyType === "interactive") {
      // An invisible widget cannot show an interactive challenge.
      setSiteKeyType("pass");
    }
    onConfigChange("size", value, () => setSize(value as WidgetSize));
  };

  const isCustomKey = siteKeyType === "custom";
  const siteKey = isCustomKey ? customKey : DEMO_SITEKEY[siteKeyType];

  const applyCustomKey = () => {
    const trimmed = customKeyInput.trim();
    if (trimmed === customKey) return;
    setCustomKey(trimmed);
    restartRun();
    if (trimmed) log("siteKey", `custom (${trimmed.slice(0, 10)}…)`, "method");
  };

  /** The library silently no-ops these calls when no widget exists — say so instead. */
  const requireWidget = (methodName: string) => {
    if (!stages.rendered) {
      log(methodName, "no widget, call render() first", "error");
      return false;
    }
    return true;
  };

  const methods = {
    reset: () => {
      if (!requireWidget("reset()")) return;
      turnstileRef.current?.reset();
      setStages(prev => ({ ...IDLE_STAGES, rendered: prev.rendered }));
      setError(undefined);
      setToken(null);
      log("reset()", undefined, "method");
    },
    remove: () => {
      if (!requireWidget("remove()")) return;
      turnstileRef.current?.remove();
      restartRun();
      log("remove()", undefined, "method");
    },
    render: () => {
      turnstileRef.current?.render();
      log("render()", undefined, "method");
    },
    execute: () => {
      if (!requireWidget("execute()")) return;
      turnstileRef.current?.execute();
      log("execute()", undefined, "method");
    },
    getResponse: () => {
      if (!requireWidget("getResponse()")) return;
      const response = turnstileRef.current?.getResponse();
      log("getResponse()", response ? `${response.slice(0, 24)}…` : String(response), "method");
    },
    getResponsePromise: () => {
      if (!requireWidget("getResponsePromise()")) return;
      log("getResponsePromise()", "pending…", "method");
      turnstileRef.current
        ?.getResponsePromise()
        .then(response =>
          log("getResponsePromise()", `resolved ${response.slice(0, 24)}…`, "method")
        )
        .catch(reason => log("getResponsePromise()", `rejected ${String(reason)}`, "error"));
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-kumo-strong text-3xl font-semibold">Playground</h1>
      <p className="text-kumo-subtle mt-2 max-w-xl text-sm">
        Configure the widget, watch its lifecycle fire in real time, and leave with the exact code
        and a validated token.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="flex min-w-0 flex-col gap-10">
          {/* The bench: the widget under test */}
          <div className="ring-kumo-line rounded-xl ring">
            <div className="bench flex min-h-44 flex-col items-center justify-center gap-2 rounded-t-xl p-6">
              {isCustomKey && !customKey ? (
                <p className="text-kumo-subtle text-sm">
                  Enter your site key in the panel to render the widget.
                </p>
              ) : (
                <Turnstile
                  ref={turnstileRef}
                  options={{ theme, size, language: lang, execution, appearance, refreshExpired }}
                  siteKey={siteKey}
                  onBeforeInteractive={() => {
                    reach("interactive");
                    log("onBeforeInteractive");
                  }}
                  onError={reason => {
                    setError(reason);
                    log("onError", reason, "error");
                  }}
                  onExpire={() => {
                    reach("expired");
                    log("onExpire");
                  }}
                  onSuccess={value => {
                    // A fresh token starts a new cycle — clear a previous expiry
                    // (refreshExpired: "auto" re-solves right after onExpire).
                    setStages(prev => ({ ...prev, solved: true, expired: false }));
                    setToken({ value, at: Date.now() });
                    log("onSuccess", `${value.slice(0, 24)}…`);
                  }}
                  onWidgetLoad={id => {
                    // A new widget id means a fresh run: any token or stage from a
                    // previous widget (config change, HMR, render()) is stale.
                    setStages({ ...IDLE_STAGES, rendered: true });
                    setToken(null);
                    setError(undefined);
                    log("onWidgetLoad", id);
                  }}
                />
              )}
              {error && (
                <p className="text-kumo-danger text-sm" data-testid="widget-error">
                  {error}
                </p>
              )}
            </div>
            <div className="border-kumo-hairline overflow-x-auto border-t px-6 py-4">
              <LifecycleRail hasError={Boolean(error)} stages={stages} />
            </div>
          </div>

          <TokenTray
            expired={stages.expired}
            token={token}
            validationDisabled={isCustomKey}
            onValidated={response =>
              log("siteverify", response.success ? "success" : "rejected", "method")
            }
          />

          <CodeSnippet
            config={{
              siteKey: isCustomKey ? customKey || "YOUR_SITE_KEY" : siteKey,
              theme,
              size,
              lang,
              execution,
              appearance,
              refreshExpired
            }}
          />

          <EventLog events={events} onClear={() => setEvents([])} />
        </div>

        {/* Config rail */}
        <aside className="flex flex-col gap-8 self-start lg:sticky lg:top-24">
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-kumo-strong text-lg font-semibold">Configure</h2>
              <p className="text-kumo-subtle text-xs">
                Every option here is a{" "}
                <Link
                  href="https://docs.page/marsidev/react-turnstile/props#render-options"
                  rel="noreferrer"
                  target="_blank"
                >
                  render option
                </Link>
                ; the site keys are{" "}
                <Link
                  href="https://developers.cloudflare.com/turnstile/troubleshooting/testing/"
                  rel="noreferrer"
                  target="_blank"
                >
                  Cloudflare's testing keys
                </Link>
                .
              </p>
            </div>
            <Options
              name="theme"
              options={[...themeOptions]}
              title="Theme"
              value={theme}
              onChange={value =>
                onConfigChange("theme", value, () => setThemeOverride(value as Theme))
              }
            />
            <Options
              name="size"
              options={sizeOptions.map(option => ({ ...option }))}
              title="Size"
              value={size}
              onChange={onChangeSize}
            />
            <Options
              name="siteKey"
              options={[
                ...siteKeyOptions.map(option => ({
                  ...option,
                  disabled: option.value === "interactive" && size === "invisible"
                })),
                { label: "Custom site key", value: "custom" }
              ]}
              title="Site key"
              value={siteKeyType}
              onChange={value =>
                onConfigChange("siteKey", value, () =>
                  setSiteKeyType(value as SiteKeyType | "custom")
                )
              }
            />
            {isCustomKey && (
              <Input
                description={
                  <>
                    Use a test widget, not a production key, and add{" "}
                    <InlineCode>
                      {typeof window === "undefined"
                        ? "this site's hostname"
                        : window.location.hostname}
                    </InlineCode>{" "}
                    to the widget's{" "}
                    <Link
                      href="https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/"
                      rel="noreferrer"
                      target="_blank"
                    >
                      allowed hostnames
                    </Link>
                    . Applied on Enter or when leaving the field.
                  </>
                }
                label="Your site key"
                placeholder="0x4AAAAAAA…"
                value={customKeyInput}
                onBlur={applyCustomKey}
                onChange={event => setCustomKeyInput(event.target.value)}
                onKeyDown={event => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyCustomKey();
                  }
                }}
              />
            )}
            <Options
              name="lang"
              options={[...langOptions]}
              title="Language"
              value={lang}
              onChange={value => onConfigChange("language", value, () => setLang(value as Lang))}
            />
            <Options
              name="execution"
              options={[...executionOptions]}
              title="Execution"
              value={execution}
              onChange={value =>
                onConfigChange("execution", value, () =>
                  setExecution(value as "render" | "execute")
                )
              }
            />
            <Options
              name="appearance"
              options={[...appearanceOptions]}
              title="Appearance"
              value={appearance}
              onChange={value =>
                onConfigChange("appearance", value, () =>
                  setAppearance(value as "always" | "execute" | "interaction-only")
                )
              }
            />
            <Options
              name="refreshExpired"
              options={[...refreshExpiredOptions]}
              title="On token expiry"
              value={refreshExpired}
              onChange={value =>
                onConfigChange("refreshExpired", value, () =>
                  setRefreshExpired(value as "auto" | "manual" | "never")
                )
              }
            />
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-kumo-strong text-lg font-semibold">Widget methods</h2>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={methods.reset}>
                reset()
              </Button>
              <Button size="sm" variant="secondary" onClick={methods.remove}>
                remove()
              </Button>
              <Button size="sm" variant="secondary" onClick={methods.render}>
                render()
              </Button>
              <Button
                disabled={execution !== "execute"}
                size="sm"
                variant="secondary"
                onClick={methods.execute}
              >
                execute()
              </Button>
              <Button size="sm" variant="secondary" onClick={methods.getResponse}>
                getResponse()
              </Button>
              <Button size="sm" variant="secondary" onClick={methods.getResponsePromise}>
                getResponsePromise()
              </Button>
            </div>
            <p className="text-kumo-subtle text-xs">Results land in the event log.</p>
          </section>
        </aside>
      </div>
    </main>
  );
}
