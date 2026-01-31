"use client";

import CreateClientDialog from "@/components/create-client-dialog";
import DeleteClientDialog, {
  ClientDelete,
} from "@/components/delete-client-dialog";
import EditClientDialog, { ClientEdit } from "@/components/edit-client-dialog";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import { useClients } from "@/hooks/use-clients";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDate } from "@/lib/utils";
import {
  RiAddLine,
  RiBarChartFill,
  RiCloseLine,
  RiDeleteBinLine,
  RiLinkUnlink,
  RiPencilLine,
  RiSearchLine,
} from "@remixicon/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ClientsPage() {
  const { setItems } = useBreadcrumb();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientEdit | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingClient, setDeletingClient] = useState<ClientDelete | null>(
    null,
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: clients, isLoading } = useClients();
  const filteredClients =
    debouncedSearch.trim().length > 0
      ? clients?.filter((client) =>
          client.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
        )
      : clients;

  console.log(filteredClients);
  // Gera breadcrumb
  useEffect(() => {
    setItems([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Clientes" },
    ]);
  }, [setItems]);

  return (
    <>
      <div className="flex items-center justify-between border-b pb-8">
        <h2 className="text-4xl font-bold">Clientes</h2>

        <Button size="lg" onClick={() => setIsCreateOpen(true)}>
          Novo Cliente
          <RiAddLine />
        </Button>
      </div>

      {/* Barra de filtros */}
      <div className="flex flex-col items-center gap-2 border-b py-6 lg:flex-row">
        <InputGroup>
          <InputGroupInput
            placeholder="Buscar cliente pelo nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <InputGroupAddon align="inline-start">
            <RiSearchLine />
          </InputGroupAddon>

          {searchTerm && (
            <InputGroupAddon
              onClick={() => setSearchTerm("")}
              align="inline-end"
              className="cursor-pointer"
            >
              <RiCloseLine className="select-none" />
            </InputGroupAddon>
          )}
        </InputGroup>
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

          {filteredClients?.map((client, i) => (
            <TableRow key={i}>
              <TableCell>{client.name}</TableCell>
              <TableCell className="hidden lg:table-cell">
                {formatDate(client.createdAt)}
              </TableCell>
              <TableCell className="lg:hidden">
                {formatDate(client.createdAt, true)}
              </TableCell>
              <TableCell className="space-x-2 text-right">
                <Link href={`/dashboard/clients/${client.id}`}>
                  <Button size="icon" variant="outline">
                    <RiBarChartFill />
                  </Button>
                </Link>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setEditingClient(client);
                    setIsEditOpen(true);
                  }}
                >
                  <RiPencilLine />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    setDeletingClient(client);
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

      {!isLoading && filteredClients?.length === 0 && searchTerm && (
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-2 py-20">
          <RiLinkUnlink className="text-primary size-10" />
          <h3 className="text-3xl font-bold">Nenhum cliente encontrado.</h3>
          <p className="mb-6 text-center text-sm">
            Tente ajustar ou limpar o filtro de busca
          </p>
          <Button onClick={() => setSearchTerm("")}>Limpar busca</Button>
        </div>
      )}

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

      <EditClientDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        client={editingClient}
      />

      <DeleteClientDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        client={deletingClient}
      />
    </>
  );
}
