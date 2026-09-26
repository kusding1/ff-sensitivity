"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkle } from "@phosphor-icons/react/dist/ssr";

const AD_KEY = "05d3deee1d0f7c60ead54481f5c444aa";
const WIDTH = 300;
const HEIGHT = 250;
const SMARTLINK =
  "https://www.profitableratecpmnetwork.com/dfnkyaqgqh?key=7857993e19ebc8a71d8db78533c3ac29";

type AdWindow = Window & {
  atOptions?: unknown;
  __kusdingAdChain?: Promise<void>;
};

export function AdGate({ onUnlock }: { onUnlock: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [, setReady] = useState(false);

  useEffect(() => {
    const w = window as AdWindow;
    const fallback = setTimeout(() => setReady(true), 6000);
    w.__kusdingAdChain = (w.__kusdingAdChain ?? Promise.resolve()).then(
      () =>
        new Promise<void>((resolve) => {
          const host = hostRef.current;
          if (!host) {
            resolve();
            return;
          }
          w.atOptions = {
            key: AD_KEY,
            format: "iframe",
            height: HEIGHT,
            width: WIDTH,
            params: {},
          };
          const s = document.createElement("script");
          s.async = true;
          s.src = `https://www.highrevenueformat.com/${AD_KEY}/invoke.js`;
          s.onload = () => {
            clearTimeout(fallback);
            setReady(true);
            resolve();
          };
          s.onerror = () => {
            clearTimeout(fallback);
            setReady(true);
            resolve();
          };
          host.appendChild(s);
        })
    );
    return () => clearTimeout(fallback);
  }, []);

  return (
    <div className="mt-5 flex flex-col items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/[0.02] p-5 text-center">
      <p className="text-[13.5px] leading-relaxed text-[var(--mute)]">
        Kết quả đã dựng xong. Bấm <b className="text-[var(--fg)]">Xem kết
        quả</b> — quảng cáo sẽ mở ở tab mới, kết quả hiện ngay.
      </p>

      <div
        ref={hostRef}
        className="mx-auto overflow-hidden rounded-xl"
        style={{ width: WIDTH, height: HEIGHT, maxWidth: "100%" }}
        aria-label="quảng cáo"
      />

      <a
        href={SMARTLINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onUnlock}
        className="group inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3 text-[14px] font-bold text-black transition-all hover:scale-[1.03] active:scale-[0.98]"
      >
        <Sparkle size={18} weight="fill" aria-hidden />
        Xem kết quả
      </a>

      <p className="text-[11.5px] text-[var(--mute)] opacity-80">
        Quảng cáo mở ở tab khác, tab này vẫn giữ nguyên kết quả
      </p>
    </div>
  );
}
