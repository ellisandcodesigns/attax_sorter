import { flattenCollection } from "@/lib/utils/flattenCards";
import { CardIndex } from "@/lib/types/cards";

// Import your raw JSON data sources directly
import MatchAttax25_26 from "@/lib/data/matchAttax25-26.json";
import MatchAttax25_26Extras from "@/lib/data/matchAttax25-26Extra.json";

// Map IDs to their corresponding data files
const COLLECTION_DATA_MAP: Record<string, any> = {
  "match-attax-25-26": MatchAttax25_26,
  "match-attax-25-26-extra": MatchAttax25_26Extras,
};

export const buildCardIndex = (collectionId: string): CardIndex => {
  // ⚡ FIX: Fetch the correct JSON data object based on the ID string
  const rawData = COLLECTION_DATA_MAP[collectionId];
  
  // Flatten the data safely (falls back to [] if dataset doesn't exist)
  const allCards = flattenCollection(rawData);

  const index: CardIndex = {};

  allCards.forEach((card) => {
    index[card.uid] = card;
  });

  return index;
};
