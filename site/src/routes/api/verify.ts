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
        const { token, secret } = (await request.json()) as { token: string; secret: string };

        if (!ALLOWED_SECRETS.has(secret)) {
          return Response.json(
            { success: false, "error-codes": ["testing-secrets-only"] },
            { status: 400 }
          );
        }

        const data = (await fetch(verifyEndpoint, {
          method: "POST",
          body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
          headers: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }).then(res => res.json())) as TurnstileServerValidationResponse;

        return Response.json(data, { status: data.success ? 200 : 400 });
      }
    }
  }
});
