import Link from "next/link";
import type { Parish, Product, Seller } from "../_data/demo";

type Props = {
  parish: Parish;
  seller: Seller;
  topProducts: readonly Product[];
};

export function SellerCard({ parish, seller, topProducts }: Props) {
  return (
    <Link
      href={`/${parish.slug}/${seller.slug}`}
      className="group rounded-3xl border border-stone-200 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-black text-stone-900">{seller.name}</div>
          <div className="mt-1 text-xs font-semibold text-stone-600">
            {seller.tagline}
          </div>
        </div>

        <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-800">
          {parish.area}
        </span>
      </div>

      {topProducts.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {topProducts.slice(0, 3).map((p) => (
            <span
              key={p.slug}
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-[11px] font-bold text-stone-800"
            >
              <span aria-hidden>{p.emoji ?? "🍽️"}</span>
              {p.name}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-orange-700">
        Lihat etalase
        <span
          aria-hidden
          className="transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </div>
    </Link>
  );
}
