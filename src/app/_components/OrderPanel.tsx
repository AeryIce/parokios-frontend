"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatRupiah } from "@/app/_lib/money";
import { buildWhatsAppLink } from "@/app/_lib/wa";

export type OrderVariant = {
  sku: string;
  label: string;
  price: number;
  stock?: number | null;
};

type Props = {
  parishName: string;
  sellerName: string;
  sellerWhatsApp: string;

  productName: string;
  productCategory: string;
  basePrice: number;

  productPath: string; // contoh: /rawamangun/oma-nanas/nastar...
  sellerPath?: string; // contoh: /rawamangun/oma-nanas
  backLabel?: string;

  variants?: readonly OrderVariant[];
};

function makeOrderCode() {
  // pendek & gampang diingat
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const pick = () => letters[Math.floor(Math.random() * letters.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${pick()}${pick()}-${num}`;
}

function clampInt(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function getAbsoluteUrl(path: string): string {
  if (typeof window === "undefined") return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const origin = window.location.origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function OrderPanel({
  parishName,
  sellerName,
  sellerWhatsApp,
  productName,
  productCategory,
  basePrice,
  productPath,
  sellerPath,
  backLabel,
  variants,
}: Props) {
  const orderCode = useMemo(() => makeOrderCode(), []);
  const productUrl = useMemo(() => getAbsoluteUrl(productPath), [productPath]);

  const hasVariants = Array.isArray(variants) && variants.length > 0;

  const [selectedSku, setSelectedSku] = useState<string>(hasVariants ? variants[0]!.sku : "");
  const selectedVariant = hasVariants ? variants.find((v) => v.sku === selectedSku) ?? variants[0]! : null;

  const [qty, setQty] = useState<number>(1);
  const [buyerName, setBuyerName] = useState<string>("");
  const [buyerWa, setBuyerWa] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const unitPrice = selectedVariant?.price ?? basePrice;
  const totalPrice = unitPrice * qty;

  const messageLines = [
    `Halo Kak ${sellerName} 🙏`,
    ``,
    `Saya mau pesan: ${productName}`,
    `Kategori: ${productCategory}`,
    `Paroki: ${parishName}`,
    selectedVariant ? `Varian: ${selectedVariant.label} (${selectedVariant.sku})` : null,
    `Qty: ${qty}`,
    `Harga: ${formatRupiah(unitPrice)} / item`,
    `Total: ${formatRupiah(totalPrice)}`,
    ``,
    buyerName.trim() ? `Nama: ${buyerName.trim()}` : null,
    buyerWa.trim() ? `WA: ${buyerWa.trim()}` : null,
    note.trim() ? `Catatan: ${note.trim()}` : null,
    ``,
    `Kode order: ${orderCode}`,
    `Link produk: ${productUrl}`,
    ``,
    `Boleh info stok & cara ordernya ya? Terima kasih 🙇‍♂️`,
  ].filter((x): x is string => typeof x === "string");

  const message = messageLines.join("\n");
  const waHref = buildWhatsAppLink(sellerWhatsApp, message);

  const canSend = buyerName.trim().length >= 2 && buyerWa.trim().length >= 8;

  const [copied, setCopied] = useState<boolean>(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback: do nothing
    }
  }

  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-3 text-sm font-extrabold text-stone-900">Pemesanan</div>

      {/* Variant selector */}
      {hasVariants ? (
        <div className="mb-4">
          <div className="mb-2 text-xs font-bold text-stone-600">Varian</div>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const active = v.sku === selectedSku;
              const stockLabel =
                typeof v.stock === "number" ? `stok ${v.stock}` : v.stock === null ? "" : "";

              return (
                <button
                  key={v.sku}
                  type="button"
                  onClick={() => setSelectedSku(v.sku)}
                  className={[
                    "rounded-2xl border px-4 py-3 text-left shadow-sm transition",
                    active
                      ? "border-orange-300 bg-orange-50"
                      : "border-stone-200 bg-white hover:bg-stone-50",
                  ].join(" ")}
                >
                  <div className="text-sm font-black text-stone-900">{v.label}</div>
                  <div className="mt-0.5 text-xs font-bold text-orange-700">
                    {formatRupiah(v.price)}
                    {stockLabel ? (
                      <span className="ml-2 font-semibold text-stone-500">{stockLabel}</span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Qty */}
      <div className="mb-4">
        <div className="mb-2 text-xs font-bold text-stone-600">Jumlah</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-stone-200 bg-white text-lg font-black hover:bg-stone-50"
            onClick={() => setQty((q) => clampInt(q - 1, 1, 99))}
          >
            −
          </button>
          <div className="w-14 rounded-xl border border-stone-200 bg-white px-3 py-2 text-center text-sm font-black">
            {qty}
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-stone-200 bg-white text-lg font-black hover:bg-stone-50"
            onClick={() => setQty((q) => clampInt(q + 1, 1, 99))}
          >
            +
          </button>

          <div className="ml-auto text-sm font-black text-stone-900">
            Total: <span className="text-orange-700">{formatRupiah(totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Buyer */}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs font-bold text-stone-600">Nama</span>
          <input
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="Contoh: Aga"
            className="h-11 rounded-2xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-900 outline-none focus:border-orange-300"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-bold text-stone-600">Nomor WA kamu</span>
          <input
            value={buyerWa}
            onChange={(e) => setBuyerWa(e.target.value)}
            placeholder="Contoh: 62812xxxxxxx"
            className="h-11 rounded-2xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-900 outline-none focus:border-orange-300"
          />
        </label>
      </div>

      {/* Note */}
      <label className="mt-4 grid gap-1">
        <span className="text-xs font-bold text-stone-600">Catatan untuk seller (opsional)</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Contoh: kirim sore / tolong bungkus rapi / pedasnya sedang"
          className="min-h-[88px] resize-none rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none focus:border-orange-300"
        />
      </label>

      {/* CTA */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-black text-stone-900 shadow-sm transition hover:bg-stone-50"
        >
          {copied ? "Copied ✅" : "Copy pesan"}
        </button>

        {sellerPath ? (
          <Link
            href={sellerPath}
            className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-black text-stone-900 shadow-sm transition hover:bg-stone-50"
          >
            {backLabel ?? "Balik ke etalase seller"}
          </Link>
        ) : null}

        <a
          href={waHref}
          className={[
            "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-black shadow-sm transition",
            canSend
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "cursor-not-allowed bg-stone-200 text-stone-500",
          ].join(" ")}
          onClick={(e) => {
            if (!canSend) e.preventDefault();
          }}
        >
          Pesan via WhatsApp
        </a>

        <div className="ml-auto flex items-center text-xs font-semibold text-stone-600">
          Kode: <span className="ml-1 font-black text-stone-900">{orderCode}</span>
        </div>
      </div>

      {!canSend ? (
        <div className="mt-3 text-xs font-semibold text-stone-500">
          Isi <span className="font-black">Nama</span> & <span className="font-black">Nomor WA</span> dulu ya bro 😄
        </div>
      ) : null}
    </section>
  );
}
