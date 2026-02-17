import Link from "next/link";
import { notFound } from "next/navigation";
import { Carousel } from "@/app/_components/Carousel";
import { ProductCard } from "@/app/_components/ProductCard";
import { Section } from "@/app/_components/Section";
import { getParishBySlug, getSeller, listProductsBySeller } from "@/app/_data/demo";

type Props = {
  params:
    | { parishSlug: string; sellerSlug: string }
    | Promise<{ parishSlug: string; sellerSlug: string }>;
};

export default async function SellerPage({ params }: Props) {
  const p = await Promise.resolve(params);

  const parish = getParishBySlug(p.parishSlug);
  const seller = getSeller(p.parishSlug, p.sellerSlug);
  if (!parish || !seller) notFound();

  const products = listProductsBySeller(parish.slug, seller.slug);

  return (
    <main className="min-h-dvh bg-gradient-to-b from-orange-50 via-amber-50 to-white">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <Link
          href={`/${parish.slug}`}
          className="text-sm font-bold text-orange-700 underline decoration-orange-300"
        >
          ← {parish.name}
        </Link>

        <div className="mt-4 rounded-3xl border border-stone-200 bg-white/75 p-6 shadow-sm backdrop-blur">
          <h1 className="text-2xl font-black text-stone-900">{seller.name}</h1>
          <p className="mt-1 text-sm font-semibold text-stone-600">{seller.tagline}</p>
        </div>

        <Section title="Etalase" subtitle="Demo dulu, nanti nyambung DB.">
          <Carousel>
            {products.map((prod) => (
              <ProductCard
                key={prod.slug}
                parish={parish}
                seller={seller}
                product={prod}
              />
            ))}
          </Carousel>
        </Section>
      </div>
    </main>
  );
}
