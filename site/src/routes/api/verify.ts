import type { TurnstileServerValidationResponse } from "@marsidev/react-turnstile";
import { createFileRoute } from "@tanstack/react-router";

const verifyEndpoint = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const Route = createFileRoute("/api/verify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { token, secret } = (await request.json()) as { token: string; secret: string };

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
