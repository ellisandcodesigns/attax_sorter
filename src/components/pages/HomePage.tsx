"use client";

import { useState } from "react";
import { GlobalProgress } from "../ui/GlobalProgress";
import CollectionGrid from "../ui/CollectionGrid";
import { Button } from "../ui/button";
import collections from "@/lib/data/collections.json";
import { useUser } from "@/hooks/use-user";

export default function HomePage() {  
    const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
    const myCollections = collections.collections.map((index) => {return index.name}) ;
    const matchAttax = myCollections[0];

    return (
        <div className="mt-10">
            {!isCollectionsOpen ? (
                    <div className="flex flex-col gap-8 p-8">

                        <div className="w-full max-w-5xl cursor-pointer active:opacity-60 hover:opacity-80" onClick={() => setIsCollectionsOpen(true)}>
                            <GlobalProgress />
                        </div>
                    </div>
            ) : ( 
                /* 🗺️ VIEW 2: The Core Card Grids */
                <div className="px-8 space-y-4">
                    {/* ⚡ FIXED: Correctly toggles back to dashboard selector view */}
                    <Button variant="outline" onClick={() => setIsCollectionsOpen(false)}>
                        ← Back
                    </Button>

                   
                    
                    <CollectionGrid />
                </div>
            )}
        </div>
    );
}
