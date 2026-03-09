"use client";

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
  RiLoader4Line,
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
import { useState } from "react";
import { toast } from "sonner";
import { link } from "fs";

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
  const [isCopyingQr, setIsCopyingQr] = useState(false);
  const [isDownloadingQr, setIsDowloadingQr] = useState(false);

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

        <DialogFooter className="flex flex-row flex-wrap justify-center! gap-2">
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

          <Button
            variant="outline"
            disabled={isCopyingQr}
            onClick={async () => {
              try {
                setIsCopyingQr(true);
                handleCopyQr();
              } finally {
                setTimeout(() => {
                  setIsCopyingQr(false);
                  toast.success("QRCode copiado para a área de transferência.");
                }, 500);
              }
            }}
            className="min-w-[135px]"
          >
            {isCopyingQr ? (
              <>
                <RiLoader4Line className="animate-spin" />
                Copiando
              </>
            ) : (
              <>
                <RiQrCodeLine className="mr-2 h-4 w-4" />
                Copiar PNG
              </>
            )}
          </Button>

          <Button
            onClick={async () => {
              try {
                setIsDowloadingQr(true);
                handleDownloadQrSvg(shortUrl);
              } finally {
                setTimeout(() => {
                  setIsDowloadingQr(false);
                }, 500);
              }
            }}
            disabled={isDownloadingQr}
            className="min-w-[130px]"
          >
            {isDownloadingQr ? (
              <>
                <RiLoader4Line className="animate-spin" />
                Baixando
              </>
            ) : (
              <>
                <RiDownloadLine className="mr-2 h-4 w-4" />
                Baixar SVG
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
