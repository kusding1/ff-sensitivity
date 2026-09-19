"use client";

import { Moon, Sun } from "@phosphor-icons/react/dist/ssr";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[var(--line-strong)] bg-[var(--panel)] text-[var(--dim)] transition-colors hover:text-[var(--ink)]"
    >
      {isDark ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
    </button>
  );
}
