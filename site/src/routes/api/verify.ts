import type { TurnstileServerValidationResponse } from "@marsidev/react-turnstile";
import { createFileRoute } from "@tanstack/react-router";
import { DEMO_SECRET } from "~/lib/constants";

const verifyEndpoint = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// The playground only ever validates with Cloudflare's testing secrets (custom
// site keys have validation disabled), so anything else is someone trying to
// use this Worker as a siteverify relay.
const ALLOWED_SECRETS = new Set<string>(Object.values(DEMO_SECRET));

export const Route = createFileRoute("/api/verify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as {
          token?: unknown;
          secret?: unknown;
        } | null;
        const { token, secret } = body ?? {};

        if (typeof token !== "string" || typeof secret !== "string") {
          return Response.json(
            { success: false, "error-codes": ["invalid-input"] },
            { status: 400 }
          );
        }
        if (!ALLOWED_SECRETS.has(secret)) {
          return Response.json(
            { success: false, "error-codes": ["testing-secrets-only"] },
            { status: 400 }
          );
        }

        let data: TurnstileServerValidationResponse;
        try {
          const res = await fetch(verifyEndpoint, {
            method: "POST",
            body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
            headers: {
              "content-type": "application/x-www-form-urlencoded"
            }
          });
          data = (await res.json()) as TurnstileServerValidationResponse;
        } catch {
          return Response.json(
            { success: false, "error-codes": ["upstream-error"] },
            { status: 502 }
          );
        }

        return Response.json(data, { status: data.success ? 200 : 400 });
      }
    }
  }
});
