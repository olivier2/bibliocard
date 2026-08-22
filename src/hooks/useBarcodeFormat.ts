import { createContext, useContext, useEffect, useState } from 'react';
import type { BarcodeFormatValue } from '../barcodeFormats';
import { loadBarcodeFormat, saveBarcodeFormat } from '../storage';

export interface BarcodeFormatApi {
  format: BarcodeFormatValue;
  setFormat: (format: BarcodeFormatValue) => void;
}

export function useBarcodeFormatState(): BarcodeFormatApi {
  const [format, setFormat] = useState<BarcodeFormatValue>(() => loadBarcodeFormat());

  useEffect(() => {
    saveBarcodeFormat(format);
  }, [format]);

  return { format, setFormat };
}

export const BarcodeFormatContext = createContext<BarcodeFormatApi | null>(null);

export function useBarcodeFormat(): BarcodeFormatApi {
  const ctx = useContext(BarcodeFormatContext);
  if (!ctx) throw new Error('useBarcodeFormat must be used within BarcodeFormatContext.Provider');
  return ctx;
}
