"use client";

import { useCreateCampaign } from "@/hooks/use-create-campaign";
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
import { RiLoader4Line } from "@remixicon/react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface CreateCampaignDialogProps {
  clientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (id: string) => void;
}

export default function CreateCampaignDialog({
  clientId,
  open,
  onOpenChange,
  onSuccess,
}: CreateCampaignDialogProps) {
  const [name, setName] = useState("");

  const { mutate, isPending } = useCreateCampaign((newId) => {
    setName("");
    onOpenChange(false);
    onSuccess(newId);
  });

  const handleSave = () => {
    if (!clientId) {
      toast.error("Selecione um cliente primeiro.");
      return;
    }

    if (!name.trim()) return;

    mutate({ name, clientId });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Campanha</DialogTitle>
          <DialogDescription>
            Crie uma campanha para o cliente selecionado.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome da Campanha</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Black Friday 2025"
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
            Salvar Campanha
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
