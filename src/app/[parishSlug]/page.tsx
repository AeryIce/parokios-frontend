import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Carousel from "../_components/Carousel";
import ProductCard from "../_components/ProductCard";
import Section from "../_components/Section";
import { demoProducts, demoSellers, getParishBySlug } from "../_data/demo";

type Props = {
  params: { parishSlug: string };
};

export function generateStaticParams(): Array<{ parishSlug: string }> {
  return [
    { parishSlug: "rawamangun" },
    { parishSlug: "kelapa-gading" },
    { parishSlug: "pluit" },
    { parishSlug: "cempaka-putih" },
  ];
}

export function generateMetadata({ params }: Props): Metadata {
  const parish = getParishBySlug(params.parishSlug);
  if (!parish) return { title: "Paroki" };
  return {
    title: parish.name,
    description: `Katalog UMKM ${parish.name}. Area: ${parish.area}.`,
    alternates: { canonical: `/${parish.slug}` },
  };
}

export default function ParishPage({ params }: Props) {
  const parish = getParishBySlug(params.parishSlug);
  if (!parish) notFound();

  const sellers = demoSellers.filter((s) => s.parishSlug === parish.slug);
  const products = demoProducts.filter((p) => p.parishSlug === parish.slug);

  return (
    <main className="min-h-screen bg-amber-50 px-6 py-10 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-6xl">
        <div className="text-3xl font-black">{parish.name}</div>
        <div className="mt-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Area: {parish.area} • Kota: {parish.city}
        </div>

        <Section title="Toko / Seller" subtitle="Demo dulu. Nanti dari DB + verifikasi admin.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sellers.map((s) => (
              <a
                key={s.slug}
                href={`/${parish.slug}/${s.slug}`}
                className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="text-base font-black">{s.name}</div>
                <div className="mt-1 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                  {s.tagline}
                </div>
                <div className="mt-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800 dark:bg-zinc-900 dark:text-amber-200">
                  Lihat etalase
                </div>
              </a>
            ))}
          </div>
        </Section>

        <Section title="Produk" subtitle="Food-first, biar langsung ngiler 😄">
          <Carousel>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Carousel>
        </Section>
      </div>
    </main>
  );
}
