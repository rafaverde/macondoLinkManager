"use client";

import { toast } from "sonner";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { RiFileCopyLine, RiQrCodeLine } from "@remixicon/react";
import { Button } from "./ui/button";
import { QRCode } from "./qr-code";

interface ShareLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortUrl: string;
  title?: string;
}

export default function ShareLinkDialog({
  open,
  onOpenChange,
  shortUrl,
  title,
}: ShareLinkDialogProps) {
  const safeShortUrl = `${process.env.NEXT_PUBLIC_API_URL}/${shortUrl}`;
  function handleCopyLink() {
    navigator.clipboard.writeText(safeShortUrl);
    toast.success("Link copiado para a área de transferência.");
  }

  async function handleCopyQr() {
    const svg = document.getElementById("qr-code") as SVGSVGElement | null;
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);

    const encoded = new TextEncoder().encode(svgStr);
    const base64 = btoa(String.fromCharCode(...encoded));

    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);

        toast.success("QRCode copiado para a área de transferência.");
      });
    };

    img.src = `data:image/svg+xml;base64,${base64}`;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartilhar link</DialogTitle>
          <DialogDescription>
            {title || `Use o QRCode ou copie o link para compartilhar`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="rounded-lg border bg-white p-4">
            {safeShortUrl && (
              <QRCode
                key={safeShortUrl}
                id="qr-code"
                value={safeShortUrl}
                size={180}
              />
            )}
          </div>

          <span className="text-muted-foreground text-center text-sm break-all">
            {safeShortUrl}
          </span>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleCopyLink}>
            <RiFileCopyLine className="mr-2 h-4 w-4" />
            Copiar link
          </Button>

          <Button onClick={handleCopyQr}>
            <RiQrCodeLine className="mr-2 h-4 w-4" />
            Copiar QR
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
