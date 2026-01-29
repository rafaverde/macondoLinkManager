"use client";

import CreateCampaignDialog from "@/components/create-campaign-dialog";
import DeleteCampaignDialog from "@/components/delete-campaign-dialog";
import EditCampaignDialog, {
  CampaignEdit,
} from "@/components/edit-campaign-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBreadcrumb } from "@/contexts/breadcrumb-context";
import { useCampaigns } from "@/hooks/use-campaigns";
import { useClients } from "@/hooks/use-clients";
import { formatDate } from "@/lib/utils";
import {
  RiAddLine,
  RiBarChartFill,
  RiDeleteBinLine,
  RiEmotionUnhappyLine,
  RiPencilLine,
} from "@remixicon/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type ClientScope = "all" | string;

export default function CampaignsPage() {
  const { setItems } = useBreadcrumb();
  const [selectedClientId, setSelectedClientId] = useState<ClientScope>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [editingCampaign, setEditingCampaign] = useState<CampaignEdit | null>(
    null,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: clients, isLoading: isLoadingClients } = useClients();
  const { data: campaigns, isLoading: isLoadingCampaigns } = useCampaigns(
    selectedClientId === "all" ? undefined : selectedClientId,
  );

  const [isDeletingCampaign, setIsDeletingCampaign] =
    useState<CampaignEdit | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isScopedToClient = selectedClientId !== "all";

  useEffect(() => {
    if (!isEditOpen) {
      setEditingCampaign(null);
    }
  }, [isEditOpen]);

  useEffect(() => {
    if (!isDeleteOpen) {
      setIsDeletingCampaign(null);
    }
  }, [isEditOpen]);

  // Gera breadcrumb
  useEffect(() => {
    setItems([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Campanhas" },
    ]);
  }, [setItems]);

  return (
    <>
      <div className="flex flex-col gap-4 border-b pb-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-4xl font-bold">Campanhas</h2>
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row lg:items-end">
          <div className="flex items-center justify-between gap-4">
            <span className="text-right text-xs">
              Para gerenciar campanhas,
              <br /> selecione um cliente
            </span>

            <Select
              value={selectedClientId ?? ""}
              onValueChange={(value) => setSelectedClientId(value)}
              disabled={isLoadingClients}
            >
              <SelectTrigger className="w-[260px]">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos os clientes</SelectItem>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            size="lg"
            onClick={() => {
              setIsCreateDialogOpen(true);
            }}
            disabled={!isScopedToClient}
          >
            Nova Campanha
            <RiAddLine />
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoadingCampaigns &&
            Array.from({ length: 8 }).map((item, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="bg-muted-foreground/20 h-8 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="bg-muted-foreground/20 h-8 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="bg-muted-foreground/20 h-8 w-full" />
                </TableCell>
              </TableRow>
            ))}

          {campaigns?.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell>{campaign.name}</TableCell>
              <TableCell className="table-cell lg:hidden">
                {formatDate(campaign.createdAt, true)}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {formatDate(campaign.createdAt)}
              </TableCell>
              <TableCell className="space-x-2 text-right">
                <Link href={`/dashboard/campaigns/${campaign.id}`}>
                  <Button size="icon" variant="outline">
                    <RiBarChartFill />
                  </Button>
                </Link>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setEditingCampaign(campaign);
                    setIsEditOpen(true);
                  }}
                  disabled={!isScopedToClient}
                >
                  <RiPencilLine />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  disabled={!isScopedToClient}
                  onClick={() => {
                    setIsDeletingCampaign(campaign);
                    setIsDeleteOpen(true);
                  }}
                >
                  <RiDeleteBinLine />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isScopedToClient && campaigns?.length === 0 && (
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-2 py-20">
          <RiEmotionUnhappyLine className="text-primary size-10" />
          <h3 className="text-3xl font-bold">Nenhuma campanha cadastrada.</h3>
          <p className="mb-6 text-center">
            Crie uma nova campanha e links para esse cliente.
          </p>
        </div>
      )}

      {!isLoadingCampaigns && campaigns?.length === 0 && !isScopedToClient && (
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-2 py-20">
          <RiEmotionUnhappyLine className="text-primary size-10" />
          <h3 className="text-3xl font-bold">Nenhuma campanha encontrada.</h3>
          <p className="mb-6 text-center">
            Selecione um cliente para mostrar suas campanhas.
          </p>
        </div>
      )}

      {selectedClientId && (
        <CreateCampaignDialog
          clientId={selectedClientId}
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={() => {}}
        />
      )}

      {selectedClientId && (
        <EditCampaignDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          campaign={editingCampaign}
          clientId={selectedClientId}
        />
      )}

      {selectedClientId && (
        <DeleteCampaignDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          campaign={isDeletingCampaign}
          clientId={selectedClientId}
        />
      )}
    </>
  );
}
