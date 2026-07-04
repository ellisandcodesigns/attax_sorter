"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useCollection } from "@/hooks/CollectionContext";
import CardTile from "./CardTile";
import { useCardSearch } from "@/hooks/useCardSearch";
import { FlatCard } from "@/lib/types/cards";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import collectionsData from "@/lib/data/collections.json";


import { Search, ChevronLeft, Layers } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "./field";
import { Checkbox } from "./checkbox";

type ViewMode = "overview" | "group" | "search";

interface Group {
  subset: string;
  name: string;
  cards: FlatCard[];
}

interface CollectionGridProps {
  collectionId: string;
}

const CollectionGrid = ({ collectionId }: CollectionGridProps) => {


const CollectionGrid = () => {
  
  const { 
    hasCard, 
    getCardCount, 
    currentCollectionCards, 
    addCard,
    removeCard,
    ownedUniqueCount,
    totalCards,
    duplicateCount
  } = useCollection();

  const {
    filteredCards,
    query,
    setQuery,
    setCollectionFilter,
    collectionFilter,
    setDuplicatesOnly,
    duplicatesOnly
  } = useCardSearch(); 



  const [activeView, setActiveView] = useState<ViewMode>("overview");
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);

  const isSearching =
    query.trim().length > 0 || collectionFilter !== null || duplicatesOnly;

  // Automatically switch views based on search/filter activity
  useEffect(() => {
    if (isSearching) {
      setActiveView("search");
    } else if (activeView === "search") {
      setActiveView("overview");
    }
  }, [isSearching, activeView]);



/* Group only the cards belonging to the active collection */
const nestedGroupedCards = useMemo(() => {
  const map: Record<string, Record<string, FlatCard[]>> = {};

  if (!Array.isArray(currentCollectionCards)) return map;

  currentCollectionCards.forEach((card) => {
    const subset = card.subset || "Other";
    let collectionName = card.group || "General";
    if (!card.group || card.group === card.subset) {
      collectionName = card.club || "General";
    }

    if (!map[subset]) map[subset] = {};
    if (!map[subset][collectionName]) map[subset][collectionName] = [];

    map[subset][collectionName].push(card);
  });

  // ⚡ ADD THIS: Sorts every club's card deck numerically before rendering
  Object.values(map).forEach((subsets) => {
    Object.values(subsets).forEach((cardArray) => {
      cardArray.sort((a, b) => Number(a.card_number) - Number(b.card_number));
    });
  });

  return map;
}, [currentCollectionCards]);


  /* Flatten groups */
  const flatGroups: Group[] = useMemo(() => {
    const result: Group[] = [];

    Object.entries(nestedGroupedCards).forEach(([subset, collections]) => {
      Object.entries(collections).forEach(([name, cards]) => {
        result.push({ subset, name, cards });
      });
    });

    return result;
  }, [nestedGroupedCards]);

  const activeGroup = flatGroups[activeGroupIndex];

  const goNextGroup = () => {
    setActiveGroupIndex((prev) =>
      Math.min(prev + 1, flatGroups.length - 1)
    );
  };

  const goPrevGroup = () => {
    setActiveGroupIndex((prev) => Math.max(prev - 1, 0));
  };

  const openGroup = (index: number) => {
    setActiveGroupIndex(index);
    setActiveView("group");
  };

  const tradeDuplicates = activeGroup?.cards.reduce((sum, card) => {
    const qty = getCardCount(card.uid);
    return sum + (qty > 1 ? qty - 1 : 0);
  }, 0) ?? 0;

  // 1. Find the name of the currently selected collection dynamically
 const collectionName = useMemo(() => {
  const found = collectionsData.collections.find((c: any) => c.id === collectionId);
  return found ? found.name : "Collection Deck";
}, [collectionId]);

  // 2. Automatically extract unique subsets inside this specific dataset for the filter menu
  const availableSubsets = useMemo(() => {
    if (!Array.isArray(currentCollectionCards)) return [];
    const subsets = currentCollectionCards.map(card => card.subset).filter(Boolean);
    return Array.from(new Set(subsets));
  }, [currentCollectionCards]);


  
  return (
    <div className="w-full flex flex-col max-w-6xl mx-auto space-y-6 md:px-15 overflow-visible">

      {/* SEARCH BAR */}
      {activeView !== "group" && (
        <div className="flex flex-col gap-4 justify-between items-start md:items-center border-b border-border py-4">

            {/* TITLE */}
            <div className="flex flex-col gap-2 w-full">
            <h1 className="text-xl font-bold tracking-tight">
               {collectionName}
            </h1>
            <p className="mb-4 text-sm text-muted-foreground">
                Track owned cards, duplicates, and completion status.
            </p>

            <div className="flex w-full justify-between py-5">
              <div className="bg-secondary p-2 rounded-lg min-w-30 text-center flex flex-col">
                <div className="text-muted-foreground text-sm">Owned</div>
                <div className="text-2xl text-accent-foreground">{ownedUniqueCount}</div>
              </div>
              <div className="bg-secondary p-2 rounded-lg min-w-30 text-center flex flex-col">
                <div className="text-muted-foreground text-sm">Need</div>
                <div className="text-2xl text-accent-foreground">{totalCards - ownedUniqueCount}</div>
              </div>
              <div className="bg-secondary p-2 rounded-lg min-w-30 text-center flex flex-col">
                <div className="text-muted-foreground text-sm">Duplicates</div>
                <div className="text-2xl text-accent-foreground">{duplicateCount}</div>
              </div>
            </div>
            </div>

            {/* SEARCH + FILTERS */}
            <div className="w-full py-2">
          <InputGroup className="w-full">
              <InputGroupInput
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="px-8 bg-card w-full rounded-lg"
              />

              <InputGroupAddon align="inline-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <InputGroupButton variant="default" className="px-5 py-3">
                          Filter
                      </InputGroupButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        {/* Clear Filter Button */}
                        <DropdownMenuItem>
                          <Button
                              onClick={() => setCollectionFilter(null)}
                              className={`w-full text-xs h-8 justify-start text-secondary-foreground ${collectionFilter === null ? "text-secondary": "text-secondary-foreground"}`}
                              variant={collectionFilter === null ? "default" : "ghost"}
                          >
                              All Cards
                          </Button>
                        </DropdownMenuItem>

                        {/* ⚡ DYNAMIC SUBSETS LOOP */}
                        {availableSubsets.map((subset) => (
                          <DropdownMenuItem key={subset}>
                            <Button
                                onClick={() => setCollectionFilter(subset)}
                                className={`w-full text-xs h-8 justify-start ${collectionFilter === subset ? "text-secondary": "text-secondary-foreground"}`}
                                variant={collectionFilter === subset ? "default" : "ghost"}
                            >
                                {subset}
                            </Button>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
              </InputGroupAddon>
          </InputGroup>
        </div>

            {/* DUPLICATES */}
            <div className="w-full">
            <FieldGroup className="w-full">
                <Field orientation="horizontal">
                  <Checkbox
                      checked={duplicatesOnly}
                      onCheckedChange={(checked) =>
                        setDuplicatesOnly(!!checked)
                      }
                      id="duplicates-checkbox"
                  />
                  <FieldLabel htmlFor="duplicates-checkbox" className="cursor-pointer">
                      Show Duplicates Only
                  </FieldLabel>
                </Field>
            </FieldGroup>
            </div>


        </div>
        )}

      {/* SEARCH RESULTS */}
      {activeView === "search" && (
        <>
          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredCards.map((card) => (
                <CardTile
                  key={card.uid}
                  card={card}
                  owned={hasCard(card.uid)}
                  duplicates={getCardCount(card.uid)}
                  onAdd={() => addCard(card.uid)}
                  onRemove={() => removeCard(card.uid)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No results found
            </div>
          )}
        </>
      )}

      {/* GROUP VIEW */}
      {activeView === "group" && activeGroup && (
        <>
        
          <div className="flex justify-between items-center border-b pb-3">
            <Button onClick={() => setActiveView("overview")}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <h2 className="font-bold">{activeGroup.name}</h2>

            <Badge>{activeGroup.subset}</Badge>
          </div>

           <div className="flex justify-between pt-4">
            <Button onClick={goPrevGroup} disabled={activeGroupIndex === 0}>
              Prev
            </Button>

            <span>
              {activeGroupIndex + 1} / {flatGroups.length}
            </span>

            <Button
              onClick={goNextGroup}
              disabled={activeGroupIndex === flatGroups.length - 1}
            >
              Next
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activeGroup.cards.map((card) => (
              <CardTile
              key={card.uid}
              card={card}
              owned={hasCard(card.uid)}
              duplicates={getCardCount(card.uid)}
              onAdd={() => addCard(card.uid)}       // Explicit handler for adding
              onRemove={() => removeCard(card.uid)} // Explicit handler for removing
            />

            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button onClick={goPrevGroup} disabled={activeGroupIndex === 0}>
              Prev
            </Button>

            <span>
              {activeGroupIndex + 1} / {flatGroups.length}
            </span>

            <Button
              onClick={goNextGroup}
              disabled={activeGroupIndex === flatGroups.length - 1}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* OVERVIEW */}
      {activeView === "overview" &&
        Object.entries(nestedGroupedCards).map(([subset, collections]) => (
          <section key={subset} className="space-y-4">
            <h2 className="font-bold uppercase">{subset}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(collections).map(([name, cards], idx) => {
                const owned = cards.filter((c) => hasCard(c.uid)).length;
                const total = cards.length;
                const percent = total ? (owned / total) * 100 : 0;

                const isComplete = owned === total && total > 0;

                const globalIndex = flatGroups.findIndex(
                  (g) => g.name === name && g.subset === subset
                );

                const tradeDuplicates = cards.reduce<number>((sum, card) => {
                  const qty = getCardCount(card.uid);
                  return sum + (qty > 1 ? qty - 1 : 0);
                }, 0);

                return (
                  <Card
                    key={name}
                    className="group cursor-pointer active:scale-[0.99] transition-all duration-200 relative shadow-sm flex flex-col justify-between overflow-hidden min-h-55 w-full"
                    onClick={() => openGroup(globalIndex)}
                  >

                    <div className={`absolute top-4 right-4 px-2.5 py-1 text-[11px] font-bold rounded-full ${isComplete ? "bg-primary text-primary-foreground": "bg-muted text-muted-foreground"}`}> 

                        {isComplete ? "Complete": "In Progress"}

                    </div>

                
                    <CardHeader className="flex flex-col gap-3 space-y-0 p-5 w-full"> {/* Image Wrapper */} 
                        
                        <div className="w-14 h-14 flex items-center justify-center relative bg-muted/30 rounded-lg p-1.5 border border-border/60 group-hover:scale-105 transition-transform duration-200"> 
                        {cards[0]?.clubLogo ? ( 
                            <Image src={cards[0]?.clubLogo} alt={name} width={45} height={45} className="object-contain image-touch" /> 
                            ) : ( 
                            <Layers className="h-5 w-5 text-muted-foreground" /> 
                            )} 
                        </div> 

                        <CardTitle className="text-sm font-bold truncate group-hover:text-primary transition-colors flex justify-between w-full py-2"> 
                        <div>{name}</div>
                          {tradeDuplicates > 0 && (
                            <div className="text-xs text-emerald-500 font-semibold">
                              +{tradeDuplicates} Duplicates
                            </div>
                          )}
                        </CardTitle> 

                    </CardHeader>

                    <CardContent className="w-full p-5 pt-0 mt-auto space-y-2">
                      <div className="flex justify-between items-baseline text-xs text-muted-foreground"> <div> <span className="text-2xl font-extrabold text-foreground">{owned}</span> <span> / {total}</span> </div> <span className="font-semibold text-primary">{Math.round(percent)}%</span> </div>
                      <Progress value={percent} className="h-1.5 bg-muted w-full" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
    </div>
  );
};
}

export default CollectionGrid;