import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Secret Market - Bet in Secret. Win in Public",
  description: "Private prediction markets powered by FHEVM technology. Bet in secret, win in public.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
