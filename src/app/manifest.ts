import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Parokios",
    short_name: "Parokios",
    description:
      "Etalase UMKM per paroki. Lihat yang bikin laper, chat seller via WA, transfer manual, upload bukti.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0b",
    theme_color: "#0b0b0b",
    lang: "id",
    categories: ["shopping", "food", "lifestyle"],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
