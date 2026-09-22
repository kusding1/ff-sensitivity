import type { Metadata, Viewport } from "next";
import { Anton, Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const display = Anton({
  weight: "400",
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-display",
  display: "swap",
});

const body = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FF Sensitivity: độ nhạy Free Fire OB55 theo máy",
  description:
    "Lấy số độ nhạy Free Fire OB55 chuẩn theo từng máy Android và iPhone. Chọn máy, bấm phân tích, vô game lụm.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0d16" },
    { media: "(prefers-color-scheme: light)", color: "#eef1f7" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} font-body antialiased`}
      >
        <Script
          id="popunder"
          strategy="afterInteractive"
          src="https://pl31454686.profitableratecpmnetwork.com/c2/a2/60/c2a2603ea5ed216302268c771b0e2f57.js"
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
