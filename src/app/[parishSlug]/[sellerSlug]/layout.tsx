import type { Metadata } from "next";
import { getParishBySlug, getSeller, PRODUCTS } from "@/app/_data/demo";

type Params = { parishSlug: string; sellerSlug: string };

const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&fm=jpg&q=80&w=1200";

function pickImageUrl(item: unknown): string | null {
  if (!item || typeof item !== "object") return null;
  const maybe = item as { imageUrl?: unknown };
  if (typeof maybe.imageUrl === "string" && maybe.imageUrl.trim().length > 0) {
    return maybe.imageUrl.trim();
  }
  return null;
}

function clampDesc(text: string, max = 160): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Params | Promise<Params>;
}): Promise<Metadata> {
  const p = await Promise.resolve(params);

  const parish = getParishBySlug(p.parishSlug);
  const seller = parish ? getSeller(parish.slug, p.sellerSlug) : null;

  if (!parish || !seller) {
    return {
      title: "Seller tidak ditemukan",
      robots: { index: false, follow: false },
    };
  }

  const sellerImg =
    PRODUCTS.filter(
      (x) =>
        typeof x === "object" &&
        x !== null &&
        (x as { parishSlug?: unknown }).parishSlug === parish.slug &&
        (x as { sellerSlug?: unknown }).sellerSlug === seller.slug
    )
      .map((x) => pickImageUrl(x))
      .find((x): x is string => !!x) ?? DEFAULT_OG_IMAGE;

  const title = `${seller.name}`;
  const description = clampDesc(
    `${seller.tagline} • ${parish.name}. Order via WA, bayar transfer manual.`
  );
  const url = `/${parish.slug}/${seller.slug}`;

  return {
    title,
    description,
    openGraph: {
      title: `${seller.name} • ${parish.name}`,
      description,
      url,
      images: [{ url: sellerImg }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${seller.name} • ${parish.name}`,
      description,
      images: [sellerImg],
    },
  };
}

export default function SellerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
