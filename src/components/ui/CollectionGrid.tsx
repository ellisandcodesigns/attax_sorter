"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useCollection } from "@/hooks/CollectionContext";
import CardTile from "./CardTile";
import { useCardSearch } from "@/hooks/useCardSearch";
import { FlatCard } from "@/lib/types/cards";

// 📦 Shadcn Components Import
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// 🔍 Icons
import { Search, ChevronLeft, Layers } from "lucide-react";
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const CollectionGrid = () => {
  const { hasCard, getCardCount, allCards, addCard } = useCollection();
  const { filteredCards, query, setQuery, setCollectionFilter, collectionFilter } = useCardSearch();

  // 📂 Folders tracking state
  const [activeGroup, setActiveGroup] = useState<{ subset: string; name: string } | null>(null);

  const isSearching = query.trim().length > 0 || collectionFilter !== null;
  

  // 🧠 Group the flat cards by Subset -> Inner Collection Name
  const nestedGroupedCards = useMemo(() => {
    const structuralMap: Record<string, Record<string, FlatCard[]>> = {};

    if (!Array.isArray(allCards)) return structuralMap;

    allCards.forEach((card: FlatCard) => {
      const subset = card.subset || "Other";
      
      let collectionName = card.group || "General";
      if (!card.group || card.group === card.subset) {
        collectionName = card.club || "General";
      }

      if (!structuralMap[subset]) {
        structuralMap[subset] = {};
      }
      if (!structuralMap[subset][collectionName]) {
        structuralMap[subset][collectionName] = [];
      }

      structuralMap[subset][collectionName].push(card);
    });

    return structuralMap;
  }, [allCards]);
  return (
    <div className="w-full flex flex-col max-w-6xl mx-auto space-y-6">
        {!activeGroup ? (
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-border py-4">

                <div className="flex flex-col gap-2 w-full">
                    <h1 className="text-xl font-bold tracking-tight">Match Attax 25/26 Collection</h1>
                    <p className="mb-4 text-sm text-muted-foreground">Track owned cards, duplicates, and completion status.</p>
                </div>

                <div className="w-full">

                    <InputGroup className="w-full">
                        <InputGroupInput 
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="p-2 pl-9 bg-card w-full rounded-lg"/>
                        <InputGroupAddon align="inline-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <InputGroupButton variant="default" className="px-5 py-3">
                                        Filter
                                    </InputGroupButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                        <Button 
                                        variant={collectionFilter === null ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setCollectionFilter(null)}
                                        className="text-xs h-8 px-3 rounded-lg bg-primary w-full"
                                        >
                                        All
                                        </Button>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                        <Button 
                                        variant={collectionFilter === "Base Cards" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setCollectionFilter("Base Cards")}
                                        className="text-xs h-8 px-3 rounded-lg bg-primary w-full"
                                        >
                                        Base
                                        </Button>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                        <Button 
                                        variant={collectionFilter === "Special Cards" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setCollectionFilter("Special Cards")}
                                        className="text-xs h-8 px-3 rounded-lg bg-primary w-full"
                                        >
                                        Specials
                                        </Button>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </InputGroupAddon>
                    </InputGroup>

                </div>
            

            </div>
        ): (
            <div className="flex flex-col items-center gap-6 border-b pb-4 border-border">
                <h2 className="text-xl font-bold tracking-tight">{activeGroup.name}</h2>
                <div className="flex items-center gap-4 w-full justify-between">
                    <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveGroup(null)}
                    className="gap-2 h-9 border-border hover:bg-muted"
                    >
                    <ChevronLeft className="h-4 w-4"/>
                    Back to Overview
                    </Button>
                    <Badge variant="secondary" className="mb-0.5 text-[10px] tracking-wider uppercase">
                    {activeGroup.subset}
                </Badge>
                </div>
                
                
            </div>
        )}

               {isSearching && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground border rounded-lg p-2 bg-muted/10">
                <Search className="h-4 w-4 text-primary" />
                <span>Showing Results:  
                    <strong> {filteredCards.length} </strong>
                    items located
                </span>
            </div>
        )}

        {isSearching ? (
            /* 🔍 UI STATE 1: Search Results */
            filteredCards.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-in fade-in duration-300">
                    {filteredCards.map((card) => (
                        <CardTile
                            key={card.uid}
                            card={card}
                            owned={hasCard(card.uid)}
                            duplicates={getCardCount(card.uid)}
                            onClick={() => addCard(card.uid)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border border-dashed rounded-lg bg-muted/20">
                    <Layers className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                    <p className="text-sm font-semibold text-muted-foreground">No matches found in your collection</p>
                </div>
            )
        ) : activeGroup ? (
            /* 📂 UI STATE 2: Opened Group/Folder View */
            <div className="place-items-center grid grid-cols-2 sm:grid-cols-3 gap-4 animate-in zoom-in-95 duration-200">
                {(nestedGroupedCards[activeGroup.subset]?.[activeGroup.name] || []).map((card) => (
                    <CardTile
                        key={card.uid}
                        card={card}
                        owned={hasCard(card.uid)}
                        duplicates={getCardCount(card.uid)}
                        onClick={() => addCard(card.uid)}
                    />
                ))}
            </div>
        ) : (
            /* 🗂️ UI STATE 3: Main Dashboard Folder View */
            Object.entries(nestedGroupedCards).map(([subsetName, collectionGroups]) => (
                <section className="space-y-4 pt-2" key={subsetName}>
                    <div className="flex flex-col gap-2">
                        <div className="text-lg font-extrabold tracking-tight uppercase border-l-4 border-primary pl-2.5 text-foreground">
                            <h2>{subsetName}</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-2 gap-4">
                            {Object.entries(collectionGroups).map(([groupName, cardsArray]) => {
                                const ownedCount = cardsArray.filter(c => hasCard(c.uid)).length;
                                const totalCount = cardsArray.length;
                                const isComplete = ownedCount === totalCount && totalCount > 0;
                                const completionPercentage = totalCount > 0 ? (ownedCount / totalCount) * 100 : 0;
                                
                                return (
                                    <Card 
                                        key={groupName}
                                        onClick={() => setActiveGroup({ subset: subsetName, name: groupName })}
                                        className="group cursor-pointer active:scale-[0.99] transition-all duration-200 relative shadow-sm flex flex-col justify-between overflow-hidden min-h-55"
                                    >
                                        {/* Status Badge */}
                                        <div className={`absolute top-4 right-4 px-2.5 py-1 text-[11px] font-bold rounded-full ${
                                            isComplete ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        }`}>
                                            {isComplete ? "Complete" : "In Progress"}
                                        </div>

                                        <CardHeader className="flex flex-col gap-3 space-y-0 p-5 w-full">
                                            {/* Image Wrapper */}
                                            <div className="w-14 h-14 flex items-center justify-center relative bg-muted/30 rounded-lg p-1.5 border border-border/60 group-hover:scale-105 transition-transform duration-200">
                                                {cardsArray[0]?.clubLogo ? (
                                                    <Image
                                                        src={cardsArray[0].clubLogo} 
                                                        alt={groupName} 
                                                        width={45} 
                                                        height={45}
                                                        className="object-contain"
                                                    />
                                                ) : (
                                                    <Layers className="h-5 w-5 text-muted-foreground" />
                                                )}
                                            </div>

                                            <CardTitle className="text-sm font-bold truncate group-hover:text-primary transition-colors max-w-[70%]">
                                                {groupName}
                                            </CardTitle>
                                        </CardHeader>

                                        {/* Fixed Progress Layout */}
                                        <CardContent className="w-full p-5 pt-0 mt-auto space-y-2">
                                            <div className="flex justify-between items-baseline text-xs text-muted-foreground">
                                                <div>
                                                    <span className="text-2xl font-extrabold text-foreground">{ownedCount}</span>
                                                    <span> / {totalCount}</span>
                                                </div>
                                                <span className="font-semibold text-primary">{Math.round(completionPercentage)}%</span>
                                            </div>
                                            <Progress value={completionPercentage} className="h-1.5 bg-muted w-full" />
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>
            ))
        )}
    </div>
  );
};

export default CollectionGrid;
