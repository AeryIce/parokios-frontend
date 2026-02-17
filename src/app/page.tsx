import Link from "next/link";
import { Suspense } from "react";
import { AreaPicker } from "@/app/_components/AreaPicker";
import { Carousel } from "@/app/_components/Carousel";
import { ProductCard } from "@/app/_components/ProductCard";
import { Section } from "@/app/_components/Section";
import {
  getParishBySlug,
  getSeller,
  listAreas,
  listParishesByArea,
  listProductsByArea,
  PRODUCTS,
  type Area,
  type Parish,
  type Product,
  type Seller,
} from "@/app/_data/demo";

type SearchParams = Record<string, string | string[] | undefined>;

type HomeProps = {
  // Next kadang treat ini sebagai Promise (dynamic API)
  searchParams?: SearchParams | Promise<SearchParams>;
};

type CardItem = {
  parish: Parish;
  seller: Seller;
  product: Product;
};

function pickOne(param: string | string[] | undefined): string | null {
  if (typeof param === "string") return param;
  if (Array.isArray(param) && typeof param[0] === "string") return param[0];
  return null;
}

function coerceArea(raw: string | null, areas: readonly Area[]): Area {
  const fallback = areas[0] ?? "Jakarta Timur";
  if (!raw) return fallback;
  return areas.includes(raw as Area) ? (raw as Area) : fallback;
}

function toCardItems(products: readonly Product[]): CardItem[] {
  const out: CardItem[] = [];

  for (const p of products) {
    const parish = getParishBySlug(p.parishSlug);
    if (!parish) continue;

    const seller = getSeller(parish.slug, p.sellerSlug);
    if (!seller) continue;

    out.push({ parish, seller, product: p });
  }

  return out;
}

