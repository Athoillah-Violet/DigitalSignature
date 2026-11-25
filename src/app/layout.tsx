import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AosProvider from "@/components/AosProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#E9E8E3",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "VERITAS — Integritas & Tanda Tangan Digital PDF",
    template: "%s | VERITAS",
  },
  description:
    "Aplikasi web tanda tangan digital dokumen PDF resmi berbasis kriptografi RSA-2048 / SHA-256 dan verifikasi keaslian instan via pemindai QR code.",
  keywords: [
    "tanda tangan digital",
    "digital signature",
    "verifikasi pdf",
    "qr code",
    "rsa 2048",
    "keamanan dokumen",
    "veritas",
  ],
  authors: [{ name: "VERITAS Team" }],
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "VERITAS — Integritas & Tanda Tangan Digital PDF",
    description:
      "Tanda tangani dokumen PDF secara digital dan verifikasi keaslian dokumen via QR code dengan jaminan kriptografi RSA.",
    type: "website",
    locale: "id_ID",
    siteName: "VERITAS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#E9E8E3] text-[#111111] selection:bg-[#111111] selection:text-[#E9E8E3]">
        <AosProvider>{children}</AosProvider>
      </body>
    </html>
  );
}
