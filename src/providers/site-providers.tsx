import type { ReactNode } from "react";
import { PageTransitionProvider } from "./page-transition-provider";

export function SiteProviders({ children }: { children: ReactNode }) {
  return <PageTransitionProvider>{children}</PageTransitionProvider>;
}
