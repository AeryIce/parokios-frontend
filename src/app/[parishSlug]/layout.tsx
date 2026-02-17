import type { Metadata } from "next";
import { getParishBySlug, PRODUCTS } from "@/app/_data/demo";

type Params = { parishSlug: string };
type Props = { children: React.ReactNode; params: Params | Promise<Params> };

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

  if (!parish) {
    return {
      title: "Paroki tidak ditemukan",
      robots: { index: false, follow: false },
    };
  }

  const firstImg =
    PRODUCTS.map((x) => pickImageUrl(x)).find((x): x is string => !!x) ??
    DEFAULT_OG_IMAGE;

  const title = parish.name;
  const description = clampDesc(
    `Etalase UMKM ${parish.name}. Bikin laper dulu, order via WA, bayar transfer manual.`
  );
  const url = `/${parish.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [{ url: firstImg }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [firstImg],
    },
  };
}

export default async function ParishLayout({ children }: Props) {
  // keep as passthrough layout (metadata only)
  return <>{children}</>;
}
