"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClients } from "@/hooks/use-clients";
import {
  RiAddLine,
  RiBarChartFill,
  RiDeleteBinLine,
  RiPencilLine,
} from "@remixicon/react";
import Link from "next/link";
import { useState } from "react";

export default function CampaignsPage() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const { data: clients, isLoading: isLoadingClients } = useClients();

  return (
    <>
      <div className="flex items-center justify-between border-b pb-8">
        <div>
          <h2 className="text-4xl font-bold">Campanhas</h2>
        </div>

        <Button size="lg" onClick={() => {}}>
          Nova Campanha
          <RiAddLine />
        </Button>
      </div>

      <div className="flex flex-col items-center gap-2 border-b py-6 lg:flex-row">
        <span>Selecione um cliente</span>

        {/* Filtros por digitação */}
        <div className="flex w-full flex-1">
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
          {/* {isLoading &&
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
            ))} */}

          {Array.from({ length: 8 }).map((client, i) => (
            <TableRow key={i}>
              <TableCell>Campanha {i + 1}</TableCell>
              <TableCell>28 de janeiro de 2026</TableCell>
              <TableCell className="space-x-2 text-right">
                <Link href={`/dashboard/campaings`}>
                  <Button size="icon" variant="outline">
                    <RiBarChartFill />
                  </Button>
                </Link>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    // setEditingClient(client);
                    // setIsEditOpen(true);
                  }}
                >
                  <RiPencilLine />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    // setDeletingClient(client);
                    // setIsDeleteOpen(true);
                  }}
                >
                  <RiDeleteBinLine />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* {!isLoading && clients?.length === 0 && (
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-2 py-20">
          <RiLinkUnlink className="text-primary size-10" />
          <h3 className="text-3xl font-bold">Nenhuma campanha encontrado.</h3>
          <p className="mb-6 text-center text-sm">Cadastre uma nova campanha para um cliente.</p>
        </div>
      )} */}

      {/* <CreateClientDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => {}}
      />

      <EditClientDialog
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
