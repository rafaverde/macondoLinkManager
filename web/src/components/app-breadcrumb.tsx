"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getBreadcrumbsFromPath } from "@/lib/get-breadcrumbs-from-path";
import { usePathname } from "next/navigation";

export function AppBreadcrumbs() {
  const pathname = usePathname();

  const items = getBreadcrumbsFromPath(pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            {item.href ? (
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            )}
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
