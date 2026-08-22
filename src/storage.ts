import type { FamilyMember } from './types';
import { DEFAULT_BARCODE_FORMAT, isBarcodeFormatValue, type BarcodeFormatValue } from './barcodeFormats';

const STORAGE_KEY = 'bibliocard.members';
const BARCODE_FORMAT_STORAGE_KEY = 'bibliocard.barcodeFormat';

export function loadMembers(): FamilyMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMembers(members: FamilyMember[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

export function loadBarcodeFormat(): BarcodeFormatValue {
  const raw = localStorage.getItem(BARCODE_FORMAT_STORAGE_KEY);
  return raw && isBarcodeFormatValue(raw) ? raw : DEFAULT_BARCODE_FORMAT;
}

export function saveBarcodeFormat(format: BarcodeFormatValue): void {
  localStorage.setItem(BARCODE_FORMAT_STORAGE_KEY, format);
}
