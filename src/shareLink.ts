import type { LibraryCard } from './types';

export function buildShareUrl(memberName: string, card: LibraryCard): string {
  const params = new URLSearchParams({
    member: memberName,
    library: card.libraryName,
    cardNumber: card.cardNumber,
    password: card.password,
  });
  return `${window.location.origin}${import.meta.env.BASE_URL}#/shared-card?${params.toString()}`;
}

// Returns the in-app path (e.g. "/shared-card?...") to navigate to for a
// scanned BiblioCard share link, or null if the text isn't one.
export function parseShareUrl(scanned: string): string | null {
  let url: URL;
  try {
    url = new URL(scanned);
  } catch {
    return null;
  }
  if (!url.hash.startsWith('#/shared-card')) return null;
  return url.hash.slice(1);
}
