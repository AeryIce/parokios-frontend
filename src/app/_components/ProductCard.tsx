import Link from "next/link";
import Image from "next/image";
import type { Parish, Product, Seller } from "../_data/demo";
import { minVariantPrice } from "../_data/demo";

type Props = {
  parish: Parish;
  seller: Seller;
  product: Product;
};

export function ProductCard({ parish, seller, product }: Props) {
  const price = minVariantPrice(product);

  return (
    <Link
      href={`/${parish.slug}/${seller.slug}/${product.slug}`}
      className="block w-[280px] shrink-0 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative border-b border-stone-200 p-4">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.imageAlt ?? product.name}
            fill
            className="object-cover opacity-55"
            sizes="(max-width: 768px) 85vw, 320px"
            priority={false}
          />
        ) : null}

        {/* overlay biar teks tetap kebaca + tetep capucino vibe */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/85 via-orange-100/80 to-rose-100/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/35 to-transparent" />

        <div className="relative flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-stone-200 bg-white text-2xl shadow-sm">
            {product.emoji}
          </div>

          <div className="min-w-0">
            <div className="text-xs font-extrabold text-stone-700">
              {parish.name}
            </div>
            <div className="truncate text-sm font-black text-stone-900">
              {seller.name}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="text-base font-black text-stone-900">{product.name}</div>
        <div className="mt-1 line-clamp-2 text-sm font-semibold text-stone-600">
          {product.desc}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-stone-500">Mulai dari</div>
            <div className="text-lg font-black text-orange-700">
              Rp {price.toLocaleString("id-ID")}
            </div>
          </div>

          <span className="rounded-full border border-stone-200 bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-800">
            {product.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
