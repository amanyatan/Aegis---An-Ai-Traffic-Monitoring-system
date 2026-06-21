import { ReactNode } from 'react';
import { FadeIn } from '@/components/premium/FadeIn';

export function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
}) {
  return <FadeIn delay={delay * 1000}>{children}</FadeIn>;
}

export function PageTransition({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
