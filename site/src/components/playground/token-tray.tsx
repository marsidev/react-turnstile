import type { TurnstileServerValidationResponse } from "@marsidev/react-turnstile";
import { Button } from "@cloudflare/kumo/components/button";
import { ClipboardText } from "@cloudflare/kumo/components/clipboard-text";
import { useEffect, useRef, useState } from "react";
import { InlineCode } from "~/components/inline-code";
import { DEMO_SECRET, secretOptions } from "~/lib/constants";
import type { SecretKeyType } from "~/lib/types";
import { Options } from "../options";

export interface IssuedToken {
  value: string;
  at: number;
}

/** Turnstile tokens are valid for 300 seconds after issue. */
const TOKEN_TTL_SECONDS = 300;

interface TokenTrayProps {
  token: IssuedToken | null;
  expired: boolean;
  onValidated: (response: TurnstileServerValidationResponse) => void;
  /** Custom site keys can't be validated here — that needs the widget's secret key. */
  validationDisabled?: boolean;
}

function useRemainingSeconds(token: IssuedToken | null, expired: boolean) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!token || expired) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [token, expired]);

  if (!token) return null;
  const elapsed = Math.max(0, Math.floor((now - token.at) / 1000));
  return Math.max(0, TOKEN_TTL_SECONDS - elapsed);
}

function formatCountdown(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

/** The bench's output: the issued token, its remaining validity, and server-side validation. */
export function TokenTray({ token, expired, onValidated, validationDisabled }: TokenTrayProps) {
  const [secretType, setSecretType] = useState<SecretKeyType>("pass");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<TurnstileServerValidationResponse | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const currentToken = useRef<string | null>(null);
  const remaining = useRemainingSeconds(token, expired);

  // A new (or cleared) token invalidates the previous server response.
  useEffect(() => {
    currentToken.current = token?.value ?? null;
    setResponse(null);
    setRequestError(null);
  }, [token]);

  const onValidate = async () => {
    if (!token) return;
    const requested = token.value;
    setLoading(true);
    setResponse(null);
    setRequestError(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        body: JSON.stringify({ token: requested, secret: DEMO_SECRET[secretType] }),
        headers: { "content-type": "application/json" }
      });
      const data = (await res.json()) as TurnstileServerValidationResponse;
      // The token may have been replaced while this request was in flight;
      // a result for the old token would be misleading next to the new one.
      if (currentToken.current !== requested) return;
      setResponse(data);
      onValidated(data);
    } catch {
      if (currentToken.current !== requested) return;
      setRequestError("Validation request failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section data-testid="token-tray">
      <h2 className="text-kumo-strong text-lg font-semibold">Token</h2>

      {!token ? (
        <p className="text-kumo-subtle mt-2 text-sm">
          Solve the challenge above and the token appears here.
        </p>
      ) : (
        <div className="mt-2 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <ClipboardText
                size="sm"
                text={`${token.value.slice(0, 28)}…${token.value.slice(-6)}`}
                textToCopy={token.value}
              />
            </div>
            <span
              className="text-kumo-subtle shrink-0 font-mono text-xs"
              data-testid="token-countdown"
            >
              {expired
                ? "expired"
                : remaining === 0
                  ? // Real tokens (custom keys) do expire; the caveat is only true
                    // for Cloudflare's demo tokens.
                    validationDisabled
                    ? "0:00"
                    : "0:00 (demo tokens never expire)"
                  : remaining !== null && `expires in ${formatCountdown(remaining)}`}
            </span>
          </div>

          {validationDisabled ? (
            <p className="text-kumo-subtle text-sm">
              Server-side validation is off for custom site keys, since it needs your widget's
              secret key and that should never leave your server. Validate this token yourself
              against <InlineCode>challenges.cloudflare.com/turnstile/v0/siteverify</InlineCode>.
            </p>
          ) : (
            <div className="flex flex-wrap items-end gap-3">
              <Options
                name="secret"
                options={[...secretOptions]}
                title="Server secret"
                value={secretType}
                onChange={value => setSecretType(value as SecretKeyType)}
              />
              <Button disabled={loading} variant="primary" onClick={onValidate}>
                Validate token
              </Button>
            </div>
          )}

          {requestError && (
            <p className="text-kumo-danger text-sm" data-testid="validation-error">
              {requestError}
            </p>
          )}

          {response && (
            <pre className="bg-kumo-tint ring-kumo-line overflow-x-auto rounded-lg p-3 font-mono text-xs ring">
              {JSON.stringify(response, null, 2)}
            </pre>
          )}
        </div>
      )}
    </section>
  );
}
