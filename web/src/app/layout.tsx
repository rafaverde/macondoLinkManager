import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import { TanstackProvider } from "@/providers/tanstack-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AuthFeedback } from "@/components/auth-feedback";
import { Suspense } from "react";

const onest = Onest({
  variable: "--font-onest",
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
      <body className={`${onest.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanstackProvider>
            <Suspense fallback={null}>
              <AuthFeedback />
            </Suspense>
            {children}
            <Toaster />
          </TanstackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
