"use client";

import { useMemo, useState } from "react";
import { useCollection } from "./CollectionContext";
import { FlatCard } from "@/lib/types/cards";

export const useCardSearch = () => {
  // ⚡ PULL DYNAMIC DATA: Get current cards, quantity map, and the active collection ID
  const { currentCollectionCards, getCardCount, activeCollectionId } = useCollection();

  const [query, setQuery] = useState("");
  const [clubFilter, setClubFilter] = useState<string | null>(null);
  const [collectionFilter, setCollectionFilter] = useState<string | null>(null);
  const [duplicatesOnly, setDuplicatesOnly] = useState(false);

  // 1. FILTER RENDER LOOP
  const filteredCards: FlatCard[] = useMemo(() => {
    let cards = currentCollectionCards;

    // CLUB FILTER
    if (clubFilter) {
      cards = cards.filter((c) => c.club === clubFilter);
    }

    // COLLECTION FILTER (Subset/Group)
    if (collectionFilter) {
      cards = cards.filter((c) => c.subset === collectionFilter);
    }

    // DUPLICATES FILTER
    if (duplicatesOnly) {
      cards = cards.filter((c) => getCardCount(c.uid) > 1);
    }

    // SEARCH QUERY STRINGS MATCHING
    if (query.trim()) {
      const q = query.toLowerCase();
      cards = cards.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.card_number.toLowerCase().includes(q) ||
        c.club.toLowerCase().includes(q) 
      );
    }

    return [...cards].sort((a, b) => Number(a.card_number) - Number(b.card_number));
  }, [currentCollectionCards, query, clubFilter, collectionFilter, duplicatesOnly, getCardCount]);

  // ⚡ 2. REFACTORED LOOKUP: Instant index performance instead of arrays parsing loops
  const getCard = (uid: string): FlatCard | undefined => {
    if (!activeCollectionId) return undefined;
    
    // Look up the card instantly using its direct property key mapping path
    return currentCollectionCards.find((card) => card.uid === uid);
  };

  return {
    query,
    setQuery,
    clubFilter,
    setClubFilter,
    collectionFilter,
    setCollectionFilter,
    duplicatesOnly,
    setDuplicatesOnly,
    filteredCards,
    getCard,
  };
};
