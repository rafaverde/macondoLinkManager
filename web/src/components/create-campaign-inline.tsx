import { RiAddLine } from "@remixicon/react";
import { Button } from "./ui/button";
import CreateCampaignDialog from "./create-campaign-dialog";
import { useState } from "react";

interface CreateCampaignDialogInlineProps {
  clientId: string;
  onSelectNew: (id: string) => void;
}

export function CreateCampaignInline({
  clientId,
  onSelectNew,
}: CreateCampaignDialogInlineProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        type="button"
        title="Criar nova campanha"
        disabled={!clientId}
        onClick={() => setOpen(true)}
      >
        <RiAddLine />
      </Button>

      <CreateCampaignDialog
        open={open}
        onOpenChange={setOpen}
        clientId={clientId}
        onSuccess={(id) => {
          onSelectNew(id);
        }}
      />
    </>
  );
}
