import AreaPicker from "./_components/AreaPicker";
import Carousel from "./_components/Carousel";
import ProductCard from "./_components/ProductCard";
import Section from "./_components/Section";
import { demoProducts, demoTrending, getParishBySlug, listAreas, minVariantPrice } from "./_data/demo";

type HomeProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function pickOne(param: string | string[] | undefined): string | null {
  if (typeof param === "string") return param;
  if (Array.isArray(param) && typeof param[0] === "string") return param[0];
  return null;
}

export default function Home({ searchParams }: HomeProps) {
  const areaParam = pickOne(searchParams?.area) ?? "Jakarta Timur";
  const qParam = (pickOne(searchParams?.q) ?? "").trim().toLowerCase();

  const areas = listAreas();

  const withParish = demoProducts.map((p) => {
    const parish = getParishBySlug(p.parishSlug);
    return { product: p, parish };
  });

  const nearYou = withParish
    .filter((x) => x.parish?.area === areaParam)
    .map((x) => x.product);

  const bestSellers = [...demoProducts].sort((a, b) => b.stats.sold - a.stats.sold).slice(0, 10);
  const cheapest = [...demoProducts].sort((a, b) => minVariantPrice(a) - minVariantPrice(b)).slice(0, 10);
  const newest = [...demoProducts].sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso)).slice(0, 10);

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
    <main className="min-h-screen bg-amber-50 px-6 py-10 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-3xl font-black tracking-tight">Parokios</div>
            <div className="mt-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Etalase UMKM per paroki. Bikin laper dulu, urusan bayar belakangan.
            </div>
          </div>

          <AreaPicker areas={areas} currentArea={areaParam} />
        </div>

        {/* Search */}
        <form
          className="mt-6 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          action="/"
        >
          <input
            name="q"
            defaultValue={qParam}
            placeholder="Cari… nastar, hampers, snack box, sambal…"
            className="h-10 w-full rounded-xl bg-transparent px-3 text-sm font-semibold outline-none"
          />
          <input type="hidden" name="area" value={areaParam} />
          <button
            type="submit"
            className="h-10 shrink-0 rounded-xl bg-amber-500 px-4 text-sm font-black text-white shadow-sm transition hover:bg-amber-600"
          >
            Cari
          </button>
        </form>

        {/* Search results (demo) */}
        {searchResults.length > 0 ? (
          <Section
            title={`Hasil cari (demo): “${qParam}”`}
            subtitle="Nanti ini akan jadi search beneran + tracking keyword (buat insight seller)."
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
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
              Belum ada demo produk untuk area ini. Ganti area dulu ya 😄
            </div>
          )}
        </Section>

        {/* Best sellers */}
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

        {/* New */}
        <Section title="Baru nongol" subtitle="Biar seller semangat update & SEO makin wangi.">
          <Carousel>
            {newest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Carousel>
        </Section>

        {/* Trending */}
        <Section title="Trending search" subtitle="Demo keyword. Nanti dari log search/view/checkout_start.">
          {trendingInArea.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {trendingInArea.map((t) => (
                <a
                  key={`${t.area}-${t.keyword}`}
                  href={`/?area=${encodeURIComponent(areaParam)}&q=${encodeURIComponent(t.keyword)}`}
                  className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-black text-zinc-800 shadow-sm transition hover:bg-amber-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                >
                  {t.keyword} <span className="text-xs font-semibold opacity-70">({t.count})</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Belum ada trending demo untuk area ini.
            </div>
          )}
        </Section>

        {/* Footer */}
        <div className="mt-14 border-t border-zinc-200 pt-6 text-xs font-semibold text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <div>
            Parokios itu marketplace paroki tanpa payment gateway. Buyer chat WA, transfer manual,
            upload bukti. Sederhana, tapi aman.
          </div>
          <div className="mt-2">
            Debug: <a className="underline" href="/debug/probe">/debug/probe</a>
          </div>
        </div>
      </div>
    </main>
  );
}
