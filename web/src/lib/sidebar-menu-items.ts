import {
  RiBarChartFill,
  RiLinksFill,
  RiWhatsappLine,
  RiSuitcaseLine,
} from "@remixicon/react";

export const menuItems = [
  { href: "/dashboard", label: "Estatísticas", icon: RiBarChartFill },
  { href: "/dashboard/links", label: "Meus Links", icon: RiLinksFill },
  { href: "/dashboard/clients", label: "Clientes", icon: RiSuitcaseLine },
  {
    href: "/",
    label: "Whatsapp Link",
    icon: RiWhatsappLine,
    disabled: true,
  },
];
