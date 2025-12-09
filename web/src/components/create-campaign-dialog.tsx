"use client";

import { useCreateCampaign } from "@/hooks/use-create-campaign";
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
import { toast } from "sonner";

interface CreateCampaignDialogProps {
  clientId: string;
  onSelectNew: (id: string) => void;
}

export default function CreateCampaignDialog({
  clientId,
  onSelectNew,
}: CreateCampaignDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const { mutate, isPending } = useCreateCampaign((newId) => {
    setOpen(false);
    setName("");
    onSelectNew(newId);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          type="button"
          title="Criar nova campanha"
          disabled={!clientId} // Desabilita se não tiver cliente selecionado
        >
          <RiAddLine size={18} />
        </Button>
      </DialogTrigger>
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
                  handleSave;
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="button" disabled={isPending} onClick={handleSave}>
            {isPending && (
              <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
            )}
            Salvar Campanha
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
