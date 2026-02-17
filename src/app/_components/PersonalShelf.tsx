"use client";

import { useMemo, useSyncExternalStore } from "react";
import { ProductCard } from "@/app/_components/ProductCard";
import {
  clearFavorites,
  clearRecents,
  getFavorites,
  getRecents,
  FAVORITES_STORAGE_KEY,
  RECENTS_STORAGE_KEY,
  PERSONAL_EVENT_NAME,
  type ProductKey,
} from "@/app/_lib/personalShelf";
import {
  getParishBySlug,
  getProduct,
  getSeller,
  type Parish,
  type Product,
  type Seller,
} from "@/app/_data/demo";

type CardItem = {
  parish: Parish;
  seller: Seller;
  product: Product;
  key: ProductKey;
};

type Props = {
  hide?: boolean;
};

const EMPTY_KEYS: ProductKey[] = [];

function resolveKey(k: ProductKey): CardItem | null {
  const [parishSlug, sellerSlug, productSlug] = k.split("/");
  if (!parishSlug || !sellerSlug || !productSlug) return null;

  const parish = getParishBySlug(parishSlug);
  if (!parish) return null;

  const seller = getSeller(parish.slug, sellerSlug);
  if (!seller) return null;

  const product = getProduct(parish.slug, seller.slug, productSlug);
  if (!product) return null;

  return { parish, seller, product, key: k };
}

function makeSubscribe(storageKey: string) {
  return (onStoreChange: () => void) => {
    if (typeof window === "undefined") return () => undefined;

    const onCustom = () => onStoreChange();
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey || e.key === null) onStoreChange();
    };

    window.addEventListener(PERSONAL_EVENT_NAME, onCustom);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(PERSONAL_EVENT_NAME, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  };
}

export function PersonalShelf({ hide }: Props) {
  // ✅ subscribe function harus stabil (biar gak resubscribe terus)
  const subscribeFavorites = useMemo(() => makeSubscribe(FAVORITES_STORAGE_KEY), []);
  const subscribeRecents = useMemo(() => makeSubscribe(RECENTS_STORAGE_KEY), []);

  // ✅ getServerSnapshot harus cached / referensi stabil (bukan () => [])
  const favorites = useSyncExternalStore(subscribeFavorites, getFavorites, () => EMPTY_KEYS);
  const recents = useSyncExternalStore(subscribeRecents, getRecents, () => EMPTY_KEYS);

  const favItems = useMemo(
    () => favorites.map(resolveKey).filter((x): x is CardItem => x !== null),
    [favorites]
  );

  const recentItems = useMemo(
    () => recents.map(resolveKey).filter((x): x is CardItem => x !== null),
    [recents]
  );

  if (hide) return null;
  if (favItems.length === 0 && recentItems.length === 0) return null;

  return (
    <section className="mt-10">
      {favItems.length > 0 ? (
        <div className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-stone-900">❤️ Favorit kamu</h2>
              <p className="mt-1 text-sm text-stone-600">
                Disimpan di device ini (tanpa login). Aman & simpel.
              </p>
            </div>
            <button
              type="button"
              onClick={() => clearFavorites()}
              className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-extrabold text-stone-800 shadow-sm transition hover:bg-stone-50"
            >
              Hapus favorit
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
            {favItems.map(({ parish, seller, product, key }) => (
              <ProductCard
                key={`fav-${key}`}
                parish={parish}
                seller={seller}
                product={product}
              />
            ))}
          </div>
        </div>
      ) : null}

      {recentItems.length > 0 ? (
        <div>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-stone-900">🕒 Terakhir kamu lihat</h2>
              <p className="mt-1 text-sm text-stone-600">
                Biar gampang balik lagi tanpa nyari ulang.
              </p>
            </div>
            <button
              type="button"
              onClick={() => clearRecents()}
              className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-extrabold text-stone-800 shadow-sm transition hover:bg-stone-50"
            >
              Bersihin riwayat
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
            {recentItems.map(({ parish, seller, product, key }) => (
              <ProductCard
                key={`recent-${key}`}
                parish={parish}
                seller={seller}
                product={product}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default PersonalShelf;
