import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType, NotFoundException } from '@zxing/library';

interface BarcodeScannerProps {
  onDetected: (text: string) => void;
  onCancel: () => void;
}

export function BarcodeScanner({ onDetected, onCancel }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.ITF,
      BarcodeFormat.UPC_A,
    ]);
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
