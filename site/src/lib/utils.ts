import { cn } from "@cloudflare/kumo/utils";

export { cn };

/**
 * Copy text to the clipboard. Returns whether it succeeded, since the write
 * can be rejected (permissions policy, unfocused document, embedded frame).
 */
export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
