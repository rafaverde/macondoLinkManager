"use client";

import CreateCampaignDialog from "@/components/create-campaign-dialog";
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
import { useState } from "react";

export default function CampaignsPage() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: clients, isLoading: isLoadingClients } = useClients();
  const { data: campaigns, isLoading: isLoadingCampaigns } = useCampaigns(
    selectedClientId ?? undefined,
  );

  return (
    <>
      <div className="flex items-center justify-between border-b pb-8">
        <div>
          <h2 className="text-4xl font-bold">Campanhas</h2>
        </div>

        <div className="flex items-end justify-center gap-6">
          <Select
            value={selectedClientId ?? ""}
            onValueChange={(value) => setSelectedClientId(value)}
          >
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>

            <SelectContent>
              {clients?.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="lg"
            onClick={() => {
              setIsCreateDialogOpen(true);
            }}
            disabled={!selectedClientId}
          >
            Nova Campanha
            <RiAddLine />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 border-b py-6 lg:flex-row">
        <span>Selecione um cliente</span>
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
              <TableCell>{formatDate(campaign.createdAt)}</TableCell>
              <TableCell className="space-x-2 text-right">
                <Link href={`/dashboard/campaigns/${campaign.id}`}>
                  <Button size="icon" variant="outline">
                    <RiBarChartFill />
                  </Button>
                </Link>

                <Button size="icon" variant="outline" disabled>
                  <RiPencilLine />
                </Button>

                <Button size="icon" variant="destructive" disabled>
                  <RiDeleteBinLine />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {!isLoadingCampaigns && campaigns?.length === 0 && (
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-2 py-20">
          <RiEmotionUnhappyLine className="text-primary size-10" />
          <h3 className="text-3xl font-bold">Nenhuma campanha encontrada.</h3>
          <p className="mb-6 text-center">
            Selecione um cliente para mostrar suas campanhas.
          </p>
        </div>
      )}

      <CreateCampaignDialog
        clientId={selectedClientId!}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {}}
      />

      {/* <EditClientDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        client={editingClient}
      />

      <DeleteClientDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        client={deletingClient}
      /> */}
    </>
  );
}
