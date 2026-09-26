"use client";

import {
  AndroidLogo,
  AppleLogo,
  CrosshairSimple,
} from "@phosphor-icons/react/dist/ssr";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdGate } from "@/components/ad-gate";
import { CopyButton } from "@/components/copy-button";
import { PhoneSelector } from "@/components/phone-selector";
import { Reveal } from "@/components/reveal";
import { SensitivityDisplay } from "@/components/sensitivity-display";
import { searchPhones, type Phone } from "@/lib/phones";
import {
  computeSensitivity,
  suggestFireButton,
  suggestMinTouchSize,
  suggestPointerSpeed,
  suggestSystemDPI,
  type SensitivityProfile,
} from "@/lib/sensitivity";

type OS = "android" | "ios";

function scanLabel(progress: number): string {
  if (progress < 34) return "Đang đọc DPI màn hình…";
  if (progress < 67) return "Đang đo tốc độ quét…";
  if (progress < 100) return "Đang chốt số kéo tâm…";
  return "Chốt đơn!";
}

export function Configurator() {
  const [query, setQuery] = useState("");
  const [phone, setPhone] = useState<Phone | null>(null);
  const [os, setOs] = useState<OS>("android");
  const [submitted, setSubmitted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const scanRef = useRef(0);

  useEffect(() => {
    return () => cancelAnimationFrame(scanRef.current);
  }, []);

  const profile: SensitivityProfile | null = useMemo(() => {
    if (!phone) return null;
    return computeSensitivity(
      phone,
      suggestFireButton(phone),
      suggestPointerSpeed(phone),
      phone.os === "android" ? suggestMinTouchSize(phone) : null,
      suggestSystemDPI(phone),
    );
  }, [phone]);

  const systemDpi = phone ? suggestSystemDPI(phone) : null;

  const resetResult = () => {
    setSubmitted(false);
    setScanning(false);
    setProgress(0);
    setUnlocked(false);
    cancelAnimationFrame(scanRef.current);
  };

  const pickOs = (next: OS) => {
    setOs(next);
    setError(null);
    if (phone && phone.os !== next) {
      setPhone(null);
      resetResult();
    }
  };

  const onQueryChange = (q: string) => {
    setQuery(q);
    setError(null);
    if (phone && q !== phone.name) {
      setPhone(null);
      resetResult();
    }
  };

  const finishAnalyze = () => {
    setScanning(false);
    setProgress(100);
    setSubmitted(true);
    setUnlocked(false);
  };

  const unlock = () => {
    setUnlocked(true);
    requestAnimationFrame(() => {
      document
        .getElementById("ket-qua")
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const startScan = () => {
    if (reduceMotion) {
      finishAnalyze();
      return;
    }
    setScanning(true);
    setProgress(0);
    const t0 = performance.now();
    const dur = 1100;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setProgress(Math.round(p * 100));
      if (p < 1) {
        scanRef.current = requestAnimationFrame(tick);
      } else {
        finishAnalyze();
      }
    };
    scanRef.current = requestAnimationFrame(tick);
  };

  const onAnalyze = () => {
    if (scanning) return;
    if (phone) {
      setError(null);
      startScan();
      return;
    }
    const top = searchPhones(query, { os, limit: 1 })[0];
    if (top) {
      setPhone(top);
      setQuery(top.name);
      setError(null);
      startScan();
    } else {
      setSubmitted(false);
      setError("Chưa thấy máy này. Gõ thêm vài chữ rồi chọn trong gợi ý.");
    }
  };

  const analyzed = submitted && phone && profile && unlocked;
  const gated = Boolean(submitted && phone && profile && !unlocked);

  return (
    <div className="space-y-5">
      <section aria-label="Phân tích cấu hình" className="analyzer-card">
        <i aria-hidden className="hud-corner tl" />
        <i aria-hidden className="hud-corner tr" />
        <i aria-hidden className="hud-corner bl" />
        <i aria-hidden className="hud-corner br" />
        <div className="p-6 pt-7 md:p-8 md:pt-9">
          <span className="eyebrow-chip">
            <span className="dot" aria-hidden />
            OB55, mùa mới nhất
          </span>
          <h1 className="font-poster mt-4 text-[42px] leading-[0.95] md:text-[52px]">
            Độ nhạy + DPI
            <br />
            <span className="title-fire">cho các dòng máy</span>
          </h1>
          <p className="mt-3 max-w-[42ch] text-[14.5px] leading-relaxed text-[var(--mute)]">
            Chọn máy, bấm phân tích, thay DPI + độ nhạy vô game rồi lụm.
          </p>

          <div className="mt-7 space-y-6">
            <PhoneSelector
              query={query}
              onQueryChange={onQueryChange}
              os={os}
              phone={phone}
              onPick={(p) => {
                setPhone(p);
                setQuery(p.name);
                setError(null);
              }}
              onClear={() => {
                setQuery("");
                setPhone(null);
                resetResult();
              }}
              onSubmit={onAnalyze}
            />

            <div>
              <div className="mb-2 text-[13.5px] font-medium text-[var(--dim)]">
                Chạy hệ điều hành nào
              </div>
              <div className="grid gap-2.5" role="group" aria-label="Hệ điều hành">
                <button
                  type="button"
                  aria-pressed={os === "android"}
                  data-active={os === "android"}
                  onClick={() => pickOs("android")}
                  className="opt-row"
                >
                  <span className="opt-icon" aria-hidden>
                    <AndroidLogo size={20} weight="fill" />
                  </span>
                  <span>
                    <span className="opt-name">Android</span>
                    <span className="opt-sub">Samsung, Xiaomi, Oppo, Vivo…</span>
                  </span>
                  <span className="opt-check" aria-hidden>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6.2 4.8 9 10 3.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <button
                  type="button"
                  aria-pressed={os === "ios"}
                  data-active={os === "ios"}
                  onClick={() => pickOs("ios")}
                  className="opt-row"
                >
                  <span className="opt-icon" aria-hidden>
                    <AppleLogo size={20} weight="fill" />
                  </span>
                  <span>
                    <span className="opt-name">iOS / iPadOS</span>
                    <span className="opt-sub">iPhone, iPad các đời</span>
                  </span>
                  <span className="opt-check" aria-hidden>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6.2 4.8 9 10 3.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-[13.5px] text-[#ff7a7a]">
                {error}
              </p>
            )}

            <div>
              <button
                type="button"
                onClick={onAnalyze}
                disabled={scanning}
                className="btn-fire flex h-[58px] w-full items-center justify-center gap-2.5 text-[15px] uppercase"
              >
                <span
                  aria-hidden
                  className="btn-fill"
                  style={{ width: scanning ? `${progress}%` : "0%" }}
                />
                <span className="relative flex items-center gap-2.5">
                  <CrosshairSimple size={19} weight="bold" aria-hidden />
                  {scanning
                    ? `${scanLabel(progress)} ${progress}%`
                    : submitted
                      ? "Phân tích lại"
                      : "Phân tích"}
                </span>
              </button>
              <p className="mt-2.5 text-center text-[12.5px] text-[var(--mute)]">
                {phone
                  ? `Sẵn sàng quét cho ${phone.name}.`
                  : "Gõ tên máy rồi bấm nút là có số."}
              </p>
            </div>

            {gated && <AdGate onUnlock={unlock} />}
          </div>
        </div>
      </section>

      {analyzed && (
        <div id="ket-qua" className="scroll-mt-24">
          <Reveal>
            <SensitivityDisplay
              profile={profile}
              systemDpi={systemDpi}
              isIOS={phone.os === "ios"}
              phoneName={phone.name}
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-4">
              <CopyButton phone={phone} profile={profile} />
            </div>
          </Reveal>
        </div>
      )}
    </div>
  );
}
