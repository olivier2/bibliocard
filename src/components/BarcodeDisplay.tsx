import { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import { useBarcodeFormat } from '../hooks/useBarcodeFormat';

interface BarcodeDisplayProps {
  value: string;
  mask?: boolean;
}

export function BarcodeDisplay({ value, mask = false }: BarcodeDisplayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { format } = useBarcodeFormat();
  const [error, setError] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const showRealText = !mask || revealed;

  useEffect(() => {
    if (!svgRef.current || !value) return;
    try {
      JsBarcode(svgRef.current, value, {
        format,
        text: showRealText ? value : '*'.repeat(value.length),
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
  }, [value, format, showRealText]);

  return (
    <>
      <svg
        ref={svgRef}
        className="barcode-svg"
        style={{ display: error ? 'none' : undefined, touchAction: 'manipulation' }}
        onPointerDown={mask ? () => setRevealed(true) : undefined}
        onPointerUp={mask ? () => setRevealed(false) : undefined}
        onPointerLeave={mask ? () => setRevealed(false) : undefined}
        onPointerCancel={mask ? () => setRevealed(false) : undefined}
        onContextMenu={mask ? (e) => e.preventDefault() : undefined}
      />
      {error && <p className="barcode-error">Can't render this value as {format}.</p>}
      {mask && !error && <p className="barcode-mask-hint">Press and hold to reveal</p>}
    </>
  );
}
