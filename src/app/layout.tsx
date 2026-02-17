import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parokios — food-first",
  description:
    "Jelajah UMKM paroki: bikin laper dulu, bayarnya belakangan (transfer manual).",
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
