"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar";
import { usePathname } from "next/navigation";

import { RiBarChartFill, RiLinksFill, RiWhatsappLine } from "@remixicon/react";
import macondoLogo from "@/assets/macondo-logo.svg";
import macondoIcon from "@/assets/macondo-icon.svg";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  { href: "/dashboard/links", label: "Meus Links", icon: RiLinksFill },
  { href: "/dashboard", label: "Estatísticas", icon: RiBarChartFill },
  {
    href: "/",
    label: "Whatsapp Link",
    icon: RiWhatsappLine,
    disabled: true,
  },
];

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      variant="sidebar"
      className="bg-background"
    >
      <SidebarHeader className="bg-background h-20 justify-center">
        <div className="flex max-w-[80%] justify-center px-4 group-data-[collapsible=icon]:hidden">
          <Image
            src={macondoLogo}
            alt="Macondo Propaganda"
            className="h-8 w-auto"
          />
        </div>

        <div className="hidden items-center justify-center group-data-[collapsible=icon]:block">
          <Image
            src={macondoIcon}
            alt="Macondo Propaganda"
            className="size-8"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-background">
        <SidebarMenu className="p-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <SidebarMenuItem key={index + item.href}>
                <SidebarMenuButton
                  size="lg"
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className="data-[active=true]:border-macondo-gray-300 hover:bg-macondo-gray-100 p-4 data-[active=true]:border"
                >
                  <Link
                    href={item.href}
                    className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
                  >
                    <item.icon className="text-primary size-5!" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
