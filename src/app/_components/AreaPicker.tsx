"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type AreaPickerProps = {
  areas: string[];
  currentArea: string;
};

function AreaPickerInner({ areas, currentArea }: AreaPickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setArea(nextArea: string) {
    const sp = new URLSearchParams(searchParams.toString());
    if (!nextArea) sp.delete("area");
    else sp.set("area", nextArea);

    const qs = sp.toString();
    router.replace(qs ? `/?${qs}` : "/");
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-semibold text-zinc-700">Area</label>
      <select
        value={currentArea}
        onChange={(e) => setArea(e.target.value)}
        className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
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

export default function AreaPicker(props: AreaPickerProps) {
  return (
    <Suspense
      fallback={
        <div className="h-9 w-40 animate-pulse rounded-xl bg-zinc-100" />
      }
    >
      <AreaPickerInner {...props} />
    </Suspense>
  );
}
