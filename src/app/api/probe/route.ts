import { NextResponse } from "next/server";

function trimSlashRight(input: string): string {
  return input.replace(/\/+$/, "");
}

export async function GET(): Promise<NextResponse> {
  const baseUrlRaw = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const baseUrl = trimSlashRight(baseUrlRaw);

  if (!baseUrl) {
    return NextResponse.json(
      { ok: false, error: "Missing NEXT_PUBLIC_API_BASE_URL env var" },
      { status: 500 }
    );
  }

  const healthUrl = `${baseUrl}/health`;

  try {
    const res = await fetch(healthUrl, { cache: "no-store" });
    const text = await res.text();

    let parsed: unknown = text;
    try {
      parsed = JSON.parse(text) as unknown;
    } catch {
      // keep as text
    }

    return NextResponse.json(
      { ok: res.ok, status: res.status, healthUrl, data: parsed },
      { status: res.ok ? 200 : 502 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { ok: false, healthUrl, error: message },
      { status: 502 }
    );
  }
}
