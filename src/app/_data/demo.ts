export type Area = "Jakarta Timur" | "Jakarta Utara" | "Jakarta Barat";

export type Parish = {
  slug: string;
  name: string;
  area: Area;
};

export type Seller = {
  slug: string;
  parishSlug: string;
  name: string;
  tagline: string;
  waNumber: string;
};

export type ProductVariant = {
  sku: string;
  label: string;
  price: number;
  stock?: number;
};

export type Product = {
  slug: string;
  parishSlug: string;
  sellerSlug: string;
  name: string;
  desc: string;
  category: string;
  emoji: string;
  isNew?: boolean;
  isTrending?: boolean;
  soldCount: number;
  price: number;

  // NEW: dummy “real photo”
  imageUrl?: string;
  imageAlt?: string;

  variants?: ProductVariant[];
};

export const PARISHES: readonly Parish[] = [
  { slug: "rawamangun", name: "Paroki Rawamangun", area: "Jakarta Timur" },
  { slug: "kelapa-gading", name: "Paroki Kelapa Gading", area: "Jakarta Utara" },
  { slug: "pluit", name: "Paroki Pluit", area: "Jakarta Utara" },
  { slug: "kebon-jeruk", name: "Paroki Kebon Jeruk", area: "Jakarta Barat" },
];

export const SELLERS: readonly Seller[] = [
  {
    slug: "oma-nanas",
    parishSlug: "rawamangun",
    name: "Dapur Oma Nanas",
    tagline: "Nastar lembut, wangi butter. Cocok buat tamu dadakan.",
    waNumber: "628111234567",
  },
  {
    slug: "toples-kriuk",
    parishSlug: "kelapa-gading",
    name: "Toples Kriuk",
    tagline: "Kue kering campur — kriuknya bikin pengen nambah.",
    waNumber: "628111234568",
  },
  {
    slug: "bang-jali",
    parishSlug: "pluit",
    name: "Sambal Bang Jali",
    tagline: "Pedasnya ngajak tobat, tapi enaknya bikin balik lagi.",
    waNumber: "628111234569",
  },
  {
    slug: "snack-box-hemat",
    parishSlug: "kebon-jeruk",
    name: "Snack Box Hemat",
    tagline: "Buat rapat / arisan / lingkungan. Rapi, aman, kenyang.",
    waNumber: "628111234570",
  },
];

