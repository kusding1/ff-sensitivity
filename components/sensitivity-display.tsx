"use client";

import {
  CornersOut,
  Crosshair,
  CrosshairSimple,
  Eye,
  MagnifyingGlass,
  RadioButton,
} from "@phosphor-icons/react/dist/ssr";
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import {
  SENSITIVITY_LABELS,
  type SensitivityAxis,
  type SensitivityProfile,
} from "@/lib/sensitivity";

type SensitivityDisplayProps = {
  profile: SensitivityProfile | null;
  systemDpi?: number | null;
  isIOS?: boolean;
  phoneName?: string | null;
};

const AXES: { axis: SensitivityAxis; icon: typeof Eye }[] = [
  { axis: "general", icon: Eye },
  { axis: "redDot", icon: RadioButton },
  { axis: "scope2x", icon: MagnifyingGlass },
  { axis: "scope4x", icon: CrosshairSimple },
  { axis: "awm", icon: Crosshair },
  { axis: "freeLook", icon: CornersOut },
];

function Counter({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const motion = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduce) {
      motion.set(value);
      setDisplay(value);
      return;
    }
    const controls = animate(motion, value, {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [value, motion, reduce]);

  useMotionValueEvent(motion, "change", (latest) => {
    setDisplay(Math.round(latest));
  });

  return <span className="tabular">{display}</span>;
}

function GuideRow({
  name,
  path,
  value,
}: {
  name: string;
  path: string;
  value: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <div className="text-[13.5px] font-semibold text-[var(--ink)]">
          {name}
        </div>
        <div className="mt-0.5 text-[12.5px] leading-snug text-[var(--mute)]">
          {path}
        </div>
      </div>
      <div className="tabular shrink-0 rounded-[8px] border border-[var(--line-strong)] bg-[var(--panel-2)] px-2.5 py-1 text-[14px] font-bold text-[var(--volt)]">
        {value}
      </div>
    </li>
  );
}

export function SensitivityDisplay({
  profile,
  systemDpi,
  isIOS,
  phoneName,
}: SensitivityDisplayProps) {
  return (
    <section aria-label="Kết quả phân tích" className="analyzer-card">
      <i aria-hidden className="hud-corner tl" />
      <i aria-hidden className="hud-corner tr" />
      <i aria-hidden className="hud-corner bl" />
      <i aria-hidden className="hud-corner br" />
      <div className="p-6 pt-7 md:p-7 md:pt-8">
        <h2 className="font-poster title-fire text-center text-[24px] tracking-wide md:text-[27px]">
          Kết quả phân tích
        </h2>
        <p className="mt-2 text-center text-[13.5px] text-[var(--mute)]">
          {profile && phoneName
            ? `Thay DPI + độ nhạy này vô game cho ${phoneName}.`
            : "Bấm phân tích ở trên để hiện số."}
        </p>

        {profile && (
          <div className="mt-4 flex items-center justify-center gap-8 text-center">
            <div>
              <div className="text-[12.5px] text-[var(--mute)]">Nút bắn</div>
              <div className="tabular text-[22px] font-bold leading-tight text-[var(--ink)]">
                {profile.fireButton}%
              </div>
            </div>
            <div className="h-9 w-px bg-[var(--line-strong)]" aria-hidden />
            <div>
              <div className="text-[12.5px] text-[var(--mute)]">Tốc độ con trỏ</div>
              <div className="tabular text-[22px] font-bold leading-tight text-[var(--ink)]">
                {profile.pointerSpeed}/10
              </div>
            </div>
            <div className="h-9 w-px bg-[var(--line-strong)]" aria-hidden />
            <div>
              <div className="text-[12.5px] text-[var(--mute)]">
                Độ rộng nhỏ nhất
              </div>
              <div className="tabular text-[22px] font-bold leading-tight text-[var(--highlight)]">
                {systemDpi ?? "Không cần"}
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 overflow-hidden rounded-[12px] border border-[var(--line-strong)]">
          <ul className="grid grid-cols-2 gap-px bg-[var(--line)] sm:grid-cols-3">
            {AXES.map(({ axis, icon: Icon }) => {
              const meta = SENSITIVITY_LABELS[axis];
              const val = profile ? profile[axis] : null;
              return (
                <li key={axis} className="bg-[var(--panel)] p-4">
                  <div className="flex items-center gap-2 text-[var(--mute)]">
                    <Icon size={15} weight="bold" aria-hidden />
                    <span className="text-[13px] font-medium text-[var(--dim)]">
                      {meta.label}
                    </span>
                  </div>
                  <div className="font-poster mt-2 text-[44px] leading-none text-[var(--ink)]">
                    {val === null ? (
                      <span aria-hidden className="text-[var(--line-strong)]">
                        00
                      </span>
                    ) : (
                      <Counter value={val} />
                    )}
                  </div>
                  <div className="mt-1 text-[12.5px] text-[var(--mute)]">
                    {meta.hint}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {profile && !isIOS && systemDpi && (
          <div className="mt-4 rounded-[12px] border border-[var(--line)] bg-[var(--panel-2)]/60 px-4 py-2">
            <div className="py-1 text-[13px] font-semibold text-[var(--dim)]">
              Mấy cái trong máy chỉnh theo
            </div>
            <ul className="divide-y divide-[var(--line)]">
              <GuideRow
                name="Độ rộng nhỏ nhất"
                path="Cài đặt, chạm 7 lần vào Số bản dựng để bật Tùy chọn nhà phát triển rồi nhập số này"
                value={`${systemDpi}`}
              />
              <GuideRow
                name="Tốc độ con trỏ"
                path="Mở Cài đặt, gõ tìm chữ tốc độ con trỏ rồi kéo về số này"
                value={`${profile.pointerSpeed}/10`}
              />
              <GuideRow
                name="Thời gian chờ cho cử chỉ chạm"
                path="Cài đặt, mục Hỗ trợ tiếp cận, để về mức ngắn nhất"
                value="Ngắn"
              />
            </ul>
          </div>
        )}
        {profile && isIOS && (
          <p className="mt-4 border-l-[3px] border-[var(--highlight)] pl-3 text-[13px] leading-relaxed text-[var(--dim)]">
            iPhone không có chỗ thay DPI hệ thống, chỉ cần thay độ nhạy ở
            trên. Tốc độ con trỏ thì chỉnh trong Cài đặt, mục Trợ năng,
            phần Cảm ứng.
          </p>
        )}
      </div>
    </section>
  );
}
