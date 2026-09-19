// Quick spot check
import { PHONES, type Phone } from "../data/phones";
import {
  suggestFireButton,
  suggestPointerSpeed,
  suggestMinTouchSize,
} from "../lib/sensitivity";

const samples: Array<{ id: string; label: string }> = [
  { id: "iphone-15-pro-max", label: "iPhone 15 Pro Max" },
  { id: "iphone-15", label: "iPhone 15" },
  { id: "iphone-11", label: "iPhone 11" },
  { id: "samsung-galaxy-s24-ultra", label: "Galaxy S24 Ultra" },
  { id: "samsung-galaxy-a05", label: "Galaxy A05" },
  { id: "samsung-galaxy-s20-fe", label: "Galaxy S20 FE" },
  { id: "redmi-note-13", label: "Redmi Note 13" },
  { id: "redmi-note-13-pro", label: "Redmi Note 13 Pro" },
  { id: "redmi-9", label: "Redmi 9" },
  { id: "redmi-a05", label: "Redmi A05 (samsung galaxy a05 alt)" },
  { id: "samsung-galaxy-a05", label: "Galaxy A05" },
  { id: "poco-f7", label: "POCO F7" },
  { id: "tecno-spark-20", label: "TECNO Spark 20" },
  { id: "tecno-camon-30", label: "TECNO Camon 30" },
  { id: "infinix-hot-50", label: "Infinix Hot 50" },
  { id: "infinix-gt-20-pro", label: "Infinix GT 20 Pro" },
  { id: "google-pixel-9", label: "Pixel 9" },
  { id: "google-pixel-6a", label: "Pixel 6a" },
  { id: "oneplus-12", label: "OnePlus 12" },
  { id: "oppo-find-x8", label: "OPPO Find X8" },
  { id: "vivo-x200", label: "vivo X200" },
  { id: "xiaomi-15", label: "Xiaomi 15" },
];

console.log(
  "Phone".padEnd(28) +
    "DPI".padStart(5) +
    "inch".padStart(6) +
    "Hz".padStart(5) +
    "  fire  ptr  touch",
);
console.log("─".repeat(70));
for (const s of samples) {
  const phone = PHONES.find((p) => p.id === s.id) as Phone | undefined;
  if (!phone) {
    console.log(s.label + ": not found");
    continue;
  }
  const fire = suggestFireButton(phone);
  const ptr = suggestPointerSpeed(phone);
  const touch = suggestMinTouchSize(phone);
  console.log(
    phone.name.padEnd(28) +
      String(phone.dpi).padStart(5) +
      phone.screenInch.toFixed(2).padStart(6) +
      String(phone.refreshRate ?? 60).padStart(5) +
      `  ${String(fire).padStart(3)}%  ${String(ptr).padStart(2)}  ${String(touch).padStart(3)}`,
  );
}
