"use client";

import React, { useState } from "react";
import { useCollection } from "@/hooks/CollectionContext";
import { Share, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SidebarInlineExport() {
  const [openExport, setOpenExport] = useState(false);
  const { exportGroupedCollectionText } = useCollection();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = async (type: "owned" | "duplicates") => {
    const text = exportGroupedCollectionText(type);
    if (!text) return alert(`No ${type} cards to copy!`);

    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full space-y-1.5">
      {/* Target button configuration. Fixes state toggle bug using standard logical inversion (!) */}
      <Button 
        variant="ghost" 
        onClick={() => setOpenExport((prev) => !prev)} 
        className="w-full justify-between hover:bg-slate-800 text-slate-300 hover:text-white"
      >
        <span className="flex items-center gap-2">
          <Share className="h-4 w-4" />
          <span>Export Lists</span>
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openExport ? "rotate-180" : ""}`} />
      </Button>

      {/* Inline reveal block container */}
      {openExport && (
        <div className="pl-6 pr-2 space-y-1 flex flex-col transition-all">
          <button
            onClick={() => handleCopy("owned")}
            className="w-full text-left py-1.5 px-3 text-xs font-medium rounded text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            {copiedType === "owned" ? "Copied All! ✅" : "• Copy Owned List"}
          </button>
          <button
            onClick={() => handleCopy("duplicates")}
            className="w-full text-left py-1.5 px-3 text-xs font-medium rounded text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            {copiedType === "duplicates" ? "Copied Dups! ✅" : "• Copy Duplicates"}
          </button>
        </div>
      )}
    </div>
  );
}
