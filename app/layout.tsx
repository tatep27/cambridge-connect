import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cambridge Org Hub",
  description: "Collaboration platform for Cambridge-based organizations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

