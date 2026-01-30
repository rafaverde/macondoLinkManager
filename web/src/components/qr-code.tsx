import QRCodeLib from "react-qr-code";
import React from "react";

interface QRCodeProps {
  value: string;
  size?: number;
  id?: string;
}

export function QRCode({ value, size = 180, id }: QRCodeProps) {
  return React.createElement(QRCodeLib as any, {
    value,
    size,
    id,
  });
}
