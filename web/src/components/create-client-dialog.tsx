"use client";

import { useCreateClient } from "@/hooks/use-create-client";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { RiAddLine, RiLoader4Line } from "@remixicon/react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface CreateClientDialogProps {
  onSelectNew: (id: string) => void;
}

export default function CreateClientDialog({
  onSelectNew,
}: CreateClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const { mutate, isPending } = useCreateClient((newId) => {
    setOpen(false);
    setName("");
    onSelectNew(newId);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutate(name);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          type="button"
          title="Criar novo cliente"
        >
          <RiAddLine />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>
              Adicione um novo cliente para vincular aos links.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Cliente</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Macondo Propaganda"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <RiLoader4Line className="mr-2 size-4 animate-spin" />
              )}
              Salvar Cliente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
