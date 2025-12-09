import { Link as LinkType } from "@/types";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { createInitials, formatDate, formatLink } from "@/lib/utils";
import {
  RiBarChartFill,
  RiCalendarLine,
  RiDeleteBinLine,
  RiExternalLinkLine,
  RiFileCopyLine,
  RiLoader4Line,
  RiMoreFill,
  RiPencilLine,
  RiShareLine,
} from "@remixicon/react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { useDeleteLink } from "@/hooks/use-delete-links";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
} from "./ui/alert-dialog";
import Link from "next/link";

interface LinkCardProps {
  link: LinkType;
}

export default function LinkCard({ link }: LinkCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteLink, isPending: isDeleting } = useDeleteLink();

  const initials = createInitials(link.client?.name);

  const handleCopyLink: any = () => {
    // Remove o protocolo para exibição, mas mantém pra cópia
    const shortUrl = formatLink(link.shortCode);
    navigator.clipboard.writeText(shortUrl);
    toast.success("Link copiado para a área de transferência.");
  };

  const handleDelete = () => {
    deleteLink(link.id, {
      onSuccess: () => setIsDeleteDialogOpen(false),
    });
  };

  return (
    <>
      <Card className="group flex shadow-xs transition-all duration-200 hover:shadow-sm">
        <CardContent className="flex flex-col gap-6 lg:flex-row">
          <Avatar className="size-12">
            <AvatarFallback className="text-background bg-macondo-gray-200 flex w-full items-center justify-center text-center font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div>
              <h2 className="text-2xl leading-tight">{link.client?.name}</h2>

              <h3 className="text-muted-foreground">
                {link.campaign?.name || "Nomeia a campanha"}
              </h3>

              <button onClick={handleCopyLink}>
                <div className="text-muted-foreground group/link flex cursor-pointer gap-1 py-1 select-none">
                  <RiFileCopyLine className="group-hover/link:text-primary" />
                  <span className="text-primary font-bold">
                    {formatLink(link.shortCode)}
                  </span>
                </div>
              </button>

              <p className="text-muted-foreground flex gap-1 text-xs">
                <RiExternalLinkLine className="size-4" />
                {link.originalUrl}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2 text-sm md:flex-row md:gap-8">
              <div className="text-primary flex items-start gap-1 font-bold md:items-center">
                <RiBarChartFill className="size-4" />
                {link._count?.clicks}{" "}
                {link._count?.clicks === 1 ? "clique" : "cliques"}
              </div>

              <div className="text-macondo-gray-400 flex items-center gap-1">
                <RiCalendarLine className="size-4" />
                {formatDate(link.createdAt)}
              </div>
            </div>
          </div>

          <div className="space-x-2">
            <Button onClick={handleCopyLink}>
              <RiFileCopyLine />
              Copiar
            </Button>

            <Button variant="outline">
              <RiShareLine />
              Compartilhar
            </Button>

            <Button size="icon" variant="outline">
              <RiPencilLine />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <RiMoreFill />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link href={formatLink(link.shortCode)} target="_blank">
                  <DropdownMenuItem className="cursor-pointer">
                    <RiExternalLinkLine className="size-4" />
                    Abrir Link
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                  <RiPencilLine className="size-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RiBarChartFill />
                  Estatísticas
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="hover:text-destructive! cursor-pointer"
                >
                  <RiDeleteBinLine className="hover:text-destructive!" />
                  Deletar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que vai deletar o link?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita! O link{" "}
              <strong>{formatLink(link.shortCode)}</strong> deixará de funcionar
              imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="min-w-[140px]"
            >
              {isDeleting ? (
                <>
                  <RiLoader4Line className="mr-2 size-4 animate-spin" />
                  Removendo
                </>
              ) : (
                "Sim, deletar!"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
