import type { Metadata } from "next";
import { getParishBySlug, getProduct, getSeller } from "@/app/_data/demo";

type Params = { parishSlug: string; sellerSlug: string; productSlug: string };

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
  const product =
    parish && seller ? getProduct(parish.slug, seller.slug, p.productSlug) : null;

  if (!parish || !seller || !product) {
    return {
      title: "Produk tidak ditemukan",
      robots: { index: false, follow: false },
    };
  }

  const img = pickImageUrl(product) ?? DEFAULT_OG_IMAGE;

  const title = product.name;
  const description = clampDesc(product.desc);
  const url = `/${parish.slug}/${seller.slug}/${product.slug}`;

  return {
    title,
    description,
    openGraph: {
      title: `${product.name} • ${seller.name}`,
      description,
      url,
      images: [{ url: img }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} • ${seller.name}`,
      description,
      images: [img],
    },
  };
}

export default function ProductLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
