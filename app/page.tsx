import { Header } from "@/components/header";
import { Configurator } from "@/components/configurator";
import { PHONE_COUNT } from "@/lib/phones";

export default function Page() {
  return (
    <>
      <div className="tactical-bg" aria-hidden />
      <div className="tactical-vignette" aria-hidden />
      <div aria-hidden className="ghost-ob">
        OB55
      </div>
      <div className="relative z-10 flex min-h-dvh flex-col">
        <Header />
        <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-8 md:pt-12">
          <div className="rise-once">
            <Configurator />
          </div>

          <footer className="mt-10 border-t border-[var(--line)] pt-6 text-center text-[13px] leading-relaxed text-[var(--mute)]">
            <p>
              Kho có {PHONE_COUNT} máy, thiếu máy nào nhắn là thêm.
            </p>
            <p className="mt-1">
              Vô game bắn thử vài trận rồi nhích nhẹ cho hợp tay.
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
