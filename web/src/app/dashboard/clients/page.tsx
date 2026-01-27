"use client";

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
import { RiAddLine, RiDeleteBinLine, RiPencilLine } from "@remixicon/react";
import { useState } from "react";

export default function ClientsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const isLoading = false;

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

          {Array.from({ length: 8 }).map((item, i) => (
            <TableRow key={i}>
              <TableCell>Macondo Propaganda Cliente [{i + 1}]</TableCell>
              <TableCell>20/01/2026</TableCell>
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
    </>
  );
}
