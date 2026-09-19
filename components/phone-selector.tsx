"use client";

import {
  AndroidLogo,
  AppleLogo,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState } from "react";
import { searchPhones, type Phone } from "@/lib/phones";

type DeviceInputProps = {
  query: string;
  onQueryChange: (q: string) => void;
  os: "android" | "ios";
  phone: Phone | null;
  onPick: (p: Phone) => void;
  onClear: () => void;
  onSubmit: () => void;
};

export function PhoneSelector({
  query,
  onQueryChange,
  os,
  phone,
  onPick,
  onClear,
  onSubmit,
}: DeviceInputProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = searchPhones(query, { os, limit: 7 });

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    setHighlight(0);
  }, [query, os]);

  const pick = (p: Phone) => {
    onPick(p);
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (open && results[highlight]) pick(results[highlight]);
      else onSubmit();
      return;
    }
    if (!open && e.key === "ArrowDown") {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div>
      <label
        htmlFor="device-name"
        className="mb-2 block text-[13.5px] font-medium text-[var(--dim)]"
      >
        Tên máy mày đang bắn là con nào
      </label>
      <div ref={containerRef} className="relative">
        <div className="field-ammo flex h-[52px] items-center gap-3 px-4">
          <MagnifyingGlass
            size={18}
            weight="bold"
            className="shrink-0 text-[var(--mute)]"
          />
          <input
            id="device-name"
            ref={inputRef}
            type="text"
            value={query}
            spellCheck={false}
            autoComplete="off"
            placeholder="Ví dụ: iPhone 13, Redmi K60, Itel A60s…"
            onChange={(e) => {
              onQueryChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={open && query.trim().length >= 1}
            aria-controls="phone-listbox"
            className="h-full flex-1 bg-transparent text-[15px] text-[var(--ink)] outline-none placeholder:text-[var(--mute)]"
          />
          {query && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Xóa tên máy đã nhập"
              className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--mute)] hover:bg-white/5 hover:text-[var(--ink)]"
            >
              <X size={15} weight="bold" />
            </button>
          )}
        </div>

        {open && query.trim().length >= 1 && (
          <div className="pop-fade absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-[12px] border border-[var(--line-strong)] bg-[var(--panel)] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)]">
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-[var(--mute)]">
                Chưa thấy máy này. Thử gõ hãng hoặc dòng máy gọn hơn.
              </div>
            ) : (
              <ul id="phone-listbox" role="listbox">
                {results.map((p, i) => {
                  const Icon = p.os === "ios" ? AppleLogo : AndroidLogo;
                  const active = i === highlight;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => pick(p)}
                        onMouseEnter={() => setHighlight(i)}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-[14px] transition-colors ${
                          active ? "bg-white/5" : ""
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          <Icon
                            size={15}
                            weight="fill"
                            className="shrink-0 text-[var(--mute)]"
                          />
                          <span className="truncate font-medium text-[var(--ink)]">
                            {p.name}
                          </span>
                        </span>
                        <span className="tabular shrink-0 text-[13px] text-[var(--mute)]">
                          {p.dpi} DPI
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
      {phone && (
        <p className="mt-2 text-[13px] text-[var(--mute)]">
          Đã chốt{" "}
          <span className="font-semibold text-[var(--ink)]">{phone.name}</span>{" "}
          <span className="tabular">
            {phone.dpi} DPI, {phone.screenInch} inch
            {phone.refreshRate ? `, ${phone.refreshRate}Hz` : ""}
          </span>
        </p>
      )}
    </div>
  );
}
