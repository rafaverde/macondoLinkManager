// components/app-breadcrumbs.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RiArrowRightSLine } from "@remixicon/react";

export interface BreadcrumbItemData {
  label: string;
  href?: string;
}

export function AppBreadcrumbs({ items }: { items: BreadcrumbItemData[] }) {
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

            {index < items.length - 1 && (
              <BreadcrumbSeparator>
                <RiArrowRightSLine className="size-4" />
              </BreadcrumbSeparator>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
