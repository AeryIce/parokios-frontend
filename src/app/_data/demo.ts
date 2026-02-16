export const AREAS = [
  "Jakarta Utara",
  "Jakarta Timur",
  "Jakarta Pusat",
  "Jakarta Barat",
  "Jakarta Selatan",
] as const;

export type Area = (typeof AREAS)[number];

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
};

export type Product = {
  slug: string;
  parishSlug: string;
  sellerSlug: string;
  name: string;
  desc: string;
  category: string;
  price: number;
  soldCount: number;
  isTrending?: boolean;
  isNew?: boolean;
  emoji?: string;
};

export const PARISHES: Parish[] = [
  { slug: "rawamangun", name: "Paroki Rawamangun", area: "Jakarta Timur" },
  { slug: "kelapa-gading", name: "Paroki Kelapa Gading", area: "Jakarta Utara" },
  { slug: "pluit", name: "Paroki Pluit", area: "Jakarta Utara" },
  { slug: "kebon-jeruk", name: "Paroki Kebon Jeruk", area: "Jakarta Barat" },
];

export const SELLERS: Seller[] = [
  {
    slug: "oma-nanas",
    parishSlug: "rawamangun",
    name: "Dapur Oma Nanas",
    tagline: "Nastar buttery, trauma hilang.",
  },
  {
    slug: "toples-kriuk",
    parishSlug: "kelapa-gading",
    name: "Kue Kering Mix Toples",
    tagline: "Kriuk-kriuknya sopan, rasanya brutal.",
  },
  {
    slug: "bang-jali-sambal",
    parishSlug: "pluit",
    name: "Sambal Bang Jali",
    tagline: "Pedasnya ngajak tobat, tapi nagihnya bikin balik lagi.",
  },
  {
    slug: "snack-box-hemat",
    parishSlug: "kebon-jeruk",
    name: "Snack Box Hemat",
    tagline: "Rapat jadi damai.",
  },
];

export const PRODUCTS: Product[] = [
  {
    slug: "nastar-nanas-butter",
    parishSlug: "rawamangun",
    sellerSlug: "oma-nanas",
    name: "Nastar Nanas Butter",
    desc: "Lumer, wangi butter, nanasnya lembut. Cocok buat tamu dadakan.",
    category: "Kue Kering",
    price: 65000,
    soldCount: 124,
    isTrending: true,
    emoji: "🍍",
  },
  {
    slug: "kue-kering-mix-toples",
    parishSlug: "kelapa-gading",
    sellerSlug: "toples-kriuk",
    name: "Kue Kering Mix Toples",
    desc: "Campur 3 rasa: keju, coklat, kacang. Kriuknya bikin pengen nambah.",
    category: "Kue Kering",
    price: 65000,
    soldCount: 98,
    emoji: "🍪",
  },
  {
    slug: "sambal-bawang-pedas",
    parishSlug: "pluit",
    sellerSlug: "bang-jali-sambal",
    name: "Sambal Bawang Pedas",
    desc: "Pedasnya ngajak tobat, tapi enaknya bikin balik lagi.",
    category: "Sambal",
    price: 20000,
    soldCount: 143,
    isTrending: true,
    emoji: "🌶️",
  },
  {
    slug: "snack-box-hemat",
    parishSlug: "rawamangun",
    sellerSlug: "snack-box-hemat",
    name: "Snack Box Hemat",
    desc: "Cocok buat kantor, arisan, atau ‘ngemil sambil kerja’.",
    category: "Snack Box",
    price: 25000,
    soldCount: 67,
    isNew: true,
    emoji: "🥪",
  },
];

export function listAreas(): readonly Area[] {
  return AREAS;
}

export function getParishBySlug(slug: string): Parish | null {
  return PARISHES.find((p) => p.slug === slug) ?? null;
}

export function getSeller(parishSlug: string, sellerSlug: string): Seller | null {
  return (
    SELLERS.find((s) => s.parishSlug === parishSlug && s.slug === sellerSlug) ??
    null
  );
}

export function listParishesByArea(area: Area): Parish[] {
  return PARISHES.filter((p) => p.area === area);
}

export function listSellersByParish(parishSlug: string): Seller[] {
  return SELLERS.filter((s) => s.parishSlug === parishSlug);
}

export function listProductsByArea(area: Area): Product[] {
  const parishSlugs = new Set(listParishesByArea(area).map((p) => p.slug));
  return PRODUCTS.filter((p) => parishSlugs.has(p.parishSlug));
}

export function listProductsBySeller(
  parishSlug: string,
  sellerSlug: string
): Product[] {
  return PRODUCTS.filter(
    (p) => p.parishSlug === parishSlug && p.sellerSlug === sellerSlug
  );
}

export function getProduct(
  parishSlug: string,
  sellerSlug: string,
  productSlug: string
): Product | null {
  return (
    PRODUCTS.find(
      (p) =>
        p.parishSlug === parishSlug &&
        p.sellerSlug === sellerSlug &&
        p.slug === productSlug
    ) ?? null
  );
}
