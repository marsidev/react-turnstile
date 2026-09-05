import { Button } from "@cloudflare/kumo/components/button";
import { DropdownMenu } from "@cloudflare/kumo/components/dropdown";
import { MonitorIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "~/lib/theme";
import type { Theme } from "~/lib/types";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "auto", label: "System", icon: MonitorIcon }
] as const;

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger
        render={<Button aria-label="Change theme" shape="square" variant="ghost" />}
      >
        {resolvedTheme === "dark" ? <MoonIcon size={20} /> : <SunIcon size={20} />}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.RadioGroup value={theme} onValueChange={value => setTheme(value as Theme)}>
          <DropdownMenu.Label>Theme</DropdownMenu.Label>
          {THEME_OPTIONS.map(option => (
            <DropdownMenu.RadioItem
              key={option.value}
              closeOnClick
              icon={option.icon}
              value={option.value}
            >
              {option.label}
              <DropdownMenu.RadioItemIndicator />
            </DropdownMenu.RadioItem>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
