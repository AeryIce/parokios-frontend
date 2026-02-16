import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const metadataBase = new URL(siteUrl);

export const metadata: Metadata = {
  metadataBase,
  applicationName: "Parokios",
  title: {
    default: "Parokios",
    template: "%s | Parokios",
  },
  description:
    "Etalase UMKM per paroki. Lihat yang bikin laper, chat seller via WA, transfer manual, upload bukti. Beres.",
  keywords: [
    "UMKM",
    "paroki",
    "katalog",
    "makanan",
    "kue",
    "jajanan",
    "order",
    "WhatsApp",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Parokios",
    title: "Parokios",
    description:
      "Etalase UMKM per paroki. Lihat yang bikin laper, chat seller via WA, transfer manual, upload bukti. Beres.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Parokios - Etalase UMKM per Paroki",
      },
    ],
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parokios",
    description:
      "Etalase UMKM per paroki. Lihat yang bikin laper, chat seller via WA, transfer manual, upload bukti.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
