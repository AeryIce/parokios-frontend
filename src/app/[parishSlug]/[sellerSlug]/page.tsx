import { notFound } from "next/navigation";
import Carousel from "../../_components/Carousel";
import ProductCard from "../../_components/ProductCard";
import Section from "../../_components/Section";
import { demoProducts, getParishBySlug, getSellerBySlug } from "../../_data/demo";

type Props = {
  params: {
    parishSlug: string;
    sellerSlug: string;
  };
};

export default function SellerPage({ params }: Props) {
  const parish = getParishBySlug(params.parishSlug);
  const seller = getSellerBySlug(params.parishSlug, params.sellerSlug);

  if (!parish || !seller) notFound();

  const products = demoProducts.filter(
    (p) => p.parishSlug === parish.slug && p.sellerSlug === seller.slug
  );

  return (
    <main className="min-h-screen bg-amber-50 px-6 py-10 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-6xl">
        <div className="text-3xl font-black">{seller.name}</div>
        <div className="mt-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {parish.name} • {parish.area}
        </div>

        <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {seller.tagline}
          </div>

          <a
            className="mt-3 inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
            href={`https://wa.me/${seller.whatsapp}`}
            target="_blank"
            rel="noreferrer"
          >
            Chat WA & Pesan
          </a>
        </div>

        <Section title="Etalase" subtitle="Demo dulu. Nanti ambil dari DB + Cloudinary.">
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
