import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
};

export default function Section({ title, subtitle, rightSlot, children }: Props) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="text-lg font-black text-zinc-900 dark:text-zinc-50">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              {subtitle}
            </div>
          ) : null}
        </div>
        {rightSlot ? <div>{rightSlot}</div> : null}
      </div>

      {children}
    </section>
  );
}
