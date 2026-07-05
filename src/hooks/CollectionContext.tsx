// hooks/CollectionContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { FlatCard, CardIndex } from "@/lib/types/cards";
import { useUser } from "./use-user";
import { flattenCollection } from "@/lib/utils/flattenCards"; 

// Import raw data files directly into context
import MatchAttax25_26 from "@/lib/data/matchAttax25-26.json";
import MatchAttax25_26Extras from "@/lib/data/matchAttax25-26Extra.json";

// 1. Static file dictionary map definition
const COLLECTION_DATA_MAP: Record<string, any> = {
  "match-attax-25-26": MatchAttax25_26,
  "match-attax-25-26-extra": MatchAttax25_26Extras,
};


// 2. Embedded helper builder
const buildCardIndex = (collectionId: string): CardIndex => {
  const rawData = COLLECTION_DATA_MAP[collectionId];
  const allCards = flattenCollection(rawData);
  const index: CardIndex = {};

  allCards.forEach((card) => {
    index[card.uid] = card;
  });
  return index;
};

interface CollectionStats {
  ownedUniqueCount: number;
  totalCards: number;
  completion: number;
  duplicateCount: number;
}

interface CollectionContextProps {
  activeCollectionId: string | null;
  setActiveCollectionId: (id: string | null) => void;
  exportCollectionText: (type: "owned" | "duplicates") => string;
  exportGroupedCollectionText: (type: "owned" | "duplicates") => string;
  
  // Dynamic metrics for the active collection view
  ownedUniqueCount: number;
  totalCards: number;
  completion: number;
  duplicateCount: number;
  currentCollectionCards: FlatCard[];
  ownedCardList: FlatCard[];

  // Global / Dashboard utility data structures
  allCards: FlatCard[]; 
  ownedCards: Record<string, number>;
  loading: boolean;

  // Collection metadata helper function
  getCollectionStats: (collectionId: string) => CollectionStats;

  // Single card modifier functions
  hasCard: (uid: string) => boolean;
  getCardCount: (uid: string) => number;
  getDuplicateCount: (uid: string) => number;
  addCard: (uid: string) => Promise<void>;
  removeCard: (uid: string) => Promise<void>;      
  removeAllCards: (uid: string) => Promise<void>;  
}

