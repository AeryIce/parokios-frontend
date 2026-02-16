import Link from "next/link";
import { formatRupiah } from "../_lib/money";
import type { Product } from "../_data/demo";
import { getParishBySlug, minVariantPrice } from "../_data/demo";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const parish = getParishBySlug(product.parishSlug);
  const price = minVariantPrice(product);

  return (
    <Link
      href={`/${product.parishSlug}/${product.sellerSlug}/${product.slug}`}
      className="group block w-[260px] shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="relative h-40 w-full overflow-hidden bg-amber-50 dark:bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-zinc-900 shadow-sm backdrop-blur dark:bg-black/60 dark:text-zinc-50">
          {parish ? parish.name.replace("Paroki ", "Paroki: ") : "Paroki: -"}
        </div>
      </div>

      <div className="p-4">
        <div className="text-sm font-black text-zinc-900 dark:text-zinc-50">
          {product.name}
        </div>
        <div className="mt-1 line-clamp-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          {product.description}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm font-black text-amber-700 dark:text-amber-300">
            {formatRupiah(price)}
          </div>
          <div className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-black text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
            {product.category}
          </div>
        </div>
      </div>
    </Link>
  );
}
