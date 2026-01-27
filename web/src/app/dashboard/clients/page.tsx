"use client";

import CreateClientDialog from "@/components/create-client-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClients } from "@/hooks/use-clients";
import { formatDate } from "@/lib/utils";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiLinkUnlink,
  RiPencilLine,
} from "@remixicon/react";
import { useState } from "react";

export default function ClientsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: clients, isLoading } = useClients();

  return (
    <>
      <div className="flex items-center justify-between border-b pb-8">
        <h2 className="text-4xl font-bold">Clientes</h2>

        <Button size="lg" onClick={() => setIsCreateOpen(true)}>
          Novo Cliente
          <RiAddLine />
        </Button>
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
          {isLoading &&
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

          {clients?.map((client, i) => (
            <TableRow key={i}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{formatDate(client.createdAt)}</TableCell>
              <TableCell className="space-x-2 text-right">
                <Button size="icon" variant="outline">
                  <RiPencilLine />
                </Button>

                <Button size="icon" variant="destructive">
                  <RiDeleteBinLine />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {!isLoading && clients?.length === 0 && (
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-2 py-20">
          <RiLinkUnlink className="text-primary size-10" />
          <h3 className="text-3xl font-bold">Nenhum cliente encontrado.</h3>
          <p className="mb-6 text-center text-sm">Cadastre um novo cliente.</p>
        </div>
      )}

      <CreateClientDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => {}}
      />
    </>
  );
}
