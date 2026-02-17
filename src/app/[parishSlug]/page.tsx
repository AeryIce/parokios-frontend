import Link from "next/link";
import { Carousel } from "@/app/_components/Carousel";
import { ProductCard } from "@/app/_components/ProductCard";
import { Section } from "@/app/_components/Section";
import { SellerCard } from "@/app/_components/SellerCard";
import {
  getParishBySlug,
  getSeller,
  listProductsBySeller,
  listSellersByParish,
  PRODUCTS,
} from "@/app/_data/demo";

type Params = { parishSlug: string };

type Props = { params: Params | Promise<Params> };

export default async function ParishPage({ params }: Props) {
  const p = await Promise.resolve(params);

  const parish = getParishBySlug(p.parishSlug);

  if (!parish) {
    return (
      <main className="min-h-dvh bg-gradient-to-b from-orange-50 via-amber-50 to-white p-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="text-lg font-black text-stone-900">404</div>
          <p className="mt-1 text-sm text-stone-600">Paroki tidak ditemukan.</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl bg-amber-600 px-4 py-2 text-sm font-extrabold text-white"
          >
            Balik ke Home
          </Link>
        </div>
      </main>
    );
  }

  const sellers = listSellersByParish(parish.slug);

  const allProductsInParish = PRODUCTS.filter((x) => x.parishSlug === parish.slug);
  const bestSellers = [...allProductsInParish]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 12);

  const trendingRaw = allProductsInParish.filter((x) => x.isTrending);
  const trending = (trendingRaw.length > 0 ? trendingRaw : bestSellers).slice(0, 10);

  return (
    <main className="min-h-dvh bg-gradient-to-b from-orange-50 via-amber-50 to-white">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <Link
          href="/"
          className="text-sm font-bold text-orange-700 underline decoration-orange-300"
        >
          ← Home
        </Link>

        <div className="mt-4 rounded-3xl border border-stone-200 bg-white/75 p-6 shadow-sm backdrop-blur">
          <h1 className="text-2xl font-black text-stone-900">{parish.name}</h1>
          <p className="mt-1 text-sm font-semibold text-stone-600">Area: {parish.area}</p>
        </div>

        <Section title="Seller UMKM" subtitle="Pilih seller dulu (mini site), baru lanjut laper-laperan.">
          {sellers.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sellers.map((s) => {
                const top = listProductsBySeller(parish.slug, s.slug)
                  .slice()
                  .sort((a, b) => b.soldCount - a.soldCount)
                  .slice(0, 3);

                return <SellerCard key={s.slug} parish={parish} seller={s} topProducts={top} />;
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm font-semibold text-stone-700 shadow-sm">
              Belum ada seller untuk paroki ini. Nanti admin tinggal approve seller 😄
            </div>
          )}
        </Section>

        <Section
          title="Trending di paroki ini"
          subtitle="Demo dulu. Nanti basis real: log & order."
          id="trending"
        >
          {trending.length > 0 ? (
            <Carousel>
              {trending.map((x) => {
                const seller = getSeller(parish.slug, x.sellerSlug);
                if (!seller) return null;

                return (
                  <ProductCard
                    key={`${seller.slug}-${x.slug}`}
                    parish={parish}
                    seller={seller}
                    product={x}
                  />
                );
              })}
            </Carousel>
          ) : (
            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm font-semibold text-stone-700 shadow-sm">
              Belum ada produk demo di paroki ini.
            </div>
          )}
        </Section>

        <Section title="Terlaris" subtitle="Basis demo: sold count.">
          {bestSellers.length > 0 ? (
            <Carousel>
              {bestSellers.map((x) => {
                const seller = getSeller(parish.slug, x.sellerSlug);
                if (!seller) return null;

                return (
                  <ProductCard
                    key={`${seller.slug}-${x.slug}`}
                    parish={parish}
                    seller={seller}
                    product={x}
                  />
                );
              })}
            </Carousel>
          ) : (
            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm font-semibold text-stone-700 shadow-sm">
              Belum ada produk demo di paroki ini.
            </div>
          )}
        </Section>
      </div>
    </main>
  );
}
