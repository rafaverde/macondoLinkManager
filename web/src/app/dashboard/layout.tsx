import { AppBreadcrumbs } from "@/components/app-breadcrumb";
import AppHeader from "@/components/app-header";
import AppSidebar from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BreadcrumbProvider } from "@/contexts/breadcrumb-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}
