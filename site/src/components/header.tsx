import { Button, LinkButton } from "@cloudflare/kumo/components/button";
import { GithubLogoIcon, ListIcon, StarIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { formatStars, useGithubStars } from "~/lib/use-github-stars";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  onToggleMobileNav: () => void;
}

export function Header({ onToggleMobileNav }: HeaderProps) {
  const stars = useGithubStars();

  return (
    <header className="border-kumo-line bg-kumo-base/80 sticky top-0 z-20 border-b backdrop-blur">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <Link className="text-kumo-strong rounded-md px-2 py-1 no-underline" to="/">
          <span className="truncate text-base font-semibold sm:text-lg">React Turnstile</span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-1">
          <LinkButton
            external
            aria-label="Star marsidev/react-turnstile on GitHub"
            href="https://github.com/marsidev/react-turnstile"
            variant="ghost"
          >
            <GithubLogoIcon size={20} />
            <span className="hidden font-mono text-xs md:inline">marsidev/react-turnstile</span>
            {stars !== null && (
              <span className="text-kumo-subtle flex items-center gap-1 text-xs">
                <StarIcon size={14} />
                {formatStars(stars)}
              </span>
            )}
          </LinkButton>

          <ThemeToggle />

          <div className="flex items-center lg:hidden">
            <Button
              aria-label="Toggle menu visibility"
              shape="square"
              variant="ghost"
              onClick={onToggleMobileNav}
            >
              <ListIcon size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
