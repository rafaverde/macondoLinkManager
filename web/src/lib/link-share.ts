import { toast } from "sonner";

export function handleCopyLink(shortUrl: string) {
  navigator.clipboard.writeText(shortUrl);
  toast.success("Link copiado para a área de transferência.");
}

export function handleShareWhatsapp(shortUrl: string) {
  window.open(`https://wa.me/?text=${shortUrl}`, "_blank");
}

export async function handleCopyQr() {
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

export function handleShareEmail(shortUrl: string) {
  const subject = encodeURIComponent("Link compartilhado");
  const body = encodeURIComponent(`${"Link compartilhado"}\n\n${shortUrl}`);

  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

export function handleDownloadQrSvg() {
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
