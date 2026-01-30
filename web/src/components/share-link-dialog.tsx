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
import {
  handleCopyLink,
  handleCopyQr,
  handleDownloadQrSvg,
  handleShareEmail,
  handleShareWhatsapp,
} from "@/lib/link-share";

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
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopyLink(safeShortUrl)}
              >
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
                onClick={() => handleShareWhatsapp(safeShortUrl)}
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
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleShareEmail(safeShortUrl)}
              >
                <RiMailSendLine />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enviar por Email</p>
            </TooltipContent>
          </Tooltip>

          <Button variant="outline" onClick={() => handleCopyQr()}>
            <RiQrCodeLine className="mr-2 h-4 w-4" />
            Copiar PNG
          </Button>

          <Button onClick={() => handleDownloadQrSvg()}>
            <RiDownloadLine className="mr-2 h-4 w-4" />
            Baixar SVG
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
