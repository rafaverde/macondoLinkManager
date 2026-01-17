"use client";

import LinkForm from "@/components/link-form";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/contexts/breadcrumb-context";
import { useLink } from "@/hooks/use-link";
import { formatLink } from "@/lib/utils";
import { RiArrowLeftLine, RiLinkUnlink, RiLoader4Line } from "@remixicon/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function EditLinkPage() {
  const params = useParams();
  const linkId = params.id as string;
  const { setItems } = useBreadcrumb();

  const { data: link, isLoading, isError } = useLink(linkId);

  useEffect(() => {
    if (!link) return;

    setItems([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Links", href: "/dashboard/links" },
      { label: "Edit" },
      { label: `ShortCode: ${link.shortCode}` },
    ]);
  }, [link, setItems]);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <RiLoader4Line className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground">Carregando dados do link...</p>
      </div>
    );
  }

  if (isError || !link) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-10 text-center">
        <RiLinkUnlink className="text-primary mb-6 size-16" />
        <h2 className="text-destructive text-xl font-bold">
          Erro ao carregar link
        </h2>
        <p className="text-muted-foreground mb-4">
          O link pode ter sido removido ou você não tem permissão.
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard/links">Voltar para lista</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border-b pb-8">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold">Editar Link</h2>
          <p className="text-muted-foreground text-sm">
            Editando o link{" "}
            <strong className="text-primary font-mono">
              {formatLink(link.shortCode)}
            </strong>
          </p>
        </div>
        <Link href="/dashboard/links">
          <Button size="lg">
            Voltar
            <RiArrowLeftLine />
          </Button>
        </Link>
      </div>

      <div className="py-8">
        <LinkForm initialData={link} />
      </div>
    </>
  );
}
