import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getParishBySlug,
  getProduct,
  getSeller,
  minVariantPrice,
} from "@/app/_data/demo";

type Params = { parishSlug: string; sellerSlug: string; productSlug: string };
type Props = { params: Params | Promise<Params> };

export default async function ProductPage({ params }: Props) {
  const p = await Promise.resolve(params);

  const parish = getParishBySlug(p.parishSlug);
  const seller = getSeller(p.parishSlug, p.sellerSlug);
  const product = getProduct(p.parishSlug, p.sellerSlug, p.productSlug);

  if (!parish || !seller || !product) notFound();

  const price = minVariantPrice(product);

  return (
    <main className="min-h-dvh bg-gradient-to-b from-orange-50 via-amber-50 to-white">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex items-center justify-between">
          <Link
            href={`/${parish.slug}/${seller.slug}`}
            className="text-sm font-bold text-orange-700 underline decoration-orange-300"
          >
            ← {seller.name}
          </Link>

          <Link
            href={`/${parish.slug}`}
            className="text-sm font-bold text-stone-700 hover:underline"
          >
            {parish.name}
          </Link>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-stone-200 bg-white/75 shadow-sm backdrop-blur">
          {product.imageUrl ? (
            <div className="relative h-64 w-full">
              <Image
                src={product.imageUrl}
                alt={product.imageAlt ?? product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 960px"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent" />
            </div>
          ) : null}

          <div className="p-6">
            <div className="text-sm font-extrabold text-stone-700">
              {parish.name} • {seller.name}
            </div>

            <h1 className="mt-2 flex items-center gap-2 text-4xl font-black tracking-tight text-stone-900">
              <span>{product.emoji}</span>
              <span>{product.name}</span>
            </h1>

            <p className="mt-2 text-sm font-semibold text-stone-700">
              {product.desc}
            </p>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
              <div className="text-2xl font-black text-orange-700">
                Rp {price.toLocaleString("id-ID")}
              </div>

              <span className="rounded-full border border-stone-200 bg-amber-50 px-4 py-2 text-xs font-extrabold text-amber-800 shadow-sm">
                {product.category}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-stone-200 bg-white/80 p-5 text-sm font-semibold text-stone-700 shadow-sm">
          Checkout/Chat WA kita masukin sesi berikutnya ya bro. Sekarang target:
          semua route aman + gak error Next 😁
        </div>
      </div>
    </main>
  );
}
