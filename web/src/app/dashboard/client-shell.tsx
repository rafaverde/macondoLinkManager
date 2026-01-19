"use client";

import { TanstackProvider } from "@/providers/tanstack-provider";
import { BreadcrumbProvider } from "@/contexts/breadcrumb-context";
import AppHeader from "@/components/app-header";
import AppSidebar from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppBreadcrumbs } from "@/components/app-breadcrumb";

export function DashboardClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TanstackProvider>
      <SidebarProvider>
        <BreadcrumbProvider>
          <AppSidebar />

          <SidebarInset className="bg-muted flex min-h-screen flex-col">
            <AppHeader />

            <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-8">
              <div className="mb-6">
                <AppBreadcrumbs />
              </div>

              {children}
            </main>
          </SidebarInset>
        </BreadcrumbProvider>
      </SidebarProvider>
    </TanstackProvider>
  );
}
