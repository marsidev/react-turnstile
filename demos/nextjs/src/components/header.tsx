"use client";

import { MenuIcon } from "lucide-react";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { mobileNavExpandedAtom } from "~/store";
import { cn } from "~/utils";
import Link from "./link";
import { ThemeToggle } from "./theme-toggle";
import { Button, buttonVariants } from "./button";

export default function Header() {
  const [mobileNavExpanded, setMobileNavExpanded] = useAtom(mobileNavExpandedAtom);

  useEffect(() => {
    const root = window.document.body;

    if (mobileNavExpanded) {
      if (!root.classList.contains("overflow-hidden")) root.classList.add("overflow-hidden");
    } else {
      if (root.classList.contains("overflow-hidden")) root.classList.remove("overflow-hidden");
    }
  }, [mobileNavExpanded]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 shadow-sm backdrop-blur dark:border-slate-800">
      <div className="max-w-8xl relative z-10 mx-auto">
        <div className="mx-4 flex h-16 items-center px-4 lg:mx-0 lg:px-8">
          <Link
            className="hover:text-cloudflare-light-400 focus:ring-cloudflare-light-600 dark:hover:text-cloudflare-400 dark:focus:ring-cloudflare-500 rounded-md px-2 py-1 text-gray-800 no-underline focus:outline-none focus-visible:ring-4 dark:text-white"
            href="/"
          >
            <span className="text-md truncate font-bold sm:text-lg lg:text-xl">
              React Turnstile Demo
            </span>
          </Link>

          <div className="flex flex-1 shrink-0 items-center justify-end gap-2">
            <Link
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-gray-800 hover:text-white dark:text-white dark:hover:text-white"
              )}
              href="https://github.com/marsidev/react-turnstile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </Link>

            <ThemeToggle />

            <div className="flex items-center lg:hidden">
              <Button
                aria-label="Toggle menu visibility"
                size="sm"
                variant="ghost"
                onClick={() => setMobileNavExpanded(prev => !prev)}
              >
                <MenuIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
