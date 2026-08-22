import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType, NotFoundException } from '@zxing/library';

interface BarcodeScannerProps {
  onDetected: (text: string) => void;
  onCancel: () => void;
}

// All 1D/linear formats @zxing/library can decode - library cards are read by
// laser barcode scanners, which only ever read linear barcodes, so 2D formats
// (QR, Data Matrix, Aztec, PDF417, MaxiCode) are intentionally left out here.
// Listing formats explicitly (rather than omitting POSSIBLE_FORMATS) matters:
// without hints, MultiFormatReader falls back to its own default reader set,
// which silently excludes Codabar (still common on older library cards) in
// this library version. Mixing in the 2D readers alongside TRY_HARDER also
// triggers a real bug in @zxing/browser's rotate-fallback path that throws
// instead of reporting "not found", so 1D-only avoids that too.
const LINEAR_FORMATS = [
  BarcodeFormat.CODABAR,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODE_93,
  BarcodeFormat.CODE_128,
  BarcodeFormat.EAN_8,
  BarcodeFormat.EAN_13,
  BarcodeFormat.ITF,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
];

export function BarcodeScanner({ onDetected, onCancel }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, LINEAR_FORMATS);
    hints.set(DecodeHintType.TRY_HARDER, true);
    const reader = new BrowserMultiFormatReader(hints);
    let controls: { stop: () => void } | undefined;
    let cancelled = false;

    reader
      .decodeFromConstraints(
        { video: { facingMode: 'environment' } },
        videoRef.current ?? undefined,
        (result, err) => {
          if (result) {
            onDetected(result.getText());
          } else if (err && !(err instanceof NotFoundException)) {
            // Transient per-frame decode errors are expected and ignored.
          }
        },
      )
      .then((c) => {
        if (cancelled) {
          c.stop();
        } else {
          controls = c;
        }
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error
            ? `Couldn't access the camera: ${e.message}`
            : "Couldn't access the camera.",
        );
      });

    return () => {
      cancelled = true;
      controls?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="scanner">
      <video ref={videoRef} className="scanner-video" muted playsInline />
      <div className="scanner-frame" />
      {error && <p className="scanner-error">{error}</p>}
      <button type="button" className="btn-secondary" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
