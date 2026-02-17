"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Parish, Product, Seller } from "../_data/demo";
import { formatRupiah } from "../_lib/money";
import {
  addRecent,
  isFavorite,
  makeProductKey,
  toggleFavorite,
  type ProductKey,
} from "../_lib/personalShelf";

type Props = {
  parish: Parish;
  seller: Seller;
  product: Product & {
    imageUrl?: string;
    imageAlt?: string;
  };
};

export function ProductCard({ parish, seller, product }: Props) {
  const productKey: ProductKey = useMemo(
    () => makeProductKey(parish.slug, seller.slug, product.slug),
    [parish.slug, seller.slug, product.slug]
  );

  const [fav, setFav] = useState<boolean>(false);

  useEffect(() => {
    setFav(isFavorite(productKey));
  }, [productKey]);

  const hasImage = typeof product.imageUrl === "string" && product.imageUrl.trim().length > 0;

  return (
    <Link
      href={`/${parish.slug}/${seller.slug}/${product.slug}`}
      onClick={() => addRecent(productKey)}
      className="group relative w-[260px] shrink-0 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Heart */}
      <button
        type="button"
        aria-label={fav ? "Hapus dari favorit" : "Tambah ke favorit"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const next = toggleFavorite(productKey);
          setFav(next);
        }}
        className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-xl border border-stone-200 bg-white/90 text-lg shadow-sm transition hover:bg-white"
        title={fav ? "Unfavorite" : "Favorite"}
      >
        <span className={fav ? "text-rose-600" : "text-stone-500"}>♥</span>
      </button>

      {/* Banner */}
      <div className="relative h-32">
        {hasImage ? (
          <>
            <Image
              src={product.imageUrl as string}
              alt={product.imageAlt ?? product.name}
              fill
              className="object-cover"
              sizes="260px"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-white/90" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-100 to-amber-50" />
        )}

        {/* Parish badge */}
        <div className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[11px] font-extrabold text-stone-800 shadow-sm">
          {parish.name}
        </div>

        {/* Seller strip */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/90 text-xl shadow-sm">
            {product.emoji ?? "🍽️"}
          </div>
          <div className="text-sm font-extrabold text-stone-900 drop-shadow-sm">
            {seller.name}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="text-base font-extrabold text-stone-900">{product.name}</div>
        <p className="mt-1 line-clamp-2 text-sm text-stone-600">{product.desc}</p>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="text-sm font-black text-orange-700">{formatRupiah(product.price)}</div>

          <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-800">
            {product.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
