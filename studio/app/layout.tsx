import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design Studio",
  description: "Self-hosted AI design studio — brief in, on-brand HTML artifact out.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
