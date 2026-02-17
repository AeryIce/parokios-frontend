import Link from "next/link";
import { notFound } from "next/navigation";
import { Carousel } from "@/app/_components/Carousel";
import { ProductCard } from "@/app/_components/ProductCard";
import { Section } from "@/app/_components/Section";
import { getParishBySlug, getSeller, listProductsBySeller } from "@/app/_data/demo";

type Params = { parishSlug: string; sellerSlug: string };
type Props = { params: Params | Promise<Params> };

function getWhatsappDigits(seller: unknown): string | null {
  const rec = seller as Record<string, unknown>;
  const keys = ["whatsapp", "wa", "whatsappNumber", "waNumber", "phoneWa", "phone"] as const;

  for (const k of keys) {
    const v = rec[k];
    if (typeof v === "string") {
      const trimmed = v.trim();
      if (trimmed.length > 0) return trimmed;
    }
  }
  return null;
}

function waLink(waDigits: string, message: string): string {
  const clean = waDigits.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${clean}?text=${text}`;
}

export default async function SellerPage({ params }: Props) {
  const p = await Promise.resolve(params);

  const parish = getParishBySlug(p.parishSlug);
  if (!parish) notFound();

  const seller = getSeller(parish.slug, p.sellerSlug);
  if (!seller) notFound();

  const waDigits = getWhatsappDigits(seller);

  const products = listProductsBySeller(parish.slug, seller.slug);

  return (
    <main className="min-h-dvh bg-gradient-to-b from-orange-50 via-amber-50 to-white">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <Link
          href={`/${parish.slug}`}
          className="text-sm font-bold text-orange-700 underline decoration-orange-300"
        >
          ← {parish.name}
        </Link>

        <div className="mt-4 rounded-3xl border border-stone-200 bg-white/75 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-black text-stone-900">{seller.name}</h1>
              <p className="mt-1 text-sm font-semibold text-stone-600">{seller.tagline}</p>
              <p className="mt-2 text-xs font-bold text-stone-500">
                {parish.name} • {parish.area}
              </p>
            </div>

            {waDigits ? (
              <a
                className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-700"
                href={waLink(
                  waDigits,
                  `Halo ${seller.name}! Saya lihat produk di Parokios (${parish.name}). Bisa info stok & cara order?`
                )}
                target="_blank"
                rel="noreferrer"
              >
                Chat WA seller
              </a>
            ) : (
              <div className="inline-flex h-10 items-center justify-center rounded-xl border border-stone-200 bg-white px-4 text-sm font-extrabold text-stone-600">
                WA belum di-set (demo)
              </div>
            )}
          </div>
        </div>

        <Section title="Etalase" subtitle="Klik menu buat lihat detail + chat WA cepat.">
          {products.length > 0 ? (
            <Carousel>
              {products.map((x) => (
                <ProductCard key={x.slug} parish={parish} seller={seller} product={x} />
              ))}
            </Carousel>
          ) : (
            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm font-semibold text-stone-700 shadow-sm">
              Belum ada produk dari seller ini.
            </div>
          )}
        </Section>
      </div>
    </main>
  );
}
