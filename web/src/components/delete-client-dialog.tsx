"use client";

import { useDeleteClient } from "@/hooks/use-delete-clients";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { RiAlertLine, RiLoader4Line } from "@remixicon/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export interface ClientDelete {
  id: string;
  name: string;
}

interface DeleteClientDialogProps {
  client: ClientDelete | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteClientDialog({
  client,
  open,
  onOpenChange,
}: DeleteClientDialogProps) {
  const [confirmation, setConfirmation] = useState("");

  const { mutate, isPending } = useDeleteClient();

  useEffect(() => {
    if (!open) {
      setConfirmation("");
    }
  }, [open]);

  if (!client) return null;
  const isConfirmed = confirmation === client.name;

  function handleDelete() {
    if (!client) return;

    if (!isConfirmed) {
      toast.error("É necessário confirmar o nome do cliente para apagar.");
      return;
    }

    mutate(client.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2 text-2xl font-bold">
            <RiAlertLine className="h-8 w-8" />
            Excluir cliente
          </DialogTitle>

          <DialogDescription className="space-y-2">
            <p>
              <strong className="text-destructive">
                Esta ação é irreversível.
              </strong>
            </p>
            <p>
              Todas as campanhas e links associados a este cliente{" "}
              <strong>serão permanentemente removidos.</strong>
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <p className="text-sm">
            Para confirmar, digite o nome do cliente:
            <br />
            <strong>{client.name}</strong>
          </p>

          <Input
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="Digite o nome do cliente"
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="default"
            disabled={!isConfirmed || isPending}
            onClick={handleDelete}
            className="bg-primary"
          >
            {isPending && (
              <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
            )}
            Excluir definitivamente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
