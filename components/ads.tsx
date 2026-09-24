type AdBannerProps = {
  slotId: string;
  adKey: string;
  width: number;
  height: number;
};

function AdBanner({ slotId, adKey, width, height }: AdBannerProps) {
  const loader = `
window.__kusdingAdChain = window.__kusdingAdChain || Promise.resolve();
window.__kusdingAdChain = window.__kusdingAdChain.then(function () {
  return new Promise(function (resolve) {
    var host = document.getElementById(${JSON.stringify(slotId)});
    if (!host) { resolve(); return; }
    window.atOptions = {
      key: ${JSON.stringify(adKey)},
      format: 'iframe',
      height: ${height},
      width: ${width},
      params: {}
    };
    var s = document.createElement('script');
    s.async = true;
    s.src = ${JSON.stringify(`https://www.highrevenueformat.com/${adKey}/invoke.js`)};
    s.onload = function () { resolve(); };
    s.onerror = function () { resolve(); };
    host.appendChild(s);
  });
});
`.trim();

  return (
    <>
      <div
        id={slotId}
        className="mx-auto overflow-hidden"
        style={{ width, height }}
        aria-label="quảng cáo"
      />
      <script dangerouslySetInnerHTML={{ __html: loader }} />
    </>
  );
}

export function Banner160x300() {
  return (
    <AdBanner
      slotId="ad-slot-160x300"
      adKey="ae9e3c7650944328704b8ff8b6216379"
      width={160}
      height={300}
    />
  );
}

export function Banner320x50() {
  return (
    <AdBanner
      slotId="ad-slot-320x50"
      adKey="c15d6fad75117701998a200c0f50d097"
      width={320}
      height={50}
    />
  );
}

export function NativeBanner() {
  return (
    <>
      <div id="container-e24456cd94681bb1d5b1587590888fc4" className="mx-auto w-full" />
      <script
        async
        data-cfasync="false"
        src="https://pl31455641.profitableratecpmnetwork.com/e24456cd94681bb1d5b1587590888fc4/invoke.js"
      />
    </>
  );
}
