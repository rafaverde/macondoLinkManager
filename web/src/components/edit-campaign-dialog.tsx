"use client";

import { useUpdateCampaign } from "@/hooks/use-update-campaign";
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

export interface CampaignEdit {
  id: string;
  name: string;
}

interface EditCampaignDialogProps {
  campaign: CampaignEdit | null;
  clientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditCampaignDialog({
  campaign,
  clientId,
  open,
  onOpenChange,
}: EditCampaignDialogProps) {
  const [name, setName] = useState(campaign?.name ?? "");

  const { mutate, isPending } = useUpdateCampaign(clientId);

  function handleSave() {
    if (!campaign || !name.trim()) return;

    mutate(
      { id: campaign.id, name },
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
        if (nextOpen && campaign) {
          setName(campaign.name);
        }

        if (!nextOpen) {
          setName("");
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar campanha</DialogTitle>
          <DialogDescription>Atualize o nome da campanha.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome da campanha</Label>
            <Input
              key={campaign?.id ?? "campaign-name"}
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Black Friday 2026"
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
              onOpenChange(false);
            }}
          >
            Cancelar
          </Button>

          <Button type="button" onClick={handleSave} disabled={isPending}>
            {isPending && (
              <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
            )}
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
