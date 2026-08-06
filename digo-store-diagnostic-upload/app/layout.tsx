import type { Metadata } from "next";
import "./globals.css";
import "./digo-storefront.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "DIGO — Garment Digital Physics",
  description:
    "DIGO gives garments a computable identity built from material, pattern and body."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
