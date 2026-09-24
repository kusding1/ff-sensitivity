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

export function Banner468x60() {
  return (
    <AdBanner
      slotId="ad-slot-468x60"
      adKey="30407e7e9fdd3ffc418de0df251907e3"
      width={468}
      height={60}
    />
  );
}

export function Banner300x250() {
  return (
    <AdBanner
      slotId="ad-slot-300x250"
      adKey="05d3deee1d0f7c60ead54481f5c444aa"
      width={300}
      height={250}
    />
  );
}

export function Banner160x600() {
  return (
    <AdBanner
      slotId="ad-slot-160x600"
      adKey="2bf4ded481eb9faeeb909ba72d6309c2"
      width={160}
      height={600}
    />
  );
}

export function Banner728x90() {
  return (
    <div className="hidden w-[728px] max-w-none overflow-hidden md:relative md:left-1/2 md:block md:-translate-x-1/2">
      <div className="mx-auto flex justify-center">
        <AdBanner
          slotId="ad-slot-728x90"
          adKey="2246bc42f1a148ad4c2c4632534547b2"
          width={728}
          height={90}
        />
      </div>
    </div>
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
