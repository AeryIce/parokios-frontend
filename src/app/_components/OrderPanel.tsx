"use client";

import { useMemo, useState } from "react";
import { formatRupiah } from "@/app/_lib/money";
import { buildWhatsAppLink } from "@/app/_lib/wa";

export type OrderVariant = {
  sku: string;
  label: string;
  price: number;
  stock?: number;
};

type Props = {
  parishName: string;
  sellerName: string;
  sellerWhatsApp: string;

  productName: string;
  productCategory: string;
  basePrice: number;

  productPath: string; // contoh: /rawamangun/oma-nanas/nastar...
  variants?: readonly OrderVariant[];
};

function makeOrderCode(): string {
  try {
    if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
      const buf = new Uint8Array(4);
      crypto.getRandomValues(buf);
      const hex = Array.from(buf)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
      return `PKS-${hex}`;
    }
  } catch {
    // ignore
  }

  const fallback = Math.random().toString(16).slice(2, 10).toUpperCase();
  return `PKS-${fallback}`;
}

function normalizeBuyerWa(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

export function OrderPanel({
  parishName,
  sellerName,
  sellerWhatsApp,
  productName,
  productCategory,
  basePrice,
  productPath,
  variants,
}: Props) {
  const orderCode = useMemo(() => makeOrderCode(), []);
  const [qty, setQty] = useState<number>(1);
  const [buyerName, setBuyerName] = useState<string>("");
  const [buyerWa, setBuyerWa] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const hasVariants = (variants?.length ?? 0) > 0;
  const [variantSku, setVariantSku] = useState<string>(
    hasVariants ? (variants?.[0]?.sku ?? "") : ""
  );

  const selectedVariant =
    hasVariants && variantSku
      ? variants?.find((v) => v.sku === variantSku) ?? null
      : null;

  const unitPrice = selectedVariant?.price ?? basePrice;
  const safeQty = Number.isFinite(qty) && qty > 0 ? Math.min(Math.floor(qty), 999) : 1;
  const total = unitPrice * safeQty;

  const buyerWaNormalized = normalizeBuyerWa(buyerWa.trim());

  const messageLines = [
    `Halo Kak ${sellerName} 🙏`,
    ``,
    `Saya mau order:`,
    `• Produk: ${productName} (${productCategory})`,
    selectedVariant ? `• Varian: ${selectedVariant.label}` : null,
    `• Qty: ${safeQty}`,
    `• Estimasi: ${formatRupiah(total)}`,
    ``,
    `Data pemesan:`,
    `• Nama: ${buyerName.trim() || "-"}`,
    `• WA: ${buyerWaNormalized || "-"}`,
    note.trim() ? `• Catatan: ${note.trim()}` : `• Catatan: -`,
    ``,
    `Kode order: ${orderCode}`,
    `Link produk: ${productPath}`,
    ``,
    `Boleh info stok & cara ordernya ya? Terima kasih 🙇‍♂️`,
  ].filter((x): x is string => typeof x === "string");

  const message = messageLines.join("\n");
  const waHref = buildWhatsAppLink(sellerWhatsApp, message);

  const canOrder =
    waHref.length > 0 && buyerName.trim().length >= 2 && buyerWaNormalized.length >= 9;

  const [copied, setCopied] = useState<boolean>(false);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback: no-op (user can manually select if needed)
      setCopied(false);
    }
  }

  return (
    <div className="mt-6 rounded-3xl border border-stone-200 bg-white/85 p-5 shadow-sm backdrop-blur">
      <div className="text-lg font-black text-stone-900">Checkout cepat (tanpa login)</div>
      <div className="mt-1 text-sm font-semibold text-stone-600">
        Isi data kamu → klik tombol → chat WA kebuka dengan format order rapi.
      </div>

      {hasVariants ? (
        <div className="mt-5">
          <div className="text-sm font-black text-stone-900">Pilih varian</div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {variants?.map((v) => {
              const stockText =
                typeof v.stock === "number" ? ` • stok ${v.stock}` : "";
              return (
                <label
                  key={v.sku}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 text-sm font-semibold shadow-sm transition ${
                    variantSku === v.sku
                      ? "border-amber-300 bg-amber-50"
                      : "border-stone-200 bg-white hover:bg-stone-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="variant"
                    value={v.sku}
                    checked={variantSku === v.sku}
                    onChange={() => setVariantSku(v.sku)}
                    className="mt-1"
                  />
                  <div className="min-w-0">
                    <div className="font-black text-stone-900">{v.label}</div>
                    <div className="text-stone-600">
                      {formatRupiah(v.price)}
                      {stockText}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className="text-sm font-black text-stone-900">Qty</label>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, (Number.isFinite(q) ? q : 1) - 1))}
              className="h-10 w-10 rounded-xl border border-stone-200 bg-white text-lg font-black shadow-sm hover:bg-stone-50"
              aria-label="Kurangi qty"
            >
              -
            </button>
            <input
              inputMode="numeric"
              value={safeQty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm font-black shadow-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(999, (Number.isFinite(q) ? q : 1) + 1))}
              className="h-10 w-10 rounded-xl border border-stone-200 bg-white text-lg font-black shadow-sm hover:bg-stone-50"
              aria-label="Tambah qty"
            >
              +
            </button>
          </div>
        </div>

        <div className="sm:col-span-1">
          <label className="text-sm font-black text-stone-900">Nama</label>
          <input
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="Nama kamu"
            className="mt-2 h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm font-semibold shadow-sm outline-none"
          />
        </div>

        <div className="sm:col-span-1">
          <label className="text-sm font-black text-stone-900">WA kamu</label>
          <input
            value={buyerWa}
            onChange={(e) => setBuyerWa(e.target.value)}
            placeholder="contoh: 08xx / 62xx"
            className="mt-2 h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm font-semibold shadow-sm outline-none"
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="text-sm font-black text-stone-900">Catatan (opsional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Misal: ambil jam 19:00 / pedes sedang / jangan pakai kacang..."
          className="mt-2 min-h-[92px] w-full resize-none rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm outline-none"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-stone-500">Estimasi total</div>
          <div className="text-2xl font-black text-orange-700">{formatRupiah(total)}</div>
          <div className="mt-1 text-xs font-semibold text-stone-500">
            Paroki: {parishName} • Kode: {orderCode}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-black text-stone-900 shadow-sm transition hover:bg-stone-50"
          >
            {copied ? "Tercopy ✅" : "Copy pesan"}
          </button>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!canOrder}
            className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-black shadow-sm transition ${
              canOrder
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "cursor-not-allowed bg-emerald-600/40 text-white/80"
            }`}
          >
            Chat WA untuk Order 💬
          </a>
        </div>
      </div>

      {!canOrder ? (
        <div className="mt-3 text-xs font-semibold text-stone-600">
          Isi <span className="font-black">Nama</span> dan <span className="font-black">WA</span> dulu ya biar pesan ordernya rapi 😄
        </div>
      ) : null}
    </div>
  );
}

export default OrderPanel;
