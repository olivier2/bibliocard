import { useEffect, useRef } from 'react';
import qrcode from 'qrcode-generator';

interface QrCodeDisplayProps {
  value: string;
}

export function QrCodeDisplay({ value }: QrCodeDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const qr = qrcode(0, 'M');
    qr.addData(value);
    qr.make();
    containerRef.current.innerHTML = qr.createSvgTag({ scalable: true });
  }, [value]);

  return <div ref={containerRef} className="qr-code" />;
}
