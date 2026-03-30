import QRCodeLib from "react-qr-code";

interface QRCodeProps {
  value: string;
  size?: number;
  id?: string;
}

export function QRCode({ value, size = 180, id }: QRCodeProps) {
  return <QRCodeLib value={value} size={size} id={id} />;
}
