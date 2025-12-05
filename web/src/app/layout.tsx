import type { Metadata } from "next";
import { Onest, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TanstackProvider } from "@/providers/tanstack-provider";
import { ThemeProvider } from "@/components/theme-provider";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${onest.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanstackProvider>{children}</TanstackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
