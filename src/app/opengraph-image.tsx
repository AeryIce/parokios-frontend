import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg, #0b0b0b 0%, #1f2937 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: -1 }}>
          Parokios
        </div>
        <div style={{ marginTop: 14, fontSize: 30, opacity: 0.9, maxWidth: 900 }}>
          Etalase UMKM per paroki. Bikin laper dulu, urusan bayar belakangan.
        </div>
        <div style={{ marginTop: 26, fontSize: 22, opacity: 0.75 }}>
          Chat WA • Transfer manual • Upload bukti • Beres
        </div>
      </div>
    ),
    size
  );
}
