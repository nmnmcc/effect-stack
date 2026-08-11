import { Providers } from "@/components/Providers";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata = {
  title: "effect-stack",
  description: "Full-stack TypeScript with Effect",
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
