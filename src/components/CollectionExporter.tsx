"use client";

import React, { useState } from "react";
import { useCollection } from "@/hooks/CollectionContext";
import { Share, ChevronDown, Check, Files, FileQuestion, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SidebarInlineExport() {
  const [openExport, setOpenExport] = useState(false);
  const { exportGroupedCollectionText } = useCollection();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const handleCopy = async (type: "owned" | "duplicates" | "unowned") => {
    const text = exportGroupedCollectionText(type);
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);

      const labelMap = {
        owned: "Owned List copied to clipboard!",
        duplicates: "Duplicates Trade List copied to clipboard!",
        unowned: "Missing Wishlist copied to clipboard!",
      };
      setBannerMessage(labelMap[type]);

      setTimeout(() => {
       setCopiedType(null);
       setBannerMessage(null);
      }, 2000);
        
    } catch (err) {
      console.error(err);
    }
  };

  return (
     <div className="w-full space-y-1">
      {/* Main Accordion Trigger Button */}
      <Button 
        variant="ghost" 
        onClick={() => setOpenExport((prev) => !prev)} 
        className={`w-full justify-between text-muted-foreground transition-all duration-200 cursor-pointer h-10 px-3 rounded-lg
          ${openExport ? "bg-accent/40 text-foreground font-medium" : "hover:bg-accent/40 hover:text-foreground"}`}
      >
        <span className="flex items-center gap-2.5 text-sm">
          <Share2 className={`h-4 w-4 transition-colors ${openExport ? "text-primary" : "text-muted-foreground"}`} />
          <span>Export Lists</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground/70 transition-transform duration-300 ${openExport ? "rotate-180 text-primary" : ""}`} />
      </Button>

      {/* Inline reveal block container */}
      {openExport && (
        <div className="relative pl-5 pr-1 py-1 mt-0.5 space-y-1 flex flex-col">
          
          {/* Decorative vertical timeline connector line */}
          <div className="absolute left-3 top-0 bottom-2 w-px bg-border/60" />

          {/* 1. Copy Owned List */}
          <button
            onClick={() => handleCopy("owned")}
            className={`w-full flex items-center justify-between py-2 px-3 text-xs font-medium rounded-md transition-all cursor-pointer group
              ${copiedType === "owned" 
                ? "bg-emerald-950/30 text-emerald-400 border border-emerald-500/20" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent/40"}`}
          >
            <span className="flex items-center gap-2">
              <Copy className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              <span>Copy Owned List</span>
            </span>
            {copiedType === "owned" && <Check className="h-3 w-3" />}
          </button>

          {/* 2. Copy Duplicates */}
          <button
            onClick={() => handleCopy("duplicates")}
            className={`w-full flex items-center justify-between py-2 px-3 text-xs font-medium rounded-md transition-all cursor-pointer group
              ${copiedType === "duplicates" 
                ? "bg-amber-950/30 text-amber-400 border border-amber-500/20" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent/40"}`}
          >
            <span className="flex items-center gap-2">
              <Files className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              <span>Copy Duplicates</span>
            </span>
            {copiedType === "duplicates" && <Check className="h-3 w-3" />}
          </button>

          {/* 3. Copy Missing List */}
          <button
            onClick={() => handleCopy("unowned")}
            className={`w-full flex items-center justify-between py-2 px-3 text-xs font-medium rounded-md transition-all cursor-pointer group
              ${copiedType === "unowned" 
                ? "bg-rose-950/30 text-rose-400 border border-rose-500/20" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent/40"}`}
          >
            <span className="flex items-center gap-2">
              <FileQuestion className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              <span>Copy Missing List</span>
            </span>
            {copiedType === "unowned" && <Check className="h-3 w-3" />}
          </button>
          
        </div>
      )}

       {/* ⚡ FLOATING SUCCESS BANNER TOAST */}
      {bannerMessage && (
        <div className="fixed w-screen top-3 z-50 flex items-center gap-2.5 bg-neutral-900 border border-neutral-800 text-neutral-100 px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-top-5 fade-in duration-300 max-w-sm sm:max-w-md">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <Check className="h-3.5 w-3.5" />
          </div>
          <p className="text-xs sm:text-sm font-medium tracking-tight pr-2">
            {bannerMessage}
          </p>
        </div>
      )}
    </div>
  );
}
