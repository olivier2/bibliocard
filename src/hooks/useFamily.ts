import { createContext, useContext, useEffect, useState } from 'react';
import type { FamilyMember, LibraryCard } from '../types';
import { loadMembers, saveMembers } from '../storage';

export interface FamilyApi {
  members: FamilyMember[];
  addMember: (name: string) => void;
  removeMember: (memberId: string) => void;
  addCard: (memberId: string, card: Omit<LibraryCard, 'id'>) => void;
  removeCard: (memberId: string, cardId: string) => void;
  getMember: (memberId: string) => FamilyMember | undefined;
  getCard: (memberId: string, cardId: string) => LibraryCard | undefined;
}

export function useFamilyState(): FamilyApi {
  const [members, setMembers] = useState<FamilyMember[]>(() => loadMembers());

  useEffect(() => {
    saveMembers(members);
  }, [members]);

  function addMember(name: string) {
    const member: FamilyMember = { id: crypto.randomUUID(), name, cards: [] };
    setMembers((prev) => [...prev, member]);
  }

  function removeMember(memberId: string) {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }

  function addCard(memberId: string, card: Omit<LibraryCard, 'id'>) {
    const newCard: LibraryCard = { ...card, id: crypto.randomUUID() };
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, cards: [...m.cards, newCard] } : m)),
    );
  }

  function removeCard(memberId: string, cardId: string) {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, cards: m.cards.filter((c) => c.id !== cardId) } : m,
      ),
    );
  }

  function getMember(memberId: string) {
    return members.find((m) => m.id === memberId);
  }

  function getCard(memberId: string, cardId: string) {
    return getMember(memberId)?.cards.find((c) => c.id === cardId);
  }

  return { members, addMember, removeMember, addCard, removeCard, getMember, getCard };
}

export const FamilyContext = createContext<FamilyApi | null>(null);

export function useFamily(): FamilyApi {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error('useFamily must be used within FamilyContext.Provider');
  return ctx;
}
