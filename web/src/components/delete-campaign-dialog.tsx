import { useDeleteCampaign } from "@/hooks/use-delete-campaign";
import { CampaignEdit } from "./edit-campaign-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { RiAlertLine, RiLoader4Line } from "@remixicon/react";
import { Button } from "./ui/button";

interface DeleteCampaignDialogProps {
  campaign: CampaignEdit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteCampaignDialog({
  campaign,
  open,
  onOpenChange,
}: DeleteCampaignDialogProps) {
  const { mutate, isPending } = useDeleteCampaign();

  if (!campaign) return null;

  function handleDelete() {
    if (!campaign) return;

    mutate(campaign.id, {
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
            Excluir campanha
          </DialogTitle>

          <DialogDescription className="space-y-2">
            <p>
              Esta ação é <strong>irreversível</strong>.
            </p>
            <p>
              Os links associados a esta campanha{" "}
              <strong>não serão excluídos</strong>, apenas desassociados.
            </p>
          </DialogDescription>
        </DialogHeader>

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
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending && (
              <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
            )}
            Excluir campanha
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
