"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { RiAddLine } from "@remixicon/react";
import CreateClientDialog from "./create-client-dialog";

interface CreateClientInlineProps {
  onSelectNew: (id: string) => void;
}

export default function CreateClientInline({
  onSelectNew,
}: CreateClientInlineProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        type="button"
        title="Criar novo cliente"
        onClick={() => setOpen(true)}
      >
        <RiAddLine />
      </Button>

      <CreateClientDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={(id) => {
          onSelectNew(id);
        }}
      />
    </>
  );
}
