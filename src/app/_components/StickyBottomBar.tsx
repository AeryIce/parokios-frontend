"use client";

import { useMemo, useState } from "react";

type Props = {
  title: string;
  priceLabel: string;
  path: string; // contoh: /rawamangun/oma-nanas/nastar-nanas-butter
  whatsappDigits?: string | null;
  waMessage?: string | null;
  shareText?: string | null; // optional (kalau null, auto bikin default)
};

function getAbsoluteUrl(path: string): string {
  if (typeof window === "undefined") return path;
  const origin = window.location.origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function waLink(waDigits: string, message: string): string {
  const clean = waDigits.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${clean}?text=${text}`;
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

export default function StickyBottomBar({
  title,
  priceLabel,
  path,
  whatsappDigits,
  waMessage,
  shareText,
}: Props) {
  const absUrl = useMemo(() => getAbsoluteUrl(path), [path]);

  const waHref = useMemo(() => {
    if (!whatsappDigits || !waMessage) return null;
    const digits = whatsappDigits.trim();
    if (!digits) return null;
    return waLink(digits, waMessage);
  }, [whatsappDigits, waMessage]);

  const composedShareText = useMemo(() => {
    if (shareText && shareText.trim().length > 0) return shareText.trim();
    return `🍗 ${title}\n${priceLabel}\n${absUrl}`;
  }, [shareText, title, priceLabel, absUrl]);

  const [toast, setToast] = useState<string>("");

  function showToast(msg: string): void {
    setToast(msg);
    window.setTimeout(() => setToast(""), 1400);
  }

  async function handleShare(): Promise<void> {
    if (typeof navigator === "undefined") return;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: composedShareText, url: absUrl });
        showToast("Kebagi ✅");
        return;
      } catch {
        // user cancel -> ignore
      }
    }

    const ok = await copyToClipboard(composedShareText);
    showToast(ok ? "Caption tercopy ✅" : "Gagal copy 😭");
  }

  async function handleCopyLink(): Promise<void> {
    const ok = await copyToClipboard(absUrl);
    showToast(ok ? "Link tercopy ✅" : "Gagal copy 😭");
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200 bg-white/90 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 pb-[env(safe-area-inset-bottom)]">
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-extrabold text-stone-900">{title}</div>
          <div className="text-sm font-black text-orange-700">{priceLabel}</div>
        </div>

        {waHref ? (
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Chat WA
          </a>
        ) : (
          <div className="inline-flex h-11 items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 text-sm font-extrabold text-stone-500">
            WA -
          </div>
        )}

        <button
          type="button"
          onClick={() => void handleShare()}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-amber-600 px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-amber-700"
        >
          Share
        </button>

        <button
          type="button"
          onClick={() => void handleCopyLink()}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-stone-200 bg-white px-3 text-sm font-extrabold text-stone-900 shadow-sm transition hover:bg-stone-50"
        >
          Copy
        </button>
      </div>

      {toast ? (
        <div className="mx-auto max-w-5xl px-4 pb-2 text-xs font-extrabold text-emerald-700">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
