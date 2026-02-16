import { notFound } from "next/navigation";
import { formatRupiah } from "../../../_lib/money";
import { getParishBySlug, getProductBySlug, getSellerBySlug, minVariantPrice } from "../../../_data/demo";

type Props = {
  params: { parishSlug: string; sellerSlug: string; productSlug: string };
};

export default function ProductPage({ params }: Props) {
  const parish = getParishBySlug(params.parishSlug);
  const seller = getSellerBySlug(params.parishSlug, params.sellerSlug);
  const product = getProductBySlug(params.parishSlug, params.sellerSlug, params.productSlug);

  if (!parish || !seller || !product) notFound();

  const fromPrice = minVariantPrice(product);

  return (
    <main className="min-h-screen bg-amber-50 px-6 py-10 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-4xl">
        <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {parish.name} • {seller.name}
        </div>

        <div className="mt-2 text-3xl font-black">{product.name}</div>
        <div className="mt-2 text-base font-semibold text-zinc-700 dark:text-zinc-300">
          {product.description}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.imageUrl} alt={product.name} className="h-72 w-full object-cover" />
          <div className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-lg font-black text-amber-700 dark:text-amber-300">
                Mulai {formatRupiah(fromPrice)}
              </div>
              <div className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-black text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                {product.category}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-black">Varian (demo)</div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {product.variants.map((v) => (
                  <div
                    key={v.id}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <div className="font-black">{v.label}</div>
                    <div className="text-zinc-700 dark:text-zinc-300">{formatRupiah(v.price)}</div>
                  </div>
                ))}
              </div>
            </div>

            <a
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
              href={`https://wa.me/${seller.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              Chat WA & Pesan
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
