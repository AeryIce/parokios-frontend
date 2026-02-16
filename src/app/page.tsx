import Link from "next/link";
import AreaPicker from "./_components/AreaPicker";
import Carousel from "./_components/Carousel";
import ProductCard from "./_components/ProductCard";
import Section from "./_components/Section";
import {
  demoProducts,
  demoTrending,
  getParishBySlug,
  listAreas,
  minVariantPrice,
} from "./_data/demo";

type SearchParams = Record<string, string | string[] | undefined>;

type HomeProps = {
  // Next versi kamu treat ini sebagai Promise (dynamic API)
  searchParams?: SearchParams | Promise<SearchParams>;
};

function pickOne(param: string | string[] | undefined): string | null {
  if (typeof param === "string") return param;
  if (Array.isArray(param) && typeof param[0] === "string") return param[0];
  return null;
}

export default async function Home({ searchParams }: HomeProps) {
  const sp = await Promise.resolve(searchParams);

  const areaParam = pickOne(sp?.area) ?? "Jakarta Timur";
  const qParam = (pickOne(sp?.q) ?? "").trim().toLowerCase();

  const areas = listAreas();

  const withParish = demoProducts.map((p) => {
    const parish = getParishBySlug(p.parishSlug);
    return { product: p, parish };
  });

  const nearYou = withParish
    .filter((x) => x.parish?.area === areaParam)
    .map((x) => x.product);

  const bestSellers = [...demoProducts]
    .sort((a, b) => b.stats.sold - a.stats.sold)
    .slice(0, 10);

  const cheapest = [...demoProducts]
    .sort((a, b) => minVariantPrice(a) - minVariantPrice(b))
    .slice(0, 10);

  const newest = [...demoProducts]
    .sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso))
    .slice(0, 10);

  const trendingInArea = demoTrending
    .filter((t) => t.area === areaParam)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const searchResults =
    qParam.length < 2
      ? []
      : demoProducts.filter((p) => {
          const hay = `${p.name} ${p.description} ${p.category}`.toLowerCase();
          return hay.includes(qParam);
        });

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-rose-50 px-6 py-10 text-zinc-900 dark:from-zinc-950 dark:via-black dark:to-zinc-950 dark:text-zinc-50">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2">
              <div className="text-3xl font-black tracking-tight">Parokios</div>
              <span className="rounded-full bg-rose-600/90 px-3 py-1 text-xs font-black text-white shadow-sm">
                food-first
              </span>
            </div>
            <div className="mt-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Bikin laper dulu. Bayarnya transfer manual. Bukti transfer aman.
            </div>
          </div>

          <AreaPicker areas={areas} currentArea={areaParam} />
        </div>

        {/* Hero “bikin laper” */}
        <div className="mt-6 rounded-3xl border border-orange-200/70 bg-white/75 p-5 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-black">
                🍗 Laper? mulai dari yang dekat dulu.
              </div>
              <div className="mt-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Area kamu: <span className="font-black text-rose-700 dark:text-rose-300">{areaParam}</span>
                {" • "}
                Nanti ada “terlaris”, “termurah”, dan “baru nongol”.
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href="#terlaris"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-black text-white shadow-sm transition hover:bg-rose-700"
              >
                Lihat terlaris 🔥
              </a>
              <a
                href="#trending"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-orange-200/70 bg-white px-4 text-sm font-black text-zinc-900 shadow-sm transition hover:bg-rose-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                Trending 🍜
              </a>
            </div>
          </div>
        </div>

        {/* Search */}
        <form
          className="mt-4 flex items-center gap-3 rounded-2xl border border-orange-200/70 bg-white/80 p-3 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70"
          action="/"
        >
          <input
            name="q"
            defaultValue={qParam}
            placeholder="Cari… nastar, hampers, snack box, sambal…"
            className="h-10 w-full rounded-xl bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-zinc-500 dark:placeholder:text-zinc-500"
          />
          <input type="hidden" name="area" value={areaParam} />
          <button
            type="submit"
            className="h-10 shrink-0 rounded-xl bg-rose-600 px-4 text-sm font-black text-white shadow-sm transition hover:bg-rose-700"
          >
            Cari
          </button>
        </form>

        {/* Search results */}
        {searchResults.length > 0 ? (
          <Section
            title={`Hasil cari (demo): “${qParam}”`}
            subtitle="Nanti ini jadi search beneran + tracking keyword (buat insight seller)."
          >
            <Carousel>
              {searchResults.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </Carousel>
          </Section>
        ) : null}

        {/* Near you */}
        <Section
          title="Enak di dekatmu"
          subtitle={`Area: ${areaParam} (coarse, aman privasi).`}
        >
          {nearYou.length > 0 ? (
            <Carousel>
              {nearYou.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </Carousel>
          ) : (
            <div className="rounded-2xl border border-orange-200/70 bg-white/80 p-6 text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300">
              Belum ada demo produk untuk area ini. Ganti area dulu ya 😄
            </div>
          )}
        </Section>

        {/* Best sellers */}
        <div id="terlaris" />
        <Section
          title="Terlaris minggu ini"
          subtitle="Basis demo: sold count. Nanti basis real: order selesai."
        >
          <Carousel>
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Carousel>
        </Section>

        {/* Cheapest */}
        <Section title="Murah tapi bahagia" subtitle="Diurut dari harga varian termurah.">
          <Carousel>
            {cheapest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Carousel>
        </Section>

        {/* Newest */}
        <Section title="Baru nongol" subtitle="Biar seller semangat update & SEO makin wangi.">
          <Carousel>
            {newest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Carousel>
        </Section>

        {/* Trending */}
        <div id="trending" />
        <Section title="Trending search" subtitle="Demo keyword. Nanti dari log search/view/checkout_start.">
          {trendingInArea.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {trendingInArea.map((t) => (
                <Link
                  key={`${t.area}-${t.keyword}`}
                  href={`/?area=${encodeURIComponent(areaParam)}&q=${encodeURIComponent(t.keyword)}`}
                  className="rounded-full border border-orange-200/70 bg-white/80 px-4 py-2 text-sm font-black text-zinc-900 shadow-sm backdrop-blur transition hover:border-rose-200 hover:bg-rose-50 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  {t.keyword}{" "}
                  <span className="text-xs font-semibold opacity-70">({t.count})</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Belum ada trending demo untuk area ini.
            </div>
          )}
        </Section>

        {/* Footer */}
        <div className="mt-14 border-t border-orange-200/60 pt-6 text-xs font-semibold text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <div>
            Parokios itu marketplace paroki tanpa payment gateway. Buyer chat WA, transfer manual,
            upload bukti. Sederhana, tapi aman.
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
