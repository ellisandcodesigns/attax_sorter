// hooks/CollectionContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { FlatCard } from "@/lib/types/cards";
import { useUser } from "./use-user";

interface CollectionContextType {
  allCards: FlatCard[];
  ownedCards: Record<string, number>;
  // ⚡ New Dashboard Live Stats
  ownedCount: number;      // Total unique cards owned (e.g., 45)
  totalCards: number;      // Total cards in the entire card set database (e.g., 500)
  completion: number;      // Calculated completion percentage integer (e.g., 9)
  duplicateCount: number;
  hasCard: (uid: string) => boolean;
  getCardCount: (uid: string) => number;
  getDuplicateCount: (uid: string) => number;
  addCard: (uid: string) => Promise<void>;
  removeCard: (uid: string) => Promise<void>;      
  removeAllCards: (uid: string) => Promise<void>;  
  loading: boolean;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function CollectionProvider({ 
  children, 
  initialStaticCards 
}: { 
  children: React.ReactNode; 
  initialStaticCards: FlatCard[]; 
}) {

  
  const supabase = createClient();
  const { user, loading: authLoading } = useUser();
  const [collectionMap, setCollectionMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    async function loadCollection() {
      if (authLoading) return; // Wait until auth state resolves
      if (!user) {
        setCollectionMap({}); // Reset if signed out
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

  // 📊 Live Dynamic Calculation Metrics
  const stats = useMemo(() => {
    const total = Array.isArray(initialStaticCards) ? initialStaticCards.length : 0;

      // ⚡ Calculate all duplicate items combined across the collection
    const totalDuplicates = Object.values(collectionMap).reduce((acc, quantity) => {
      return acc + (quantity > 1 ? quantity - 1 : 0);
    }, 0);
      
    // Count how many keys in collectionMap actually have a quantity greater than 0
    const owned = Object.values(collectionMap).filter((quantity) => quantity > 0).length;
    
    // Calculate integer percentage safely
    const percentage = total > 0 ? Math.round((owned / total) * 100) : 0;

    return {
      ownedCount: owned,
      totalCards: total,
      completion: percentage,
      totalDuplicates: totalDuplicates
    };
  }, [initialStaticCards, collectionMap]);

  const hasCard = (uid: string) => (collectionMap[uid] ?? 0) > 0;
  const getCardCount = (uid: string) => collectionMap[uid] ?? 0;
  const getDuplicateCount = (uid: string) => {
  const total = collectionMap[uid] ?? 0;
  return total > 1 ? total - 1 : 0; // ⚡ Returns 0 if they have 1 or 0 cards
};

  // ➕ Add Card / Increase Duplicate Count
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

  // ➖ Remove Card / Decrease Count
  const removeCard = async (uid: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const currentCount = collectionMap[uid] ?? 0;
    if (currentCount <= 0) return;

    const newCount = currentCount - 1;

    setCollectionMap((prev) => {
      const copy = { ...prev };
      if (newCount === 0) {
        delete copy[uid];
      } else {
        copy[uid] = newCount;
      }
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
    const { data: { user } } = await supabase.auth.getUser();
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

  return (
    <CollectionContext.Provider value={{ 
      allCards: initialStaticCards, 
      ownedCards: collectionMap,
      ownedCount: stats.ownedCount,   // ✨ Provided
      totalCards: stats.totalCards,   // ✨ Provided
      completion: stats.completion,   // ✨ Provided
      duplicateCount: stats.totalDuplicates,
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

export function useCollection() {
  const context = useContext(CollectionContext);
  if (!context) throw new Error("useCollection must be nested inside a CollectionProvider");
  return context;
}
