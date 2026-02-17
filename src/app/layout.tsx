import type { Metadata } from "next";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&fm=jpg&q=80&w=1200";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Parokios — food-first",
    template: "%s — Parokios",
  },
  description:
    "Jelajah UMKM paroki: bikin laper dulu, bayarnya belakangan (transfer manual).",
  applicationName: "Parokios",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Parokios",
    locale: "id_ID",
    url: "/",
    title: "Parokios — food-first",
    description:
      "Jelajah UMKM paroki: bikin laper dulu, bayarnya belakangan (transfer manual).",
    images: [{ url: DEFAULT_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parokios — food-first",
    description:
      "Jelajah UMKM paroki: bikin laper dulu, bayarnya belakangan (transfer manual).",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
