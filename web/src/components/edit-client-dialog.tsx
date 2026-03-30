"use client";

import { useUpdateClient } from "@/hooks/use-update-client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RiLoader4Line } from "@remixicon/react";

export interface ClientEdit {
  id: string;
  name: string;
}

interface EditClientDialogProps {
  client: ClientEdit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditClientDialog({
  client,
  open,
  onOpenChange,
}: EditClientDialogProps) {
  const [name, setName] = useState(client?.name ?? "");

  const { mutate, isPending } = useUpdateClient();

  function handleSave() {
    if (!client || !name.trim()) return;

    mutate(
      { id: client.id, name },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen && client) {
          setName(client.name);
        }

        if (!nextOpen) {
          setName("");
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualizar informações do cliente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Cliente</Label>
            <Input
              key={client?.id ?? "client-name"}
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Macondo Propaganda"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setName("");
              onOpenChange(false);
            }}
          >
            Cancelar
          </Button>

          <Button type="button" disabled={isPending} onClick={handleSave}>
            {isPending && (
              <RiLoader4Line className="mr-2 size-4 animate-spin" />
            )}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
