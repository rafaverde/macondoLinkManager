"use client";

import AppHeader from "@/components/app-header";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
