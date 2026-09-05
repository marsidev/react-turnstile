import { useSyncExternalStore } from "react";

/** Reactively track a CSS media query. Assumes a match during SSR. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    onChange => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => true
  );
}
