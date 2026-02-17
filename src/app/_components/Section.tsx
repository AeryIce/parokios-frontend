import type { ReactNode } from "react";

type Props = {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Section({ id, title, subtitle, children }: Props) {
  return (
    <section id={id} className="mt-10">
      <div className="mb-4">
        <h2 className="text-xl font-extrabold text-stone-900">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-stone-600">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
