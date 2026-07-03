"use client";

import { useMemo, useState } from "react";
import { useCollection } from "./CollectionContext";
import { FlatCard } from "@/lib/types/cards";

export const useCardSearch = () => {
  const { allCards } = useCollection();

  const [query, setQuery] = useState("");
  const [clubFilter, setClubFilter] = useState<string | null>(null);
  const [collectionFilter, setCollectionFilter] = useState<string | null>(null);

  const filteredCards: FlatCard[] = useMemo(() => {
    let cards = allCards;

    // 1. CLUB FILTER
    if (clubFilter) {
      cards = cards.filter((c) => c.club === clubFilter);
    }

    // 2. COLLECTION FILTER
    if (collectionFilter) {
      cards = cards.filter((c) => c.subset === collectionFilter);
    }

    // 3. SEARCH FILTER (fast string match)
    if (query.trim()) {
      const q = query.toLowerCase();

      cards = cards.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.card_number.toLowerCase().includes(q) ||
        c.club.toLowerCase().includes(q) 
      );
    }

    return cards;
  }, [allCards, query, clubFilter, collectionFilter]);

  // OPTIONAL: lookup by card uid
  const getCard = (uid: string): FlatCard | undefined =>
    allCards.find((card) => card.uid === uid);

  return {
    query,
    setQuery,

    clubFilter,
    setClubFilter,

    collectionFilter,
    setCollectionFilter,

    filteredCards,
    getCard,
  };
};