export function getBreadcrumbsFromPath(path: string) {
  if (path.startsWith("/dashboard/links")) {
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Links", href: "/dashboard/links" },
      { label: "Clientes", href: "/dashboard/clients" },
      { label: "Campanhas", href: "/dashboard/campaings" },
    ];
  }

  return [{ label: "Dashboard", href: "/dashboard" }];
}
