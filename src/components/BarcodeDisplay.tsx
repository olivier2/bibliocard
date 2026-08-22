import { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import { useBarcodeFormat } from '../hooks/useBarcodeFormat';

interface BarcodeDisplayProps {
  value: string;
}

export function BarcodeDisplay({ value }: BarcodeDisplayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { format } = useBarcodeFormat();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!svgRef.current || !value) return;
    try {
      JsBarcode(svgRef.current, value, {
        format,
        lineColor: '#000000',
        background: '#ffffff',
        width: 3,
        height: 140,
        displayValue: true,
        fontSize: 20,
        margin: 10,
      });
      setError(false);
    } catch {
      setError(true);
    }
  }, [value, format]);

  return (
    <>
      <svg ref={svgRef} className="barcode-svg" style={{ display: error ? 'none' : undefined }} />
      {error && <p className="barcode-error">Can't render this value as {format}.</p>}
    </>
  );
}
