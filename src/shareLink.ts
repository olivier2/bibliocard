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
