export interface LibraryCard {
  id: string;
  libraryName: string;
  cardNumber: string;
  password: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  cards: LibraryCard[];
}
