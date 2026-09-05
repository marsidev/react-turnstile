import type { ReactNode } from "react";

/** Inline code as a small chip, so it stands apart from the surrounding text. */
export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="bg-kumo-tint ring-kumo-line rounded px-1 font-mono text-[0.9em] ring ring-inset">
      {children}
    </code>
  );
}
