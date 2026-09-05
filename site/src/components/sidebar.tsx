import { Link as KumoLink } from "@cloudflare/kumo/components/link";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { navGroups } from "~/lib/constants";
import { cn } from "~/lib/utils";

interface SidebarProps {
  mobileNavExpanded: boolean;
  onClose: () => void;
}

const INSTALL_COMMAND = "npm i @marsidev/react-turnstile";

/** The whole row is the copy target, sized so the full command stays visible. */
function InstallCommand() {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      aria-label="Copy install command"
      className="ring-kumo-line hover:bg-kumo-tint flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 ring"
      type="button"
      onClick={onCopy}
    >
      <code className="text-kumo-strong font-mono text-xs">{INSTALL_COMMAND}</code>
      {copied ? (
        <CheckIcon className="text-kumo-subtle shrink-0" size={14} />
      ) : (
        <CopyIcon className="text-kumo-subtle shrink-0" size={14} />
      )}
    </button>
  );
}

export function Sidebar({ mobileNavExpanded, onClose }: SidebarProps) {
  return (
    <aside
      className={cn(
        "border-kumo-line bg-kumo-base fixed top-16 bottom-0 left-0 z-10 flex w-80 -translate-x-full flex-col justify-between overflow-y-auto border-r px-6 py-8 transition-transform lg:translate-x-0",
        { "translate-x-0 shadow-lg": mobileNavExpanded }
      )}
    >
      <nav className="flex flex-col gap-5">
        {navGroups.map((group, groupIndex) => (
          <div key={group.title ?? groupIndex}>
            {group.title && (
              <p className="text-kumo-subtle px-3 pb-1 text-xs font-medium">{group.title}</p>
            )}
            <ul className="flex flex-col gap-1 text-sm">
              {group.pages.map(page => (
                <li key={page.href}>
                  <Link
                    activeOptions={{ exact: page.href === "/" }}
                    activeProps={{ className: "bg-kumo-tint text-kumo-strong font-medium" }}
                    className="text-kumo-default hover:bg-kumo-tint block rounded-md px-3 py-2 no-underline"
                    to={page.href}
                    onClick={onClose}
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <footer className="flex flex-col gap-3">
        <InstallCommand />
        <div className="text-kumo-subtle flex items-center justify-between text-xs">
          <KumoLink
            className="font-mono"
            href="https://github.com/marsidev/react-turnstile/releases"
            rel="noreferrer"
            target="_blank"
          >
            v{__LIB_VERSION__}
          </KumoLink>
          <div className="flex gap-3">
            <KumoLink
              href="https://docs.page/marsidev/react-turnstile/"
              rel="noreferrer"
              target="_blank"
            >
              Docs
            </KumoLink>
            <KumoLink
              href="https://www.npmjs.com/package/@marsidev/react-turnstile"
              rel="noreferrer"
              target="_blank"
            >
              npm
            </KumoLink>
            <KumoLink href="https://github.com/marsidev" rel="noreferrer" target="_blank">
              @marsidev
            </KumoLink>
          </div>
        </div>
      </footer>
    </aside>
  );
}
