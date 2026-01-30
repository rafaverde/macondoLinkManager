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
import {
  RiDownloadLine,
  RiFileCopyLine,
  RiMailSendLine,
  RiQrCodeLine,
  RiWhatsappLine,
} from "@remixicon/react";
import { Button } from "./ui/button";
import { QRCode } from "./qr-code";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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

  function handleShareWhatsapp() {
    window.open(`https://wa.me/?text=${safeShortUrl}`, "_blank");
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

  function handleShareEmail() {
    const subject = encodeURIComponent(title ?? "Link compartilhado");
    const body = encodeURIComponent(
      `${title ?? "Link compartilhado"}\n\n${shortUrl}`,
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  function handleDownloadQrSvg() {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);

    const blob = new Blob([svgStr], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
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

        <DialogFooter className="flex flex-row justify-center! gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline" onClick={handleCopyLink}>
                <RiFileCopyLine />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copiar link</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={handleShareWhatsapp}
              >
                <RiWhatsappLine />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enviar no WhatsApp</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline" onClick={handleShareEmail}>
                <RiMailSendLine />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enviar por Email</p>
            </TooltipContent>
          </Tooltip>

          <Button variant="outline" onClick={handleCopyQr}>
            <RiQrCodeLine className="mr-2 h-4 w-4" />
            Copiar PNG
          </Button>

          <Button onClick={handleDownloadQrSvg}>
            <RiDownloadLine className="mr-2 h-4 w-4" />
            Baixar SVG
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
