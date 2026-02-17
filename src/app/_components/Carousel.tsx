import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function Carousel({ children }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
      {children}
    </div>
  );
}
