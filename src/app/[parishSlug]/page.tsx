import Link from "next/link";
import { notFound } from "next/navigation";
import { Carousel } from "@/app/_components/Carousel";
import { ProductCard } from "@/app/_components/ProductCard";
import { Section } from "@/app/_components/Section";
import {
  getParishBySlug,
  getSeller,
  listSellersByParish,
  listProductsBySeller,
  PRODUCTS,
  type Parish,
  type Product,
  type Seller,
} from "@/app/_data/demo";

type Props = {
  params: { parishSlug: string } | Promise<{ parishSlug: string }>;
};

type CardItem = { parish: Parish; seller: Seller; product: Product };

function toCardItemsForParish(parish: Parish, products: readonly Product[]): CardItem[] {
  const out: CardItem[] = [];
  for (const p of products) {
    const seller = getSeller(parish.slug, p.sellerSlug);
    if (!seller) continue;
    out.push({ parish, seller, product: p });
  }
  return out;
}

export default async function ParishPage({ params }: Props) {
  const p = await Promise.resolve(params);
  const parish = getParishBySlug(p.parishSlug);
  if (!parish) notFound();

  const sellers = listSellersByParish(parish.slug);

  const bestInParish = PRODUCTS.filter((x) => x.parishSlug === parish.slug)
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 12);

  return (
    <main className="min-h-dvh bg-gradient-to-b from-orange-50 via-amber-50 to-white">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <Link
          href="/"
          className="text-sm font-bold text-orange-700 underline decoration-orange-300"
        >
          ← Balik ke Home
        </Link>

        <div className="mt-4 rounded-3xl border border-stone-200 bg-white/75 p-6 shadow-sm backdrop-blur">
          <h1 className="text-2xl font-black text-stone-900">{parish.name}</h1>
          <p className="mt-1 text-sm font-semibold text-stone-600">{parish.area}</p>

          {sellers.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {sellers.map((s) => (
                <Link
                  key={s.slug}
                  href={`/${parish.slug}/${s.slug}`}
                  className="rounded-full border border-orange-200/70 bg-white/80 px-4 py-2 text-sm font-black text-stone-900 shadow-sm transition hover:border-rose-200 hover:bg-rose-50"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <Section
          title="Terlaris di paroki ini"
          subtitle="Demo dulu (soldCount). Nanti basis real: order selesai."
        >
          <Carousel>
            {toCardItemsForParish(parish, bestInParish).map(({ seller, product }) => (
              <ProductCard
                key={`${parish.slug}-${seller.slug}-${product.slug}`}
                parish={parish}
                seller={seller}
                product={product}
              />
            ))}
          </Carousel>
        </Section>

        {sellers.map((seller) => {
          const products = listProductsBySeller(parish.slug, seller.slug);
          if (products.length === 0) return null;

          return (
            <Section key={seller.slug} title={seller.name} subtitle={seller.tagline}>
              <Carousel>
                {toCardItemsForParish(parish, products).map(({ product }) => (
                  <ProductCard
                    key={`${parish.slug}-${seller.slug}-${product.slug}`}
                    parish={parish}
                    seller={seller}
                    product={product}
                  />
                ))}
              </Carousel>

              <div className="mt-3">
                <Link
                  href={`/${parish.slug}/${seller.slug}`}
                  className="inline-flex rounded-xl border border-orange-200/70 bg-white px-4 py-2 text-sm font-black text-stone-900 shadow-sm transition hover:bg-rose-50"
                >
                  Lihat semua dari {seller.name} →
                </Link>
              </div>
            </Section>
          );
        })}
      </div>
    </main>
  );
}
