import type { FamilyMember } from './types';

const STORAGE_KEY = 'bibliocard.members';

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
