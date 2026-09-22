"use client";

import { useEffect, useRef } from "react";

// Banner Adsterra (atOptions + invoke.js) chay bang document.write nen
// khong nap truc tiep vao React duoc — moi banner chay trong 1 iframe
// rieng, tranh xung dot bien toan cuc atOptions khi co nhieu banner.
function AdIframe({
  adKey,
  width,
  height,
}: {
  adKey: string;
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host || host.dataset.done) return;
    host.dataset.done = "1";
    const frame = document.createElement("iframe");
    frame.width = String(width);
    frame.height = String(height);
    frame.setAttribute("scrolling", "no");
    frame.setAttribute("title", "quang cao");
    frame.style.border = "0";
    frame.style.display = "block";
    host.appendChild(frame);
    const doc = frame.contentDocument;
    if (doc) {
      doc.open();
      doc.write(
        '<script type="text/javascript">atOptions={' +
          "'key':'" +
          adKey +
          "'," +
          "'format':'iframe'," +
          "'height':" +
          height +
          "," +
          "'width':" +
          width +
          ",'params':{}};<\/script>" +
          '<script type="text/javascript" src="https://www.highrevenueformat.com/' +
          adKey +
          '/invoke.js"><\/script>'
      );
      doc.close();
    }
    return () => {
      if (frame.parentNode === host) host.removeChild(frame);
      delete host.dataset.done;
    };
  }, [adKey, width, height]);

  return (
    <div className="flex flex-col items-center gap-1" aria-label="quang cao">
      <span className="text-[10px] uppercase tracking-widest text-[var(--mute)] opacity-70">
        quảng cáo
      </span>
      <div ref={ref} style={{ width, height }} className="overflow-hidden" />
    </div>
  );
}

export function Banner160x300() {
  return <AdIframe adKey="ae9e3c7650944328704b8ff8b6216379" width={160} height={300} />;
}

export function Banner320x50() {
  return <AdIframe adKey="c15d6fad75117701998a200c0f50d097" width={320} height={50} />;
}

const NATIVE_ID = "container-e24456cd94681bb1d5b1587590888fc4";
const NATIVE_SRC =
  "https://pl31455641.profitableratecpmnetwork.com/e24456cd94681bb1d5b1587590888fc4/invoke.js";

export function NativeBanner() {
  useEffect(() => {
    if (document.querySelector(`script[data-native-ads="${NATIVE_ID}"]`))
      return;
    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.setAttribute("data-native-ads", NATIVE_ID);
    s.src = NATIVE_SRC;
    document.body.appendChild(s);
  }, []);
  return <div id={NATIVE_ID} className="mx-auto w-full" />;
}