export const PRODUCTS: readonly Product[] = [
  {
    slug: "nastar-nanas-butter",
    parishSlug: "rawamangun",
    sellerSlug: "oma-nanas",
    name: "Nastar Nanas Butter",
    desc: "Lumer, wangi butter, nanasnya lembut. Cocok buat tamu dadakan.",
    category: "Kue Kering",
    emoji: "🍍",
    isNew: true,
    isTrending: true,
    soldCount: 88,
    price: 65000,
    imageUrl:
      "https://images.unsplash.com/photo-1612000831138-287bd7648e3b?auto=format&fit=crop&fm=jpg&q=80&w=1200",
    imageAlt: "Nastar / pineapple tarts di atas tray",
    variants: [
      { sku: "NST-250", label: "Toples 250gr", price: 65000, stock: 14 },
      { sku: "NST-500", label: "Toples 500gr", price: 120000, stock: 8 },
    ],
  },
  {
    slug: "kue-kering-mix-toples",
    parishSlug: "kelapa-gading",
    sellerSlug: "toples-kriuk",
    name: "Kue Kering Mix Toples",
    desc: "Campur 3 rasa: keju, coklat, kacang. Kriuknya bikin pengen nambah.",
    category: "Kue Kering",
    emoji: "🍪",
    isTrending: true,
    soldCount: 54,
    price: 65000,
    imageUrl:
      "https://images.unsplash.com/photo-1657312125229-e8e83cf46ff1?auto=format&fit=crop&fm=jpg&q=80&w=1200",
    imageAlt: "Cookies di dalam jar",
    variants: [{ sku: "MIX-01", label: "Toples 1L", price: 65000, stock: 12 }],
  },
  {
    slug: "sambal-bawang-pedas",
    parishSlug: "pluit",
    sellerSlug: "bang-jali",
    name: "Sambal Bawang Pedas",
    desc: "Pedasnya ngajak tobat, tapi enaknya bikin balik lagi.",
    category: "Sambal",
    emoji: "🌶️",
    isNew: true,
    isTrending: true,
    soldCount: 102,
    price: 20000,
    imageUrl:
      "https://images.unsplash.com/photo-1680169610391-1c7d1ede96b9?auto=format&fit=crop&fm=jpg&q=80&w=1200",
    imageAlt: "Sambal / chili sauce dengan cabai",
    variants: [
      { sku: "SBW-100", label: "Botol 100ml", price: 20000, stock: 30 },
      { sku: "SBW-250", label: "Botol 250ml", price: 45000, stock: 15 },
    ],
  },
  {
    slug: "sambal-teri-pete",
    parishSlug: "pluit",
    sellerSlug: "bang-jali",
    name: "Sambal Teri Pete",
    desc: "Pedas + wangi pete. Sekali sendok, doa makan jadi panjang.",
    category: "Sambal",
    emoji: "🐟",
    isTrending: true,
    soldCount: 76,
    price: 30000,
    imageUrl:
      "https://images.unsplash.com/photo-1680169610391-1c7d1ede96b9?auto=format&fit=crop&fm=jpg&q=80&w=1200",
    imageAlt: "Sambal pedas close-up",
    variants: [{ sku: "STP-200", label: "Botol 200ml", price: 30000, stock: 18 }],
  },
  {
    slug: "snack-box-hemat",
    parishSlug: "rawamangun",
    sellerSlug: "snack-box-hemat",
    name: "Snack Box Hemat",
    desc: "Cocok buat rapat, arisan, atau kumpul lingkungan. Rapi, aman, kenyang.",
    category: "Snack Box",
    emoji: "🍱",
    isNew: true,
    soldCount: 33,
    price: 25000,
    imageUrl:
      "https://images.unsplash.com/photo-1696677049263-cc38af1c7681?auto=format&fit=crop&fm=jpg&q=80&w=1200",
    imageAlt: "Bento / snack box",
    variants: [
      { sku: "SBX-01", label: "Box A", price: 25000, stock: 40 },
      { sku: "SBX-02", label: "Box B", price: 30000, stock: 25 },
    ],
  },
];

export const demoProducts = PRODUCTS;
export const demoTrending = PRODUCTS.filter((p) => p.isTrending);

export function getParishBySlug(slug: string): Parish | null {
  return PARISHES.find((p) => p.slug === slug) ?? null;
}

export function listAreas(): readonly Area[] {
  return ["Jakarta Timur", "Jakarta Utara", "Jakarta Barat"] as const;
}

export function listParishesByArea(area: Area): Parish[] {
  return PARISHES.filter((p) => p.area === area);
}

export function listProductsByArea(area: Area): Product[] {
  const parishes = listParishesByArea(area).map((p) => p.slug);
  return PRODUCTS.filter((p) => parishes.includes(p.parishSlug));
}

export function listSellersByParish(parishSlug: string): Seller[] {
  return SELLERS.filter((s) => s.parishSlug === parishSlug);
}

export function getSeller(parishSlug: string, sellerSlug: string): Seller | null {
  return SELLERS.find((s) => s.parishSlug === parishSlug && s.slug === sellerSlug) ?? null;
}

export function listProductsBySeller(parishSlug: string, sellerSlug: string): Product[] {
  return PRODUCTS.filter((p) => p.parishSlug === parishSlug && p.sellerSlug === sellerSlug);
}

export function getProduct(
  parishSlug: string,
  sellerSlug: string,
  productSlug: string
): Product | null {
  return (
    PRODUCTS.find(
      (p) => p.parishSlug === parishSlug && p.sellerSlug === sellerSlug && p.slug === productSlug
    ) ?? null
  );
}

export function minVariantPrice(product: Product): number {
  const base = product.price;
  const variants = product.variants ?? [];
  if (variants.length === 0) return base;
  let min = base;
  for (const v of variants) min = Math.min(min, v.price);
  return min;
}
