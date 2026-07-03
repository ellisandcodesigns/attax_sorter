"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { FlatCard } from "@/lib/types/cards";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react"; // Import icons for indicators
import { cn } from "@/lib/utils";
import { useCollection } from "@/hooks/CollectionContext";

interface CardTileProps {
  card: FlatCard;
  owned: boolean;
  duplicates: number;
  onClick: () => void;
}

const CardTile = ({ card, owned, duplicates, onClick }: CardTileProps) => {
  const logo = card.clubLogo ?? "";
  const hasValidLogo = typeof logo === "string" && logo.trim().length > 0;
  const {removeCard, removeAllCards} = useCollection();
  const [holding, setHolding] = useState(false);
  const [longHold, setLongHold] = useState(false);

const holdStartTime = useRef<number>(0);
const holdInterval = useRef<NodeJS.Timeout | null>(null);
const actionTaken = useRef(false);

const HOLD_THRESHOLD = 600; // long hold threshold

const handlePointerDown = (e: React.PointerEvent) => {
  if (e.pointerType === "mouse" && e.button !== 0) return;

  actionTaken.current = false;
  holdStartTime.current = Date.now();

  holdInterval.current = setInterval(() => {
    const elapsed = Date.now() - holdStartTime.current;

    if (elapsed > 150) setHolding(true);
    if (elapsed > HOLD_THRESHOLD) setLongHold(true);
  }, 16);
};

const handlePointerUp = () => {
  if (!holdStartTime.current || actionTaken.current) return;

  const elapsed = Date.now() - holdStartTime.current;

  clearInterval(holdInterval.current!);
  holdInterval.current = null;

  setHolding(false);
  setLongHold(false);

   // 1. CLEAR CUT LONG HOLD (Wipe all)
  if (elapsed >= HOLD_THRESHOLD) {
    removeAllCards(card.uid);
  } 
  // 2. SHORT HOLD (Remove single duplicate)
  else if (elapsed >= 150) {
    removeCard(card.uid);
  } 
  // 3. FAST TAP (Add card / duplicate)
  else {
    onClick(); // Maps to addCard(card.uid) in parent
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
  setHolding(false);
  setLongHold(false);
};



  return (
    <Card 
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={clearHold}
      onPointerCancel={clearHold}
      className={cn(
        "w-50 h-70 p-4 rounded-xl flex flex-col justify-between relative cursor-pointer transition-transform",
        holding && "scale-95 opacity-80",
        longHold && "ring-2 ring-red-500",
        owned ? "border border-primary" : "bg-card border border-border"
    )}
    >
      {/* Top Bar: Badge ID and Owned Indicator */}
      <div className="z-10 flex  w-full p-1 justify-between">
        {/* Card Number Badge */}
        <Badge 
          variant="secondary" 
          className={`
            ${owned ? "bg-accent border-emerald-800" : "bg-accent border-neutral-800"}`}
        >
          {card.club ? `${card.club.substring(0, 3)}-` : "CARD-"}{card.card_number ?? "??"}
        </Badge>

        {/* Owned Status Checkmark / Duplicate Badge */}
        {owned && (
          <div className="bg-primary rounded-xl w-5 h-5 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-black stroke-3" />
          </div>
        )}
       
      </div>

      {/* Background Graphic Box (Centered Big Number & Faded Logo) */}
      <div className="relative flex w-full h-full items-center justify-center">
        
        {/* Faded Background Club Logo overlay */}
        {hasValidLogo ? (
            <Image
              src={card.clubLogo} 
              alt=""
              className={`mix-blend-luminosity object-center object-contain w-60 h-60 ${card.club === "Tottenham Hotspur" ? "opacity-100 mix-blend-color" : "opacity-25"}`}
              fill
              unoptimized
            />
        ): (
          <span className="text-4xl font-bold tracking-tighter select-none font-sans text-center opacity-5">
            {card.card_number}
          </span>
        )
        }
      </div>

      {/* Bottom Text Area: Identification Descriptions */}
      <div className="z-10 w-full mt-auto space-y-0.5 p-1">
        <h3 className="truncate text-[11px] font-black uppercase tracking-wide">
          {card.name || "Unnamed Entry"}
        </h3>
        <p className="truncate text-[9px] font-medium text-muted-foreground uppercase tracking-wider">
          {card.club || "Generic Collection"}
        </p>
      </div>

      {/* Floating Duplicates Counter Overlay */}
      {duplicates > 1 && (
        <div className="absolute right-3 bottom-3 z-20 bg-primary text-black font-black text-sm px-1 rounded-sm shadow-sm">
          ×{duplicates}
        </div>
      )}
    </Card>
  );
};

export default CardTile;
