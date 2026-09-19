import { CrosshairSimple } from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-b from-[#ff7a18] to-[#f4500a] text-white shadow-[0_8px_20px_-6px_rgba(244,80,10,0.6)]">
            <CrosshairSimple size={20} weight="bold" />
          </div>
          <div className="leading-none">
            <div className="font-poster text-[19px] tracking-wide">
              FF Sensitivity
            </div>
            <div className="mt-1 text-[12.5px] text-[var(--mute)]">
              OB55, mỗi máy một số riêng
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-[var(--line)] px-3 py-1.5 text-[13px] text-[var(--dim)] sm:flex">
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-full bg-[var(--volt)]"
            />
            Vô là chiến
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
