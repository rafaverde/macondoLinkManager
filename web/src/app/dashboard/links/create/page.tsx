"use client";

import LinkForm from "@/components/link-form";
import { Button } from "@/components/ui/button";
import { BreadcrumbItem, useBreadcrumb } from "@/contexts/breadcrumb-context";
import { RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";
import { useEffect } from "react";

export default function CreateLinkPage() {
  const { setItems } = useBreadcrumb();

  // Gera breadcrumb
  useEffect(() => {
    setItems([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Link" },
      { label: "Novo" },
    ]);
  }, [setItems]);

  return (
    <>
      <div className="flex items-center justify-between border-b pb-8">
        <h2 className="text-4xl font-bold">Criar novo link</h2>
        <Link href="/dashboard/links">
          <Button size="lg">
            Voltar
            <RiArrowLeftLine />
          </Button>
        </Link>
      </div>

      <div className="py-8">
        <LinkForm />
      </div>
    </>
  );
}
