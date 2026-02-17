import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Carousel } from "@/app/_components/Carousel";
import { ProductCard } from "@/app/_components/ProductCard";
import { Section } from "@/app/_components/Section";
import StickyBottomBar from "@/app/_components/StickyBottomBar";
import { getParishBySlug, getProduct, getSeller, listProductsBySeller } from "@/app/_data/demo";
import { formatRupiah } from "@/app/_lib/money";

type Params = { parishSlug: string; sellerSlug: string; productSlug: string };
type Props = { params: Params | Promise<Params> };

function getWhatsappDigits(seller: unknown): string | null {
  const rec = seller as Record<string, unknown>;
  const keys = ["whatsapp", "wa", "whatsappNumber", "waNumber", "phoneWa", "phone"] as const;

  for (const k of keys) {
    const v = rec[k];
    if (typeof v === "string") {
      const trimmed = v.trim();
      if (trimmed.length > 0) return trimmed;
    }
  }
  return null;
}

export default async function ProductPage({ params }: Props) {
  const p = await Promise.resolve(params);

  const parish = getParishBySlug(p.parishSlug);
  if (!parish) notFound();

  const seller = getSeller(parish.slug, p.sellerSlug);
  if (!seller) notFound();

  const product = getProduct(parish.slug, seller.slug, p.productSlug);
  if (!product) notFound();

  const waDigits = getWhatsappDigits(seller);

  const related = listProductsBySeller(parish.slug, seller.slug)
    .filter((x) => x.slug !== product.slug)
    .slice(0, 10);

  const path = `/${parish.slug}/${seller.slug}/${product.slug}`;
  const priceLabel = formatRupiah(product.price);

  const waMessage = `Halo ${seller.name}! Saya mau pesan: ${product.name} (${priceLabel}). Dari Parokios - ${parish.name}. Bisa info stok & cara order?`;

  const hasImage =
    typeof (product as unknown as { imageUrl?: string }).imageUrl === "string" &&
    ((product as unknown as { imageUrl?: string }).imageUrl ?? "").trim().length > 0;

  const imageUrl = hasImage
    ? ((product as unknown as { imageUrl?: string }).imageUrl as string)
    : null;

  const imageAlt =
    ((product as unknown as { imageAlt?: string }).imageAlt as string | undefined) ?? product.name;

  return (
    <main className="min-h-dvh bg-gradient-to-b from-orange-50 via-amber-50 to-white">
      <div className="mx-auto max-w-5xl px-5 py-8 pb-28 md:pb-8">
        <div className="flex flex-col gap-2">
          <Link
            href={`/${parish.slug}/${seller.slug}`}
            className="text-sm font-bold text-orange-700 underline decoration-orange-300"
          >
            ← {seller.name}
          </Link>
          <Link
            href={`/${parish.slug}`}
            className="text-xs font-bold text-stone-600 underline decoration-stone-300"
          >
            {parish.name} • {parish.area}
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="relative h-56 bg-gradient-to-br from-amber-100 via-orange-100 to-amber-50">
            {imageUrl ? (
              <>
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-white/10 to-white/90" />
              </>
            ) : null}

            <div className="absolute left-5 top-5 rounded-full bg-white/85 px-4 py-2 text-xs font-extrabold text-stone-800 shadow-sm">
              {product.category}
            </div>

            <div className="absolute bottom-5 left-5 flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/90 text-3xl shadow-sm">
                {product.emoji ?? "🍽️"}
              </div>
              <div>
                <div className="text-xl font-black text-stone-900">{product.name}</div>
                <div className="mt-1 text-sm font-extrabold text-orange-700">{priceLabel}</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="text-sm font-semibold text-stone-700">Deskripsi</div>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{product.desc}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {waDigits ? (
                <a
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-700"
                  href={`https://wa.me/${waDigits.replace(/\D/g, "")}?text=${encodeURIComponent(
                    waMessage
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Pesan via WhatsApp
                </a>
              ) : (
                <div className="inline-flex h-11 items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 text-sm font-extrabold text-stone-600">
                  WA belum di-set (demo)
                </div>
              )}

              <Link
                href={`/${parish.slug}/${seller.slug}`}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 text-sm font-extrabold text-stone-900 shadow-sm transition hover:bg-amber-50"
              >
                Lihat etalase seller
              </Link>
            </div>

            <div className="mt-4 text-xs font-semibold text-stone-500">
              Catatan: pembayaran transfer manual di luar sistem (sesuai kompas Parokios).
            </div>
          </div>
        </div>

        <Section title="Menu lain dari seller ini" subtitle="Biar sekalian tambah 2… eh 3.">
          {related.length > 0 ? (
            <Carousel>
              {related.map((x) => (
                <ProductCard key={x.slug} parish={parish} seller={seller} product={x} />
              ))}
            </Carousel>
          ) : (
            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm font-semibold text-stone-700 shadow-sm">
              Belum ada menu lain.
            </div>
          )}
        </Section>
      </div>

      <StickyBottomBar
        title={product.name}
        priceLabel={priceLabel}
        path={path}
        whatsappDigits={waDigits}
        waMessage={waMessage}
      />
    </main>
  );
}
