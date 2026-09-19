import type { Phone } from "@/data/phones";

export type SensitivityAxis =
  | "general"
  | "redDot"
  | "scope2x"
  | "scope4x"
  | "awm"
  | "freeLook";

export type SensitivityProfile = {
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  awm: number;
  freeLook: number;
  fireButton: number;
  pointerSpeed: number;
  minTouchSize: number | null;
  dpi: number;
  systemDpi: number | null;
};

const REFERENCE_DPI = 400;

const BASE: Record<SensitivityAxis, number> = {
  general: 185,
  redDot: 178,
  scope2x: 173,
  scope4x: 165,
  awm: 155,
  freeLook: 180,
};

const MIN = 150;
const MAX = 200;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function computeAxis(base: number, dpi: number): number {
  const scale = REFERENCE_DPI / dpi;
  const raw = base * scale;
  return Math.round(clamp(raw, MIN, MAX));
}

/**
 * Đề xuất kích thước nút bắn (%).
 *
 * Lý thuyết:
 * - Màn hình lớn + DPI cao = nhiều pixel, ngón tay thật vẫn vậy → cần nút NHỎ
 *   hơn để không che tầm nhìn, cảm ứng vẫn chính xác vì pixel nhỏ.
 * - Màn hình nhỏ + DPI thấp = pixel to, ngón tay lớn → cần nút TO hơn để dễ bấm.
 * - Refresh rate cao (120Hz) = mượt hơn, nút nhỏ vẫn ok → bonus giảm nhẹ.
 *
 * Công thức:
 *   baseSize = 50 (trung bình)
 *   dpiFactor = (dpi - 400) / 100 * 3     ← DPI mỗi tăng 100 → giảm 3%
 *   screenFactor = (screenInch - 6.5) * 6  ← mỗi tăng 0.1" → giảm 0.6%
 *   hzFactor = (refreshRate - 60) / 60 * 2 ← từ 60→120Hz giảm ~2%
 *   fireButton = clamp(round(baseSize - dpiFactor - screenFactor - hzFactor), 30, 80)
 *
 * Tham chiếu nhanh:
 * - iPhone 15 Pro Max (460 DPI, 6.7", 120Hz) → 50 - 2 - 1.2 - 2 = 45
 * - iPhone 15       (460 DPI, 6.1", 60Hz)  → 50 - 2 - (-2.4) - 0 = 50
 * - Redmi Note 13   (446 DPI, 6.67", 120Hz)→ 50 - 1.4 - 1.0 - 2 = 46
 * - Redmi A05       (262 DPI, 6.7", 60Hz)  → 50 - (-4.1) - 1.2 - 0 = 55
 * - Galaxy S24 Ultra(505 DPI, 6.8", 120Hz) → 50 - 3.2 - 1.8 - 2 = 43
 * - Galaxy A05      (262 DPI, 6.7", 60Hz)  → 50 - (-4.1) - 1.2 - 0 = 55
 * - Tecno Spark Go  (270 DPI, 6.5", 60Hz) → 50 - (-3.9) - 0 - 0 = 54
 */
export function suggestFireButton(phone: Phone): number {
  const dpi = phone.dpi;
  const inch = phone.screenInch;
  const hz = phone.refreshRate ?? 60;

  const dpiFactor = ((dpi - REFERENCE_DPI) / 100) * 3;
  const screenFactor = (inch - 6.5) * 6;
  const hzFactor = ((hz - 60) / 60) * 2;

  const value = 50 - dpiFactor - screenFactor - hzFactor;
  return Math.round(clamp(value, 30, 80));
}

/**
 * Đề xuất tốc độ con trỏ (1-10).
 *
 * Lý thuyết:
 * - DPI cao = pixel nhỏ, đã "nhạy" về mặt vật lý → tốc độ phần mềm THẤP hơn.
 * - Màn hình to = quãng đường quét dài → cần tốc độ CAO hơn.
 * - Refresh rate cao (120Hz) = phản hồi mượt hơn → có thể tăng tốc độ nhẹ.
 *
 * Công thức:
 *   baseSpeed = 6 (trung bình)
 *   dpiFactor = (dpi - 400) / 50     ← DPI mỗi tăng 50 → giảm 1
 *   screenFactor = (screenInch - 6.5) * 1.2  ← mỗi tăng 0.1" → tăng 0.12
 *   hzFactor = (refreshRate - 60) / 60        ← 60→120Hz tăng 1
 *   pointerSpeed = clamp(round(baseSpeed - dpiFactor + screenFactor + hzFactor), 1, 10)
 *
 * Tham chiếu:
 * - iPhone 15 Pro Max (460, 6.7", 120Hz) → 6 - 1.2 + 0.24 + 1 = 6
 * - iPhone 15         (460, 6.1", 60Hz)  → 6 - 1.2 + (-0.48) + 0 = 4
 * - Galaxy S24 Ultra  (505, 6.8", 120Hz) → 6 - 2.1 + 0.36 + 1 = 5
 * - Redmi Note 13     (446, 6.67", 120Hz)→ 6 - 0.92 + 0.2 + 1 = 6
 * - Redmi A05         (262, 6.7", 60Hz)  → 6 - (-2.76) + 0.24 + 0 = 9
 * - Galaxy A05        (262, 6.7", 60Hz)  → 9
 * - Tecno Spark Go    (270, 6.5", 60Hz)  → 6 - (-2.6) + 0 + 0 = 9
 */
