import { useEffect, useState } from "react";

const REPO = "marsidev/react-turnstile";
const CACHE_KEY = "gh-stars";
const CACHE_TTL = 60 * 60 * 1000;

interface CachedStars {
  count: number;
  at: number;
}

/** Star count for the repo, cached in localStorage for an hour per visitor. */
export function useGithubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null") as CachedStars | null;
      if (cached && Date.now() - cached.at < CACHE_TTL) {
        setStars(cached.count);
        return;
      }
    } catch {
      // Unreadable cache; fetch instead.
    }

    fetch(`https://api.github.com/repos/${REPO}`)
      .then(res => (res.ok ? (res.json() as Promise<{ stargazers_count?: number }>) : null))
      .then(data => {
        if (typeof data?.stargazers_count !== "number") return;
        setStars(data.stargazers_count);
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ count: data.stargazers_count, at: Date.now() } satisfies CachedStars)
          );
        } catch {
          // Storage unavailable; skip the cache.
        }
      })
      .catch(() => {
        // Offline or rate limited; the pill just shows no count.
      });
  }, []);

  return stars;
}

export function formatStars(count: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(
    count
  );
}
