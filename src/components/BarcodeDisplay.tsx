import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeDisplayProps {
  value: string;
}

export function BarcodeDisplay({ value }: BarcodeDisplayProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !value) return;
    try {
      JsBarcode(svgRef.current, value, {
        format: 'CODE128',
        lineColor: '#000000',
        background: '#ffffff',
        width: 3,
        height: 140,
        displayValue: true,
        fontSize: 20,
        margin: 10,
      });
    } catch {
      // Value has characters CODE128 can't encode; leave the barcode blank.
    }
  }, [value]);

  return <svg ref={svgRef} className="barcode-svg" />;
}
