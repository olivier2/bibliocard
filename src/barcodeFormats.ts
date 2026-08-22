// Every barcode format JsBarcode can render, excluding GenericBarcode (a
// placeholder that ignores the input data entirely, so it can't actually
// encode a card number or password).
export const BARCODE_FORMATS = [
  { value: 'CODE128', label: 'Code 128' },
  { value: 'CODE128A', label: 'Code 128 A' },
  { value: 'CODE128B', label: 'Code 128 B' },
  { value: 'CODE128C', label: 'Code 128 C' },
  { value: 'CODE39', label: 'Code 39' },
  { value: 'CODE93', label: 'Code 93' },
  { value: 'CODE93FullASCII', label: 'Code 93 (Full ASCII)' },
  { value: 'EAN13', label: 'EAN-13' },
  { value: 'EAN8', label: 'EAN-8' },
  { value: 'EAN5', label: 'EAN-5' },
  { value: 'EAN2', label: 'EAN-2' },
  { value: 'UPC', label: 'UPC-A' },
  { value: 'UPCE', label: 'UPC-E' },
  { value: 'ITF', label: 'ITF' },
  { value: 'ITF14', label: 'ITF-14' },
  { value: 'MSI', label: 'MSI' },
  { value: 'MSI10', label: 'MSI (Mod 10)' },
  { value: 'MSI11', label: 'MSI (Mod 11)' },
  { value: 'MSI1010', label: 'MSI (Mod 1010)' },
  { value: 'MSI1110', label: 'MSI (Mod 1110)' },
  { value: 'pharmacode', label: 'Pharmacode' },
  { value: 'codabar', label: 'Codabar' },
] as const;

export type BarcodeFormatValue = (typeof BARCODE_FORMATS)[number]['value'];

export const DEFAULT_BARCODE_FORMAT: BarcodeFormatValue = 'CODE128';

export function isBarcodeFormatValue(value: string): value is BarcodeFormatValue {
  return BARCODE_FORMATS.some((f) => f.value === value);
}
