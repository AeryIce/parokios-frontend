"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  areas: readonly string[];
  currentArea: string;
};

export default function AreaPicker({ areas, currentArea }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const options = useMemo(() => {
    const uniq = Array.from(new Set(areas));
    return uniq.length > 0 ? uniq : ["Jakarta Timur"];
  }, [areas]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
        Area:
      </span>

      <select
        className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
        value={currentArea}
        onChange={(e) => {
          const next = e.target.value;
          const params = new URLSearchParams(sp.toString());
          params.set("area", next);
          router.replace(`/?${params.toString()}`);
        }}
      >
        {options.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );
}
