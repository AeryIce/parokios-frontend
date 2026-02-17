import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
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
          background: "linear-gradient(135deg, #111827 0%, #0b0b0b 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: -1 }}>
          Parokios
        </div>
        <div style={{ marginTop: 14, fontSize: 28, opacity: 0.9, maxWidth: 900 }}>
          UMKM paroki, tampil ganteng, bikin ngiler.
        </div>
        <div style={{ marginTop: 26, fontSize: 22, opacity: 0.75 }}>
          Katalog • WA • Transfer • Upload bukti
        </div>
      </div>
    ),
    size
  );
}
