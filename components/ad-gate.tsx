"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, HandTap } from "@phosphor-icons/react/dist/ssr";

const AD_KEY = "05d3deee1d0f7c60ead54481f5c444aa";
const WIDTH = 300;
const HEIGHT = 250;
const STRIP = 52;

type AdWindow = Window & {
  atOptions?: unknown;
  __kusdingAdChain?: Promise<void>;
};

export function AdGate({ onUnlock }: { onUnlock: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

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
    <div className="mt-5 flex flex-col items-center gap-2.5 rounded-2xl border border-[var(--line)] bg-white/[0.02] p-5 text-center">
      <p className="text-[13.5px] leading-relaxed text-[var(--mute)]">
        Kết quả đã dựng xong. Bấm vào dải trên quảng cáo để mở.
      </p>
      <div
        className="relative mx-auto"
        style={{ width: WIDTH, maxWidth: "100%" }}
      >
        <div
          ref={hostRef}
          className="overflow-hidden rounded-xl"
          style={{ width: WIDTH, height: HEIGHT }}
          aria-label="quảng cáo"
        />
        <button
          type="button"
          onClick={onUnlock}
          disabled={!ready}
          style={{ height: STRIP }}
          className="absolute left-0 top-0 flex w-full items-center justify-center gap-1.5 rounded-t-xl border-b border-white/15 bg-black/75 text-[12px] font-semibold uppercase text-white backdrop-blur-sm transition-colors hover:bg-black/85 disabled:cursor-wait"
        >
          {ready ? (
            <>
              <CheckCircle size={16} weight="bold" aria-hidden />
              Bấm để xem kết quả
            </>
          ) : (
            "Đang tải quảng cáo…"
          )}
        </button>
      </div>
      <p className="flex items-center gap-1.5 text-[11.5px] text-[var(--mute)] opacity-80">
        <HandTap size={14} aria-hidden />
        Phần bên dưới dải là quảng cáo, bấm vào cũng được
      </p>
    </div>
  );
}
