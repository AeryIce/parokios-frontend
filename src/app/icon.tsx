import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0b0b0b 0%, #1f2937 100%)",
          color: "white",
          fontSize: 220,
          fontWeight: 900,
          letterSpacing: -10,
        }}
      >
        P
      </div>
    ),
    size
  );
}
