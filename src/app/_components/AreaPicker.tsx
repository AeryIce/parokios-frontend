"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  areas: readonly string[];
  currentArea: string;
};

export function AreaPicker({ areas, currentArea }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-stone-600">Area:</span>
      <select
        value={currentArea}
        onChange={(e) => {
          const next = e.target.value;
          const params = new URLSearchParams(sp.toString());
          params.set("area", next);
          router.push(`/?${params.toString()}`);
        }}
        className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-900 shadow-sm outline-none focus:ring-2"
        style={{ boxShadow: "0 0 0 0 var(--ring)" }}
      >
        {areas.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );
}
