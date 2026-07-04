
export interface Card {
  id: number;
  name: string;
  card_number: string | number;
}

export interface Groups {
  group_name: string | undefined;
  logo: string;
  subset: string;
  cards: Card[]; // MUST NOT be optional
}

export interface SetData {
  Collections: Groups[];
}

export interface Collections {
  name: string, 
  id: number,
  collection: string | null
}

export type CollectionsMap = Groups[];

export interface FlatCard {
  uid: string;

  id: number;
  name: string;

  card_number: string;

  club: string;
  clubLogo: string;

  group: string | undefined;

  subset: string;

  isSpecial: boolean;

  collectionId: string;
}

type CardStatus = "owned" | "missing";

export const getCardStatus = (
  uid: string,
  ownedCards: Record<string, number>
): CardStatus => {
 return ownedCards[uid] ? "owned" : "missing";
};

export type CardIndex = Record<string, FlatCard>;

export type collectionIndex = Record<string, Collections>;

