import type { Metadata } from "next";
import { Onest, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TanstackProvider } from "@/providers/tanstack-provider";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Macondo Link Manager",
  description: "Gerenciador de links internos da Macondo Propaganda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${onest.variable} ${geistMono.variable} antialiased`}>
        <TanstackProvider>{children}</TanstackProvider>
      </body>
    </html>
  );
}