export function suggestPointerSpeed(phone: Phone): number {
  const dpi = phone.dpi;
  const inch = phone.screenInch;
  const hz = phone.refreshRate ?? 60;

  const dpiFactor = (dpi - REFERENCE_DPI) / 50;
  const screenFactor = (inch - 6.5) * 1.2;
  const hzFactor = (hz - 60) / 60;

  const value = 6 - dpiFactor + screenFactor + hzFactor;
  return Math.round(clamp(value, 1, 10));
}

/**
 * Đề xuất độ rộng tối thiểu vùng cảm ứng (1-10, Android).
 *
 * Lý thuyết: vùng cảm ứng càng lớn = hệ thống bỏ qua touch nhỏ hơn.
 * - DPI cao (pixel nhỏ, touch chính xác) → không cần vùng rộng → giá trị THẤP.
 * - DPI thấp (pixel to, dễ chạm nhầm) → cần vùng rộng hơn để chống bấm nhầm → giá trị CAO.
 *
 * Công thức:
 *   baseSize = 5
 *   dpiFactor = (400 - dpi) / 30   ← DPI thấp → tăng giá trị
 *   minTouchSize = clamp(round(baseSize + dpiFactor), 1, 10)
 *
 * Tham chiếu:
 * - Galaxy S24 Ultra (505 DPI) → 5 + (-3.5) = 2
 * - Redmi Note 13    (446 DPI) → 5 + (-1.5) = 4
 * - Tecno Spark Go   (270 DPI) → 5 + 4.3 = 9
 * - Redmi A05        (262 DPI) → 5 + 4.6 = 10
 */
export function suggestMinTouchSize(phone: Phone): number {
  const dpiFactor = (REFERENCE_DPI - phone.dpi) / 30;
  const value = 5 + dpiFactor;
  return Math.round(clamp(value, 1, 10));
}

/**
 * Độ rộng nhỏ nhất nên chỉnh trong máy (Tùy chọn nhà phát triển,
 * chỉ Android).
 *
 * Neo theo thực tế (2 mốc khớp cùng hệ số 1.12):
 * - Tecno Pova 7 (DPI vật lý 393) bắn ngon nhất ở 440 → 393 × 1.12 = 440
 * - OPPO Reno 6Z (DPI vật lý 409) bắn ngon nhất ở 460 → 409 × 1.12 = 458 → 460
 * Công thức: DPI vật lý × 1.12, làm tròn hàng chục,
 * kẹp trong 400–550 cho đỡ vỡ layout máy yếu lẫn máy xịn.
 *
 * Tham chiếu:
 * - Tecno Pova 7 (393 DPI) → 393 × 1.12 = 440
 * - Redmi Note 13 Pro (446 DPI) → 500
 * - Galaxy S24 Ultra (505 DPI) → 570 → kẹp 550
 * - Redmi A05 (262 DPI) → 293 → kẹp 400
 * - iPhone → null (iOS không có chỗ này)
 */
export function suggestSystemDPI(phone: Phone): number | null {
  if (phone.os === "ios") return null;
  const raw = phone.dpi * 1.12;
  const rounded = Math.round(raw / 10) * 10;
  return Math.round(clamp(rounded, 400, 550));
}

export function computeSensitivity(
  phone: Phone,
  fireButton: number,
  pointerSpeed: number,
  minTouchSize: number | null,
  systemDpi: number | null,
): SensitivityProfile {
  return {
    general: computeAxis(BASE.general, phone.dpi),
    redDot: computeAxis(BASE.redDot, phone.dpi),
    scope2x: computeAxis(BASE.scope2x, phone.dpi),
    scope4x: computeAxis(BASE.scope4x, phone.dpi),
    awm: computeAxis(BASE.awm, phone.dpi),
    freeLook: computeAxis(BASE.freeLook, phone.dpi),
    fireButton: Math.round(clamp(fireButton, 30, 80)),
    pointerSpeed: Math.round(clamp(pointerSpeed, 1, 10)),
    minTouchSize: minTouchSize,
    dpi: phone.dpi,
    systemDpi,
  };
}

export const SENSITIVITY_LABELS: Record<
  SensitivityAxis,
  { label: string; hint: string }
> = {
  general: { label: "Nhìn Xung Quanh", hint: "Tổng quát khi chưa ngắm" },
  redDot: { label: "Red Dot", hint: "Ống ngắm đỏ 1x" },
  scope2x: { label: "Ống Ngắm 2X", hint: "Scope 2x" },
  scope4x: { label: "Ống Ngắm 4X", hint: "Scope 4x" },
  awm: { label: "Ống Ngắm AWM", hint: "Sniper 6x/8x" },
  freeLook: { label: "Camera Tự Do", hint: "Xoay góc nhìn tự do" },
};

export const FIRE_BUTTON_MIN = 30;
export const FIRE_BUTTON_MAX = 80;

export const POINTER_SPEED_MIN = 1;
export const POINTER_SPEED_MAX = 10;

export const TOUCH_SIZE_MIN = 1;
export const TOUCH_SIZE_MAX = 10;
