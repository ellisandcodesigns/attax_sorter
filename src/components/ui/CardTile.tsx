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
  onClick: () => void;
}

const CardTile = ({ card, owned, duplicates, onClick }: CardTileProps) => {
  const logo = card.clubLogo ?? "";
  const hasValidLogo = typeof logo === "string" && logo.trim().length > 0;
  const { removeCard, removeAllCards } = useCollection();
  const [longHold, setLongHold] = useState(false);

  const holdStartTime = useRef<number>(0);
  const holdInterval = useRef<NodeJS.Timeout | null>(null);
  const actionTaken = useRef(false);

  const HOLD_THRESHOLD = 600; 

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    actionTaken.current = false;
    holdStartTime.current = Date.now();

    holdInterval.current = setInterval(() => {
      const elapsed = Date.now() - holdStartTime.current;
      if (elapsed > HOLD_THRESHOLD) setLongHold(true);
    }, 16);
  };

  const handlePointerUp = () => {
    if (!holdStartTime.current || actionTaken.current) return;

    const elapsed = Date.now() - holdStartTime.current;

    clearInterval(holdInterval.current!);
    holdInterval.current = null;
    setLongHold(false);

    if (elapsed >= HOLD_THRESHOLD) {
      removeAllCards(card.uid);
    }

    actionTaken.current = true;
    holdStartTime.current = 0;
  };

  const clearHold = () => {
    if (holdInterval.current) {
      clearInterval(holdInterval.current);
      holdInterval.current = null;
    }
    holdStartTime.current = 0;
    setLongHold(false);
  };

  // Prevent event bubbling up to the Card parent wrapper
  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <Card 
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={clearHold}
      onPointerCancel={clearHold}
      className={cn(
        "w-full h-70 p-4 rounded-xl flex flex-col justify-between relative cursor-pointer transition-transform",
        longHold && "ring-2 ring-red-500",
        owned ? "border border-primary" : "bg-card border border-border"
      )}
    >
      {/* Top Bar: Badge ID and Owned Indicator */}
      <div className="z-10 flex w-full p-1 justify-between">
        <Badge 
          variant="secondary" 
          className={owned ? "bg-accent border-emerald-800" : "bg-accent border-neutral-800"}
        >
          {card.club ? `${card.club.substring(0, 3)}-` : "CARD-"}{card.card_number ?? "??"}
        </Badge>

        {owned && (
          <div className="bg-primary rounded-xl w-5 h-5 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-foreground stroke-3" />
          </div>
        )}
      </div>

        {hasValidLogo ? (
          <Image
            src={card.clubLogo} 
            alt=""
            className={`absolute! p-10 inset-0 image-touch w-full h-full ${card.club === "Tottenham Hotspur" ? "opacity-60 mix-blend-color" : "opacity-25"}`}
            fill
            unoptimized
          />
        ) : (
          <span className="text-4xl font-bold tracking-tighter select-none font-sans text-center opacity-5">
            {card.card_number}
          </span>
        )}

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
            onClick={(e) => handleButtonClick(e, () => removeCard(card.uid))} 
            onPointerDown={(e) => e.stopPropagation()} // Blocks card long press initiation
            className="cursor-pointer" 
            variant="secondary"
          >
            <Minus />
          </Button>
          
          <span className="font-bold select-none">{duplicates}</span>
          
          <Button 
            onClick={(e) => handleButtonClick(e, onClick)} 
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
