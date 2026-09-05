import { createFileRoute, redirect } from "@tanstack/react-router";

// The playground moved to the home page.
export const Route = createFileRoute("/playground")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  }
});
