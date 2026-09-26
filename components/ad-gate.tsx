"use client";

import { useEffect, useRef } from "react";
import { CheckCircle, HandTap } from "@phosphor-icons/react/dist/ssr";

const AD_KEY = "05d3deee1d0f7c60ead54481f5c444aa";
const WIDTH = 300;
const HEIGHT = 250;

type AdWindow = Window & {
  atOptions?: unknown;
  __kusdingAdChain?: Promise<void>;
};

export function AdGate({ onUnlock }: { onUnlock: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = window as AdWindow;
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
          s.onload = () => resolve();
          s.onerror = () => resolve();
          host.appendChild(s);
        })
    );
  }, []);

  return (
    <div className="mt-5 flex flex-col items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/[0.02] p-5 text-center">
      <p className="text-[13.5px] leading-relaxed text-[var(--mute)]">
        Kết quả đã dựng xong. Xem quảng cáo bên dưới rồi bấm nút để mở.
      </p>
      <div
        ref={hostRef}
        className="mx-auto overflow-hidden"
        style={{ width: WIDTH, height: HEIGHT }}
        aria-label="quảng cáo"
      />
      <button
        type="button"
        onClick={onUnlock}
        className="btn-fire flex h-[46px] w-full max-w-[300px] items-center justify-center gap-2 text-[13.5px] uppercase"
      >
        <CheckCircle size={18} weight="bold" aria-hidden />
        Xem kết quả
      </button>
      <p className="flex items-center gap-1.5 text-[11.5px] text-[var(--mute)] opacity-80">
        <HandTap size={14} aria-hidden />
        Bấm quảng cáo phía trên trước để hỗ trợ duy trì site
      </p>
    </div>
  );
}
