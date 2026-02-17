"use client";

import { useMemo, useState } from "react";

type Props = {
  title: string;
  path: string; // contoh: /rawamangun/oma-nanas
  captionPrimaryTemplate: string; // boleh pakai placeholder {{url}}
  captionSecondaryTemplate?: string; // optional (versi lingkungan), boleh pakai {{url}}
};

function getAbsoluteUrl(path: string): string {
  if (typeof window === "undefined") return path;
  const origin = window.location.origin;
  if (!origin) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function withCacheBuster(absUrl: string): string {
  const stamp = Date.now().toString(36);
  try {
    const u = new URL(absUrl);
    u.searchParams.set("v", stamp);
    return u.toString();
  } catch {
    const sep = absUrl.includes("?") ? "&" : "?";
    return `${absUrl}${sep}v=${stamp}`;
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "true");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function applyTemplate(template: string, url: string): string {
  return template.replaceAll("{{url}}", url).trim();
}

export function BroadcastKit({
  title,
  path,
  captionPrimaryTemplate,
  captionSecondaryTemplate,
}: Props) {
  const url = useMemo(() => getAbsoluteUrl(path), [path]);

  const captionPrimary = useMemo(
    () => applyTemplate(captionPrimaryTemplate, url),
    [captionPrimaryTemplate, url]
  );

  const captionSecondary = useMemo(() => {
    if (!captionSecondaryTemplate) return "";
    return applyTemplate(captionSecondaryTemplate, url);
  }, [captionSecondaryTemplate, url]);

  const [toast, setToast] = useState<string>("");

  function showToast(msg: string): void {
    setToast(msg);
    window.setTimeout(() => setToast(""), 1400);
  }

  async function handleShare(): Promise<void> {
    if (typeof navigator === "undefined") return;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: captionPrimary, url });
        showToast("Kebagi ✅");
        return;
      } catch {
        // user cancel -> ignore
      }
    }

    const ok = await copyToClipboard(captionPrimary);
    showToast(ok ? "Caption tercopy ✅" : "Gagal copy 😭");
  }

  async function handleCopyLink(): Promise<void> {
    const ok = await copyToClipboard(url);
    showToast(ok ? "Link tercopy ✅" : "Gagal copy 😭");
  }

  async function handleCopyPrimary(): Promise<void> {
    const ok = await copyToClipboard(captionPrimary);
    showToast(ok ? "Caption (umum) tercopy ✅" : "Gagal copy 😭");
  }

  async function handleCopySecondary(): Promise<void> {
    if (!captionSecondary) return;
    const ok = await copyToClipboard(captionSecondary);
    showToast(ok ? "Caption (lingkungan) tercopy ✅" : "Gagal copy 😭");
  }

  async function handleCopyFreshLink(): Promise<void> {
    const freshUrl = withCacheBuster(url);
    const ok = await copyToClipboard(freshUrl);
    showToast(ok ? "Link fresh tercopy ✅" : "Gagal copy 😭");
  }

  async function handleCopyFreshCaption(): Promise<void> {
    const freshUrl = withCacheBuster(url);
    const freshCaption = applyTemplate(captionPrimaryTemplate, freshUrl);
    const ok = await copyToClipboard(freshCaption);
    showToast(ok ? "Caption fresh tercopy ✅" : "Gagal copy 😭");
  }

  return (
    <div className="mt-6 rounded-3xl border border-stone-200 bg-white/85 p-5 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-lg font-black text-stone-900">Share & Broadcast Kit</div>
          <div className="mt-1 text-sm font-semibold text-stone-600">
            Tinggal copy caption atau klik Share. Kalau preview WA ngeyel, pakai versi{" "}
            <span className="font-black">fresh</span> 😄
          </div>
        </div>

        {toast ? (
          <div className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white shadow-sm">
            {toast}
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleShare()}
          className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-amber-700"
        >
          Share 🚀
        </button>

        <button
          type="button"
          onClick={() => void handleCopyLink()}
          className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-black text-stone-900 shadow-sm transition hover:bg-stone-50"
        >
          Copy link
        </button>

        <button
          type="button"
          onClick={() => void handleCopyFreshLink()}
          className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-black text-stone-900 shadow-sm transition hover:bg-stone-50"
        >
          Copy link (fresh)
        </button>

        <button
          type="button"
          onClick={() => void handleCopyPrimary()}
          className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-black text-stone-900 shadow-sm transition hover:bg-stone-50"
        >
          Copy caption (umum)
        </button>

        <button
          type="button"
          onClick={() => void handleCopyFreshCaption()}
          className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-black text-stone-900 shadow-sm transition hover:bg-stone-50"
        >
          Copy caption (fresh)
        </button>

        {captionSecondary ? (
          <button
            type="button"
            onClick={() => void handleCopySecondary()}
            className="inline-flex items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-black text-stone-900 shadow-sm transition hover:bg-stone-50"
          >
            Copy caption (lingkungan)
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-black text-stone-700">Preview (umum)</div>
          <pre className="mt-2 whitespace-pre-wrap text-xs font-semibold text-stone-700">
            {captionPrimary}
          </pre>
        </div>

        {captionSecondary ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-black text-stone-700">Preview (lingkungan)</div>
            <pre className="mt-2 whitespace-pre-wrap text-xs font-semibold text-stone-700">
              {captionSecondary}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default BroadcastKit;
