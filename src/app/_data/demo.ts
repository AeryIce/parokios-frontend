export type Parish = {
  slug: string;
  name: string;
  area: string; // coarse: Jakarta Timur, Jakarta Utara, dst
  city: string; // Jakarta (atau lain)
};

export type Seller = {
  slug: string;
  name: string;
  parishSlug: string;
  whatsapp: string;
  tagline: string;
};

export type Variant = {
  id: string;
  label: string;
  price: number;
  stock: number | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  parishSlug: string;
  sellerSlug: string;
  imageUrl: string; // demo url (nanti cloudinary)
  createdAtIso: string;
  variants: readonly Variant[];
  stats: {
    views: number;
    checkoutStarts: number;
    sold: number;
  };
};

export type TrendingKeyword = {
  keyword: string;
  area: string;
  count: number;
};

export const demoParishes: readonly Parish[] = [
  { slug: "rawamangun", name: "Paroki Rawamangun", area: "Jakarta Timur", city: "Jakarta" },
  { slug: "kelapa-gading", name: "Paroki Kelapa Gading", area: "Jakarta Utara", city: "Jakarta" },
  { slug: "pluit", name: "Paroki Pluit", area: "Jakarta Utara", city: "Jakarta" },
  { slug: "cempaka-putih", name: "Paroki Cempaka Putih", area: "Jakarta Pusat", city: "Jakarta" },
];

export const demoSellers: readonly Seller[] = [
  {
    slug: "bu-rita-bakery",
    name: "Bu Rita Bakery",
    parishSlug: "rawamangun",
    whatsapp: "628111111111",
    tagline: "Kue rumahan, anti pelit topping.",
  },
  {
    slug: "om-dodo-catering",
    name: "Om Dodo Catering",
    parishSlug: "rawamangun",
    whatsapp: "628122222222",
    tagline: "Nasi box, snack box, aman buat rapat & arisan.",
  },
  {
    slug: "suster-sweet",
    name: "Suster Sweet",
    parishSlug: "kelapa-gading",
    whatsapp: "628133333333",
    tagline: "Hampers cantik, rasa nggak drama.",
  },
  {
    slug: "dapurnya-ci-ana",
    name: "Dapur Ci Ana",
    parishSlug: "pluit",
    whatsapp: "628144444444",
    tagline: "Pedasnya sopan, nikmatnya brutal.",
  },
];

const variants = {
  nastar: [
    { id: "v1", label: "250g", price: 45000, stock: 12 },
    { id: "v2", label: "500g", price: 85000, stock: 6 },
  ],
  kueKeringMix: [
    { id: "v1", label: "Toples M", price: 65000, stock: 10 },
    { id: "v2", label: "Toples L", price: 95000, stock: 5 },
  ],
  snackBox: [
    { id: "v1", label: "Isi 10", price: 25000, stock: null },
    { id: "v2", label: "Isi 20", price: 45000, stock: null },
  ],
  sambal: [
    { id: "v1", label: "100ml", price: 20000, stock: 20 },
    { id: "v2", label: "250ml", price: 38000, stock: 12 },
    { id: "v3", label: "Level Pedas 5", price: 42000, stock: 8 },
  ],
} as const;

export const demoProducts: readonly Product[] = [
  {
    id: "p1",
    slug: "nastar-nanas-butter",
    name: "Nastar Nanas Butter",
    description: "Lembut, wangi butter, nanasnya nggak pelit.",
    category: "Kue Kering",
    parishSlug: "rawamangun",
    sellerSlug: "bu-rita-bakery",
    imageUrl:
      "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=1200&q=60",
    createdAtIso: "2026-02-10T09:00:00.000Z",
    variants: variants.nastar,
    stats: { views: 1820, checkoutStarts: 210, sold: 87 },
  },
  {
    id: "p2",
    slug: "kue-kering-mix-toples",
    name: "Kue Kering Mix Toples",
    description: "Campur 3 rasa: keju, coklat, kacang. Cocok buat tamu dadakan.",
    category: "Kue Kering",
    parishSlug: "kelapa-gading",
    sellerSlug: "suster-sweet",
    imageUrl:
      "https://images.unsplash.com/photo-1542826438-6f4b339e53f4?auto=format&fit=crop&w=1200&q=60",
    createdAtIso: "2026-02-12T03:00:00.000Z",
    variants: variants.kueKeringMix,
    stats: { views: 1410, checkoutStarts: 165, sold: 71 },
  },
  {
    id: "p3",
    slug: "snack-box-hemat",
    name: "Snack Box Hemat",
    description: "Buat rapat, arisan, atau ‘ngopi serius’ bareng temen.",
    category: "Snack Box",
    parishSlug: "rawamangun",
    sellerSlug: "om-dodo-catering",
    imageUrl:
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1200&q=60",
    createdAtIso: "2026-02-14T08:00:00.000Z",
    variants: variants.snackBox,
    stats: { views: 980, checkoutStarts: 140, sold: 52 },
  },
  {
    id: "p4",
    slug: "sambal-bawang-pedas",
    name: "Sambal Bawang Pedas",
    description: "Pedasnya ngajak tobat, tapi enaknya bikin balik lagi.",
    category: "Sambal",
    parishSlug: "pluit",
    sellerSlug: "dapurnya-ci-ana",
    imageUrl:
      "https://images.unsplash.com/photo-1604908554178-0a3b58fe2b2c?auto=format&fit=crop&w=1200&q=60",
    createdAtIso: "2026-02-15T12:00:00.000Z",
    variants: variants.sambal,
    stats: { views: 1320, checkoutStarts: 190, sold: 63 },
  },
];

export const demoTrending: readonly TrendingKeyword[] = [
  { keyword: "hampers", area: "Jakarta Utara", count: 221 },
  { keyword: "nastar", area: "Jakarta Timur", count: 198 },
  { keyword: "snack box", area: "Jakarta Timur", count: 174 },
  { keyword: "sambal level 5", area: "Jakarta Utara", count: 160 },
  { keyword: "kue imlek", area: "Jakarta Pusat", count: 142 },
];

export function getParishBySlug(slug: string): Parish | null {
  return demoParishes.find((p) => p.slug === slug) ?? null;
}

export function getSellerBySlug(parishSlug: string, sellerSlug: string): Seller | null {
  return (
    demoSellers.find((s) => s.parishSlug === parishSlug && s.slug === sellerSlug) ?? null
  );
}

export function getProductBySlug(
  parishSlug: string,
  sellerSlug: string,
  productSlug: string
): Product | null {
  return (
    demoProducts.find(
      (p) => p.parishSlug === parishSlug && p.sellerSlug === sellerSlug && p.slug === productSlug
    ) ?? null
  );
}

export function minVariantPrice(product: Product): number {
  return product.variants.reduce((min, v) => (v.price < min ? v.price : min), product.variants[0]?.price ?? 0);
}

export function listAreas(): readonly string[] {
  const set = new Set<string>();
  for (const p of demoParishes) set.add(p.area);
  return Array.from(set);
}