const CollectionContext = createContext<CollectionContextProps | undefined>(undefined);

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { user, loading: authLoading } = useUser();
  
  const [collectionMap, setCollectionMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);

  // 1. Flatten files dynamically inside context structure
  const allCollectionsData = useMemo(() => ({
    "match-attax-25-26": flattenCollection(MatchAttax25_26),
    "match-attax-25-26-extra": flattenCollection(MatchAttax25_26Extras),
  }), []);

  // 2. Global unified array containing all available cards across all datasets
  const allCards = useMemo(() => {
    return Object.values(allCollectionsData).flat();
  }, [allCollectionsData]);

  // 3. Extract the active single view card array
  const currentCollectionCards = useMemo(() => {
    if (!activeCollectionId) return [];
    return allCollectionsData[activeCollectionId as keyof typeof allCollectionsData] || [];
  }, [activeCollectionId, allCollectionsData]);

  // 4. Custom calculation logic mapping for cards inside specific dataset structures
  const getCollectionStats = useMemo(() => {
    return (collectionId: string): CollectionStats => {
      const cards = allCollectionsData[collectionId as keyof typeof allCollectionsData] || [];
      const totalCards = cards.length;
      
      let ownedUniqueCount = 0;
      let duplicateCount = 0;

      cards.forEach(card => {
        const qty = collectionMap[card.uid] ?? 0;
        if (qty > 0) {
          ownedUniqueCount++;
          duplicateCount += (qty - 1);
        }
      });

      const completion = totalCards > 0 ? Math.round((ownedUniqueCount / totalCards) * 100) : 0;
      return { ownedUniqueCount, totalCards, completion, duplicateCount };
    };
  }, [allCollectionsData, collectionMap]);

  // 5. Compute real-time values for active view context mappings
  const activeStats = useMemo(() => {
    if (!activeCollectionId) {
      // Return global stats combining all files when on the home dashboard view
      const totalCards = allCards.length;
      const ownedUniqueCount = allCards.filter(card => (collectionMap[card.uid] ?? 0) > 0).length;
      const duplicateCount = Object.values(collectionMap).reduce((acc, qty) => acc + (qty > 1 ? qty - 1 : 0), 0);
      const completion = totalCards > 0 ? Math.round((ownedUniqueCount / totalCards) * 100) : 0;
      return { ownedUniqueCount, totalCards, completion, duplicateCount };
    }
    return getCollectionStats(activeCollectionId);
  }, [activeCollectionId, allCards, collectionMap, getCollectionStats]);

  // 7. Sync collection mapping directly from Supabase
  useEffect(() => {
    async function loadCollection() {
      if (authLoading) return;
      if (!user) {
        setCollectionMap({});
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("user_cards")
        .select("card_uid, quantity");

      if (error) {
        console.error("Error loading collection maps:", error.message);
      } else if (data) {
        const mappedData = data.reduce((acc, current) => {
          acc[current.card_uid] = current.quantity;
          return acc;
        }, {} as Record<string, number>);
        
        setCollectionMap(mappedData);
      }
      setLoading(false);
    }

    loadCollection();
  }, [user, authLoading]);
  
  const collectionsIndexes = useMemo(() => {
    return {
      "match-attax-25-26": buildCardIndex("match-attax-25-26"),
      "match-attax-25-26-extra": buildCardIndex("match-attax-25-26-extra"),
    };
  }, []);

  // ⚡ REFACTOR: Fast user card translation lists using the index lookups
  const ownedCardList = useMemo(() => {
    const targetId = activeCollectionId || "match-attax-25-26"; // Fallback to a default if home
    const activeIndex = collectionsIndexes[targetId as keyof typeof collectionsIndexes] || {};
    
    // Look up card details instantly via their database uid key map records
    return Object.keys(collectionMap)
      .filter((uid) => collectionMap[uid] > 0 && activeIndex[uid])
      .map((uid) => activeIndex[uid]);
  }, [activeCollectionId, collectionMap, collectionsIndexes]);

  // 8. Individual Card Item State Checks
  const hasCard = (uid: string) => (collectionMap[uid] ?? 0) > 0;
  const getCardCount = (uid: string) => collectionMap[uid] ?? 0;
  const getDuplicateCount = (uid: string) => Math.max(0, (collectionMap[uid] ?? 0) - 1);

  // ➕ Add Card 
  const addCard = async (uid: string) => {
    if (!user) return alert("Please sign in to save cards!");
    const currentCount = collectionMap[uid] ?? 0;
    const newCount = currentCount + 1;

    setCollectionMap((prev) => ({ ...prev, [uid]: newCount }));

    const { error } = await supabase
      .from("user_cards")
      .upsert(
        { user_id: user.id, card_uid: uid, quantity: newCount },
        { onConflict: "user_id,card_uid" }
      );

    if (error) {
      console.error("Database save failed:", error.message);
      setCollectionMap((prev) => ({ ...prev, [uid]: currentCount }));
    }
  };

  // ➖ Remove Card
  const removeCard = async (uid: string) => {
    if (!user) return;
    const currentCount = collectionMap[uid] ?? 0;
    if (currentCount <= 0) return;
    const newCount = currentCount - 1;

    setCollectionMap((prev) => {
      const copy = { ...prev };
      if (newCount === 0) delete copy[uid];
      else copy[uid] = newCount;
      return copy;
    });

    if (newCount === 0) {
      const { error } = await supabase
        .from("user_cards")
        .delete()
        .match({ user_id: user.id, card_uid: uid });

      if (error) {
        console.error("Delete failed:", error.message);
        setCollectionMap((prev) => ({ ...prev, [uid]: currentCount }));
      }
    } else {
      const { error } = await supabase
        .from("user_cards")
        .update({ quantity: newCount })
        .match({ user_id: user.id, card_uid: uid });

      if (error) {
        console.error("Decrease failed:", error.message);
        setCollectionMap((prev) => ({ ...prev, [uid]: currentCount }));
      }
    }
  };

  // 🗑️ Remove All Duplicates
  const removeAllCards = async (uid: string) => {
    if (!user) return;
    const currentCount = collectionMap[uid] ?? 0;
    if (currentCount === 0) return;

    setCollectionMap((prev) => {
      const copy = { ...prev };
      delete copy[uid];
      return copy;
    });

    const { error } = await supabase
      .from("user_cards")
      .delete()
      .match({ user_id: user.id, card_uid: uid });

    if (error) {
      console.error("Wipe failed:", error.message);
      setCollectionMap((prev) => ({ ...prev, [uid]: currentCount }));
    }
  };

  const exportCollectionText = (type: "owned" | "duplicates"): string => {
  // Use current view cards, or fallback to all global cards if no active ID
  const targetCards = activeCollectionId ? currentCollectionCards : allCards;

  return targetCards
    .map((card) => {
      const quantity = collectionMap[card.uid] ?? 0;
      
      if (type === "owned" && quantity > 0) {
        // e.g., "Card #42 (x2)"
        return `Card #${card.card_number || card.uid} (x${quantity})`;
      } 
      
      if (type === "duplicates" && quantity > 1) {
        // e.g., "Card #104 (x1 duplicate)"
        return `Card #${card.card_number || card.uid} (x${quantity - 1})`;
      }
      
      return null;
    })
    .filter(Boolean) // Filter out null lines
    .join("\n");
};

const exportGroupedCollectionText = (type: "owned" | "duplicates"): string => {
  // 1. Gather the cards in focus
  const targetCards = activeCollectionId ? currentCollectionCards : allCards;

  // 2. Build a structural nested tree: Group -> SubGroup -> Cards[]
  // Adjust 'card.category' and 'card.team' keys to match your exact JSON properties
  const structuralTree: Record<string, Record<string, FlatCard[]>> = {};

  targetCards.forEach((card) => {
    const quantity = collectionMap[card.uid] ?? 0;
    
    // Filter conditions based on requested export style
    if (type === "owned" && quantity === 0) return;
    if (type === "duplicates" && quantity <= 1) return;

    // Fallback labels if fields are missing in data records
    const mainGroup = card.subset || "Base Cards";
    const subGroup = card.group || card.club || "General";

    if (!structuralTree[mainGroup]) {
      structuralTree[mainGroup] = {};
    }
    if (!structuralTree[mainGroup][subGroup]) {
      structuralTree[mainGroup][subGroup] = [];
    }

    structuralTree[mainGroup][subGroup].push(card);
  });

  // 3. Compile the structural tree into a beautifully spaced string layout
  const textLines: string[] = [];

  Object.entries(structuralTree).forEach(([mainGroup, subGroups]) => {
    textLines.push(`=== ${mainGroup.toUpperCase()} ===`);

    Object.entries(subGroups).forEach(([subGroup, cards]) => {
      textLines.push(`  [ ${subGroup} ]`);

      cards.forEach((card) => {
        const qty = collectionMap[card.uid] ?? 0;
        const displayQty = type === "owned" ? qty : qty - 1;
        const cardNameStr = card.name ? ` - ${card.name}` : "";
        const cardNum = card.card_number || card.uid;

        textLines.push(`    • Card #${cardNum}${cardNameStr} (x${displayQty})`);
      });
      textLines.push(""); // Spacer line after each subgroup
    });
  });

  return textLines.join("\n").trim();
};

// Pass exportGroupedCollectionText down through your context provider value wrapper


  

  return (
   <CollectionContext.Provider value={{ 
      activeCollectionId,
      setActiveCollectionId,
      allCards, 
      ownedCards: collectionMap,
      ownedUniqueCount: activeStats.ownedUniqueCount,   
      totalCards: activeStats.totalCards,   
      completion: activeStats.completion,   
      duplicateCount: activeStats.duplicateCount,
      currentCollectionCards,
      ownedCardList,
      exportCollectionText,
      exportGroupedCollectionText,
      getCollectionStats,
      getDuplicateCount,
      hasCard, 
      getCardCount, 
      addCard, 
      removeCard,
      removeAllCards,
      loading
    }}>
      {children}
    </CollectionContext.Provider>
  );
}

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) throw new Error("useCollection must be used within a CollectionProvider");
  return context;
};
