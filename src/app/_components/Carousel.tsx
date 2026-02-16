import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Carousel({ children }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  );
}
