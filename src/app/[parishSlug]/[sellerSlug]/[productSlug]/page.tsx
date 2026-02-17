import Link from "next/link";
import { notFound } from "next/navigation";

import { Carousel } from "@/app/_components/Carousel";
import { OrderPanel, type OrderVariant } from "@/app/_components/OrderPanel";
import { ProductCard } from "@/app/_components/ProductCard";
import { Section } from "@/app/_components/Section";
import StickyBottomBar from "@/app/_components/StickyBottomBar";

import {
  getParishBySlug,
  getProduct,
  getSeller,
  listProductsBySeller,
  minVariantPrice,
  type Product,
} from "@/app/_data/demo";
import { formatRupiah } from "@/app/_lib/money";
import { normalizeWhatsAppNumber } from "@/app/_lib/wa";

type Params = { parishSlug: string; sellerSlug: string; productSlug: string };
type Props = { params: Params | Promise<Params> };

export default async function ProductPage({ params }: Props) {
  const p = await Promise.resolve(params);

  const parish = getParishBySlug(p.parishSlug);
  if (!parish) notFound();

  const seller = getSeller(parish.slug, p.sellerSlug);
  const product = getProduct(parish.slug, p.sellerSlug, p.productSlug);

  if (!seller || !product) notFound();

  const path = `/${parish.slug}/${seller.slug}/${product.slug}`;

  const waDigits = normalizeWhatsAppNumber(seller.waNumber);
  const waDigitsOrNull = waDigits.length > 0 ? waDigits : null;

  const variants: OrderVariant[] = (product.variants ?? []).map((v) => ({
    sku: v.sku,
    label: v.label,
    price: v.price,
    stock: typeof v.stock === "number" ? v.stock : undefined,
  }));

  const minPrice = minVariantPrice(product);
  const priceLabel =
    variants.length > 0 ? `mulai ${formatRupiah(minPrice)}` : formatRupiah(product.price);

  const imageUrl =
    typeof product.imageUrl === "string" && product.imageUrl.trim().length > 0
      ? product.imageUrl.trim()
      : null;

  const waMessage = [
    `Halo Kak ${seller.name} 🙏`,
    `Saya tertarik: ${product.name}`,
    `Kategori: ${product.category}`,
    `Paroki: ${parish.name}`,
    ``,
    `Boleh tanya stok & cara ordernya ya?`,
  ].join("\n");

  const related: Product[] = listProductsBySeller(parish.slug, seller.slug)
    .filter((x) => x.slug !== product.slug)
    .slice(0, 10);

  return (
    <main className="min-h-dvh bg-gradient-to-b from-orange-50 via-amber-50 to-rose-50 px-6 py-10 text-stone-900">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <div className="text-sm font-semibold text-stone-700">
          <Link className="text-orange-700 hover:underline" href={`/${parish.slug}`}>
            {parish.name}
          </Link>
          <span className="mx-2 text-stone-400">/</span>
          <Link className="text-orange-700 hover:underline" href={`/${parish.slug}/${seller.slug}`}>
            {seller.name}
          </Link>
          <span className="mx-2 text-stone-400">/</span>
          <span className="text-stone-900">{product.name}</span>
        </div>

        {/* Hero */}
        <div className="mt-5 overflow-hidden rounded-3xl border border-orange-200/70 bg-white/80 shadow-sm backdrop-blur">
          <div className="relative h-56">
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt={product.imageAlt ?? product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-white" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100" />
            )}

            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm font-black shadow-sm">
              {product.category}
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-3xl">{product.emoji ?? "🍽️"}</div>
                  <h1 className="text-3xl font-black tracking-tight">{product.name}</h1>
                </div>
                <div className="mt-2 text-sm font-semibold text-stone-700">{product.desc}</div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold text-stone-600">{priceLabel}</div>
                <div className="mt-1 text-xs font-semibold text-stone-500">
                  Bayar transfer manual • bukti transfer aman
                </div>
              </div>
            </div>

            {/* Order */}
            <div className="mt-5">
              {waDigitsOrNull ? (
                <OrderPanel
                  parishName={parish.name}
                  sellerName={seller.name}
                  sellerWhatsApp={waDigitsOrNull}
                  productName={product.name}
                  productCategory={product.category}
                  basePrice={minPrice}
                  productPath={path}
                  sellerPath={`/${parish.slug}/${seller.slug}`}
                  backLabel="Balik ke etalase seller"
                  variants={variants.length > 0 ? variants : undefined}
                />
              ) : (
                <div className="rounded-2xl border border-orange-200/70 bg-white/80 p-4 text-sm font-semibold text-stone-700 shadow-sm">
                  Seller ini belum pasang nomor WhatsApp.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 ? (
          <Section title="Produk lain dari seller" subtitle="Biar makin laper, jangan cuma satu 😄">
            <Carousel>
              {related.map((p2) => (
                <ProductCard key={p2.slug} parish={parish} seller={seller} product={p2} />
              ))}
            </Carousel>
          </Section>
        ) : null}
      </div>

      {/* Sticky bottom quick actions */}
      <StickyBottomBar
        whatsappDigits={waDigitsOrNull}
        waMessage={waMessage}
        title={product.name}
        priceLabel={priceLabel}
        path={path}
      />
    </main>
  );
}
