"use client";

import { Check, Copy } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import type { Phone } from "@/lib/phones";
import {
  SENSITIVITY_LABELS,
  type SensitivityAxis,
  type SensitivityProfile,
} from "@/lib/sensitivity";

type CopyButtonProps = {
  phone: Phone;
  profile: SensitivityProfile;
};

const ORDER: SensitivityAxis[] = [
  "general",
  "redDot",
  "scope2x",
  "scope4x",
  "awm",
  "freeLook",
];

function buildText(phone: Phone, profile: SensitivityProfile): string {
  const lines: string[] = [
    `Do nhay Free Fire cho ${phone.name} (${phone.dpi} DPI)`,
    ...ORDER.map(
      (axis) => `${SENSITIVITY_LABELS[axis].label}: ${profile[axis]}`,
    ),
    `Nut ban: ${profile.fireButton}%`,
    `Toc do con tro: ${profile.pointerSpeed}/10`,
  ];

  if (profile.systemDpi !== null) {
    lines.push(`Chieu rong nho nhat nen chinh: ${profile.systemDpi}`);
  }

  if (profile.minTouchSize !== null) {
    lines.push(`Vung cam ung toi thieu: ${profile.minTouchSize}/10`);
  }

  return lines.join("\n");
}

export function CopyButton({ phone, profile }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    const text = buildText(phone, profile);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div>
      <button
        type="button"
        onClick={onCopy}
        className="btn-ammo inline-flex h-[56px] w-full items-center justify-center gap-2 px-5 text-[16px]"
      >
        {copied ? (
          <>
            <Check size={19} weight="bold" aria-hidden />
            Đã chép xong, mở game dán vào
          </>
        ) : (
          <>
            <Copy size={19} weight="bold" aria-hidden />
            Chép bộ số này vào game
          </>
        )}
      </button>
      <p className="mt-2 text-center text-[13px] text-[var(--mute)]">
        {copied
          ? "Mở Free Fire, vào phần độ nhạy và nhập từng số."
          : "Chép ra văn bản thuần để dán đâu cũng được."}
      </p>
    </div>
  );
}
