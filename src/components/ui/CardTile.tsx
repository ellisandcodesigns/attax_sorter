"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { FlatCard } from "@/lib/types/cards";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Minus, Plus } from "lucide-react"; 
import { cn } from "@/lib/utils";
import { useCollection } from "@/hooks/CollectionContext";
import { Button } from "./button";

interface CardTileProps {
  card: FlatCard;
  owned: boolean;
  duplicates: number;
  onAdd: () => void;
  onRemove: () => void;
}

const CardTile = ({ card, owned, duplicates, onAdd, onRemove }: CardTileProps) => {
  const logo = card.clubLogo ?? "";
  const hasValidLogo = typeof logo === "string" && logo.trim().length > 0;
  // Prevent event bubbling up to the Card parent wrapper
  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <Card 
      className={cn(
        "w-full h-70 p-4 rounded-xl flex flex-col justify-evenly relative cursor-pointer transition-transform",
        owned ? "border border-primary" : "bg-card border border-border"
      )}
    >
      {/* Top Bar: Badge ID and Owned Indicator */}
      <div className="z-10 flex w-full p-1 justify-between">
        <Badge 
          variant="default" 
          className={owned ? "text-foreground bg-primary/60 border-emerald-800" : "text-foreground bg-secondary border-neutral-800"}
        >
          {card.club ? `${card.club.substring(0, 3)}-` : "CARD-"}{card.card_number ?? "??"}
        </Badge>

        {owned && (
          <div className="bg-primary rounded-xl w-5 h-5 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-foreground stroke-3" />
          </div>
        )}
      </div>

        <div className="relative w-full h-full">
          {hasValidLogo ? (
            <Image
              src={card.clubLogo}
              alt=""
              className={`absolute! max-w-3/4 mx-auto inset-0 image-touch w-full h-full ${owned ? "opacity-70": "opacity-30"}`}
              fill
              unoptimized
            />
          ) : (
            <span className="text-4xl font-bold tracking-tighter select-none font-sans text-center opacity-5">
              {card.card_number}
            </span>
          )}
        </div>

      {/* Bottom Text Area */}
      <div className="z-10 w-full mt-auto space-y-0.5 p-1 mb-2">
        <h3 className="truncate text-[11px] font-black uppercase tracking-wide">
          {card.name || "Unnamed Entry"}
        </h3>
        <p className="truncate text-[9px] font-medium text-muted-foreground uppercase tracking-wider">
          {card.club || "Generic Collection"}
        </p>
      </div>

        <div className="w-full flex justify-between items-center z-20">
          <Button 
            onClick={(e) => handleButtonClick(e, () => onRemove())} 
            onPointerDown={(e) => e.stopPropagation()} // Blocks card long press initiation
            className="cursor-pointer" 
            variant="secondary"
          >
            <Minus />
          </Button>
          
          <span className="font-bold select-none">{duplicates}</span>
          
          <Button 
            onClick={(e) => handleButtonClick(e, onAdd)} 
            onPointerDown={(e) => e.stopPropagation()} // Blocks card long press initiation
            className="cursor-pointer" 
            variant="secondary"
          >
            <Plus />
          </Button>
        </div>
    </Card>
  );
};

export default CardTile;