export default async function Home({ searchParams }: HomeProps) {
  const sp = await Promise.resolve(searchParams);

  const areas = listAreas();
  const area = coerceArea(pickOne(sp?.area), areas);
  const q = (pickOne(sp?.q) ?? "").trim().toLowerCase();

  const nearYou = listProductsByArea(area);
  const parishesInArea = listParishesByArea(area);

  const bestSellers = [...PRODUCTS]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 10);

  const cheapest = [...PRODUCTS].sort((a, b) => a.price - b.price).slice(0, 10);

  const newestRaw = PRODUCTS.filter((p) => p.isNew);
  const newest = (newestRaw.length > 0 ? newestRaw : [...PRODUCTS].reverse()).slice(
    0,
    10
  );

  const trendingRaw = PRODUCTS.filter((p) => p.isTrending);
  const trending = (trendingRaw.length > 0 ? trendingRaw : bestSellers).slice(0, 10);

  const searchResults =
    q.length < 2
      ? []
      : PRODUCTS.filter((p) => {
          const parish = getParishBySlug(p.parishSlug);
          const seller = parish ? getSeller(parish.slug, p.sellerSlug) : null;

          const hay = `${p.name} ${p.desc} ${p.category} ${seller?.name ?? ""}`
            .toLowerCase()
            .trim();

          return hay.includes(q);
        }).slice(0, 18);

  const categoryCounts = new Map<string, number>();
  for (const p of nearYou) {
    categoryCounts.set(p.category, (categoryCounts.get(p.category) ?? 0) + 1);
  }
  const trendingCategories = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([category]) => category);

  return (
    <main className="min-h-dvh bg-gradient-to-b from-orange-50 via-amber-50 to-rose-50 px-6 py-10 text-stone-900">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2">
              <div className="text-3xl font-black tracking-tight">Parokios</div>
              <span className="rounded-full bg-amber-600/90 px-3 py-1 text-xs font-black text-white shadow-sm">
                food-first
              </span>
            </div>
            <div className="mt-1 text-sm font-semibold text-stone-700">
              Bikin laper dulu. Bayarnya transfer manual. Bukti transfer aman.
            </div>
          </div>

          {/* FIX: useSearchParams() di client component harus dibungkus Suspense */}
          <Suspense
            fallback={
              <div className="h-10 w-44 rounded-xl border border-orange-200/70 bg-white/70 shadow-sm backdrop-blur" />
            }
          >
            <AreaPicker areas={areas} currentArea={area} />
          </Suspense>
        </div>

        {/* Hero */}
        <div className="mt-6 rounded-3xl border border-orange-200/70 bg-white/75 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-black">🍗 Laper? mulai dari yang dekat dulu.</div>
              <div className="mt-1 text-sm font-semibold text-stone-700">
                Area kamu: <span className="font-black text-orange-700">{area}</span>
                {" • "}
                nanti ada “terlaris”, “termurah”, dan “baru nongol”.
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href="#terlaris"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-amber-600 px-4 text-sm font-black text-white shadow-sm transition hover:bg-amber-700"
              >
                Lihat terlaris 🔥
              </a>
              <a
                href="#trending"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-orange-200/70 bg-white px-4 text-sm font-black text-stone-900 shadow-sm transition hover:bg-rose-50"
              >
                Trending 🍜
              </a>
            </div>
          </div>

          {parishesInArea.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {parishesInArea.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${p.slug}`}
                  className="rounded-full border border-orange-200/70 bg-white/80 px-4 py-2 text-sm font-black text-stone-900 shadow-sm transition hover:border-rose-200 hover:bg-rose-50"
                >
                  {p.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {/* Search */}
        <form
          className="mt-4 flex items-center gap-3 rounded-2xl border border-orange-200/70 bg-white/80 p-3 shadow-sm backdrop-blur"
          action="/"
        >
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari… nastar, hampers, snack box, sambal…"
            className="h-10 w-full rounded-xl bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-stone-500"
          />
          <input type="hidden" name="area" value={area} />
          <button
            type="submit"
            className="h-10 shrink-0 rounded-xl bg-amber-600 px-4 text-sm font-black text-white shadow-sm transition hover:bg-amber-700"
          >
            Cari
          </button>
        </form>

        {q.length >= 2 && searchResults.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-orange-200/70 bg-white/80 p-6 text-sm font-semibold text-stone-700 shadow-sm">
            Hasil cari “<span className="font-black">{q}</span>” belum ketemu. Coba kata lain ya 😄
          </div>
        ) : null}

        {/* Search results */}
        {searchResults.length > 0 ? (
          <Section
            title={`Hasil cari (demo): “${q}”`}
            subtitle="Nanti ini jadi search beneran + tracking keyword (buat insight seller)."
          >
            <Carousel>
              {toCardItems(searchResults).map(({ parish, seller, product }) => (
                <ProductCard
                  key={`${parish.slug}-${seller.slug}-${product.slug}`}
                  parish={parish}
                  seller={seller}
                  product={product}
                />
              ))}
            </Carousel>
          </Section>
        ) : null}

        {/* Near you */}
        <Section title="Enak di dekatmu" subtitle={`Area: ${area} (coarse, aman privasi).`}>
          {nearYou.length > 0 ? (
            <Carousel>
              {toCardItems(nearYou).map(({ parish, seller, product }) => (
                <ProductCard
                  key={`${parish.slug}-${seller.slug}-${product.slug}`}
                  parish={parish}
                  seller={seller}
                  product={product}
                />
              ))}
            </Carousel>
          ) : (
            <div className="rounded-2xl border border-orange-200/70 bg-white/80 p-6 text-sm font-semibold text-stone-700 shadow-sm">
              Belum ada demo produk untuk area ini. Ganti area dulu ya 😄
            </div>
          )}
        </Section>

        {/* Best sellers */}
        <div id="terlaris" />
        <Section title="Terlaris minggu ini" subtitle="Basis demo: sold count. Nanti basis real: order selesai.">
          <Carousel>
            {toCardItems(bestSellers).map(({ parish, seller, product }) => (
              <ProductCard
                key={`${parish.slug}-${seller.slug}-${product.slug}`}
                parish={parish}
                seller={seller}
                product={product}
              />
            ))}
          </Carousel>
        </Section>

        {/* Cheapest */}
        <Section title="Murah tapi bahagia" subtitle="Diurut dari harga termurah.">
          <Carousel>
            {toCardItems(cheapest).map(({ parish, seller, product }) => (
              <ProductCard
                key={`${parish.slug}-${seller.slug}-${product.slug}`}
                parish={parish}
                seller={seller}
                product={product}
              />
            ))}
          </Carousel>
        </Section>

        {/* Newest */}
        <Section title="Baru nongol" subtitle="Biar seller semangat update & SEO makin wangi.">
          <Carousel>
            {toCardItems(newest).map(({ parish, seller, product }) => (
              <ProductCard
                key={`${parish.slug}-${seller.slug}-${product.slug}`}
                parish={parish}
                seller={seller}
                product={product}
              />
            ))}
          </Carousel>
        </Section>

        {/* Trending */}
        <div id="trending" />
        <Section title="Trending" subtitle="Demo: produk yang ditandai trending + kategori terpopuler di area.">
          <Carousel>
            {toCardItems(trending).map(({ parish, seller, product }) => (
              <ProductCard
                key={`${parish.slug}-${seller.slug}-${product.slug}`}
                parish={parish}
                seller={seller}
                product={product}
              />
            ))}
          </Carousel>

          {trendingCategories.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {trendingCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/?area=${encodeURIComponent(area)}&q=${encodeURIComponent(cat)}`}
                  className="rounded-full border border-orange-200/70 bg-white/80 px-4 py-2 text-sm font-black text-stone-900 shadow-sm transition hover:border-rose-200 hover:bg-rose-50"
                >
                  {cat}
                </Link>
              ))}
            </div>
          ) : null}
        </Section>

        {/* Footer */}
        <div className="mt-14 border-t border-orange-200/60 pt-6 text-xs font-semibold text-stone-600">
          <div>
            Parokios itu marketplace paroki tanpa payment gateway. Buyer chat WA, transfer manual, upload bukti.
            Sederhana, tapi aman.
          </div>
          <div className="mt-2">
            Debug:{" "}
            <Link className="underline" href="/debug/probe">
              /debug/probe
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
