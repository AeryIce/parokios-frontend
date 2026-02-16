import Link from "next/link";
import type { Product, Parish, Seller } from "../_data/demo";

type Props = {
  parish: Parish;
  seller: Seller;
  product: Product;
};

function rupiah(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

export function ProductCard({ parish, seller, product }: Props) {
  return (
    <Link
      href={`/${parish.slug}/${seller.slug}/${product.slug}`}
      className="group w-[260px] shrink-0 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-32 bg-gradient-to-br from-amber-100 via-orange-100 to-amber-50">
        <div className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[11px] font-extrabold text-stone-800 shadow-sm">
          {parish.name}
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/90 text-xl shadow-sm">
            {product.emoji ?? "🍽️"}
          </div>
          <div className="text-sm font-extrabold text-stone-900 drop-shadow-sm">
            {seller.name}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="text-base font-extrabold text-stone-900">
          {product.name}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-stone-600">
          {product.desc}
        </p>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="text-sm font-black text-orange-700">
            Rp {rupiah(product.price)}
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-800">
              {product.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
