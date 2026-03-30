import { useDeleteLink } from "@/hooks/use-delete-links";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { formatLink } from "@/lib/utils";
import { RiLoader4Line } from "@remixicon/react";

interface DeleteLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: {
    id: string;
    shortCode: string;
  };
}

export default function DeleteLinkDialog({
  open,
  onOpenChange,
  link,
}: DeleteLinkDialogProps) {
  const { mutate: deleteLink, isPending: isDeleting } = useDeleteLink();

  const handleDelete = () => {
    if (!link) return;
    deleteLink(link.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que vai deletar o link?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita! O link{" "}
            <strong>{formatLink(link.shortCode)}</strong> deixará de funcionar
            imediatamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="min-w-[140px]"
          >
            {isDeleting ? (
              <>
                <RiLoader4Line className="mr-2 size-4 animate-spin" />
                Removendo
              </>
            ) : (
              "Sim, deletar!"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
