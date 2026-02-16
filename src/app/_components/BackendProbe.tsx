"use client";

import { useEffect, useState } from "react";

type ProbeOk = { ok: boolean; status: number; healthUrl: string; data: unknown };
type ProbeErr = { ok: false; healthUrl?: string; error: string };
type ProbeResult = ProbeOk | ProbeErr;

export default function BackendProbe() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ProbeResult | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/probe", { cache: "no-store" });
        const json = (await res.json()) as ProbeResult;
        setResult(json);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        setResult({ ok: false, error: message });
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  return (
    <div style={{ maxWidth: 720, marginTop: 24 }}>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>
        Backend Probe (env check)
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <pre
          style={{
            padding: 12,
            borderRadius: 12,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            overflowX: "auto",
            fontSize: 12,
          }}
        >
{JSON.stringify(result, null, 2)}
        </pre>
      )}

      <div style={{ opacity: 0.8, fontSize: 12, marginTop: 8 }}>
        Network → Fetch/XHR → <b>/api/probe</b> → lihat field <b>healthUrl</b>
      </div>
    </div>
  );
}
