import { Link as LinkType } from "@/types";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn, createInitials, formatDate, formatLink } from "@/lib/utils";
import {
  RiBarChartFill,
  RiCalendarLine,
  RiDeleteBinLine,
  RiExternalLinkLine,
  RiEyeLine,
  RiFileCopyLine,
  RiMegaphoneLine,
  RiMoreFill,
  RiPencilLine,
  RiPriceTag3Line,
  RiShareLine,
  RiUserSharedLine,
} from "@remixicon/react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import Link from "next/link";
import ShareLinkDialog from "./share-link-dialog";
import DeleteLinkDialog from "./delete-link-dialog";
import { handleCopyLink } from "@/lib/link-share";
import { Badge } from "./ui/badge";

interface LinkCardProps {
  link: LinkType;
  isDetails?: boolean;
}

export default function LinkCard({ link, isDetails }: LinkCardProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const initials = createInitials(link.client?.name);

  return (
    <>
      <Card className="hover:border-macondo-gray-500/20 flex shadow-xs transition-all duration-200 hover:border hover:shadow-sm">
        <CardContent className="flex flex-col gap-6 lg:flex-row">
          <Avatar className="size-12">
            <AvatarFallback className="text-background bg-macondo-gray-200 flex w-full items-center justify-center text-center font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div>
              <Link href={`/dashboard/links/${link.id}`}>
                <h2 className="text-2xl leading-tight transition-opacity duration-300 group-hover:opacity-75">
                  {link.name ? link.name : "Sem nome"}
                </h2>
              </Link>

              <div className="flex gap-4">
                <Link href={`/dashboard/clients/${link.clientId}`}>
                  <div className="group flex items-center-safe gap-1">
                    <RiUserSharedLine className="text-muted-foreground size-4" />
                    <h3 className="text-muted-foreground transition-opacity duration-300 hover:opacity-75">
                      {link.client?.name}
                    </h3>
                    <RiBarChartFill className="size-4 opacity-0 transition-opacity duration-500 group-hover:opacity-50" />
                  </div>
                </Link>

                {link.campaign?.name ? (
                  <Link href={`/dashboard/campaigns/${link.campaignId}`}>
                    <div className="group flex items-center-safe gap-1">
                      <RiMegaphoneLine className="text-muted-foreground size-4" />
                      <h3 className="text-muted-foreground transition-opacity duration-300 hover:opacity-75">
                        {link.campaign?.name}
                      </h3>
                      <RiBarChartFill className="size-4 opacity-0 transition-opacity duration-500 group-hover:opacity-50" />
                    </div>
                  </Link>
                ) : (
                  <h3 className="text-muted-foreground">Sem campanha</h3>
                )}
              </div>

              <button
                onClick={() => handleCopyLink(formatLink(link.shortCode, true))}
              >
                <div className="text-muted-foreground group/link flex cursor-pointer gap-1 py-1 select-none">
                  <RiFileCopyLine className="group-hover/link:text-primary" />
                  <span className="text-primary font-bold">
                    {formatLink(link.shortCode)}
                  </span>
                </div>
              </button>

              <div className="flex gap-1">
                <div>
                  <RiExternalLinkLine className="text-muted-foreground w-4" />
                </div>
                <p className="text-muted-foreground flex gap-1 text-xs break-all">
                  {link.originalUrl}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 text-sm md:flex-row md:gap-5">
              <Link
                href={`/dashboard/links/${link.id}`}
                className={cn("", isDetails && "pointer-events-none")}
              >
                <div className="text-primary flex items-start gap-1 font-bold opacity-100 transition-opacity duration-300 hover:opacity-80 md:items-center">
                  <RiBarChartFill className="size-4" />
                  {link.validClicks} {link.validClicks === 1 ? "clique" : "cliques"}
                </div>
              </Link>

              <div className="text-macondo-gray-400 flex items-center gap-1">
                <RiCalendarLine className="size-4" />
                {formatDate(link.createdAt)}
              </div>

              <div className="flex items-center gap-1">
                {link.tags && (
                  <RiPriceTag3Line className="text-macondo-gray-400 size-4" />
                )}
                {link.tags &&
                  link.tags.map((tag) => (
                    <Badge
                      variant="outline"
                      key={tag.id}
                      className="border-muted-foreground/50 text-macondo-gray-400 pointer-events-none"
                    >
                      {tag.name}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 space-x-2">
            {!isDetails && (
              <Link href={`/dashboard/links/${link.id}`}>
                <Button variant="outline">
                  <RiEyeLine />
                  Detalhes
                </Button>
              </Link>
            )}

            <Button
              onClick={() => handleCopyLink(formatLink(link.shortCode, true))}
            >
              <RiFileCopyLine />
              Copiar
            </Button>

            <Button variant="outline" onClick={() => setIsShareOpen(true)}>
              <RiShareLine />
              Compartilhar
            </Button>

            <Link href={`/dashboard/links/${link.id}/edit`}>
              <Button size="icon" variant="outline">
                <RiPencilLine />
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <RiMoreFill />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link href={formatLink(link.shortCode, true)} target="_blank">
                  <DropdownMenuItem className="cursor-pointer">
                    <RiExternalLinkLine className="size-4" />
                    Abrir Link
                  </DropdownMenuItem>
                </Link>
                <Link href={`/dashboard/links/${link.id}/edit`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <RiPencilLine className="size-4" />
                    Editar
                  </DropdownMenuItem>
                </Link>
                <Link href={`/dashboard/links/${link.id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <RiBarChartFill />
                    Estatísticas
                  </DropdownMenuItem>
                </Link>

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

      <DeleteLinkDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        link={link}
      />

      <ShareLinkDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        shortUrl={link.shortCode}
        linkName={link.name}
      />
    </>
  );
}
