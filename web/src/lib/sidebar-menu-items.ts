import {
  RiBarChartFill,
  RiLinksFill,
  RiWhatsappLine,
  RiSuitcaseLine,
  RiFocus2Line,
} from "@remixicon/react";

export const menuItems = [
  { href: "/dashboard", label: "Estatísticas", icon: RiBarChartFill },
  { href: "/dashboard/links", label: "Meus Links", icon: RiLinksFill },
  { href: "/dashboard/clients", label: "Clientes", icon: RiSuitcaseLine },
  { href: "/dashboard/campaigns", label: "Campanhas", icon: RiFocus2Line },
  {
    href: "/",
    label: "Whatsapp Link",
    icon: RiWhatsappLine,
    disabled: true,
  },
];
