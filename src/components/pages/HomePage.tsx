"use client";

import { GlobalProgress } from "../ui/GlobalProgress";
import CollectionGrid from "../ui/CollectionGrid";
import { Button } from "../ui/button";
import { useCollection } from "@/hooks/CollectionContext"; // ⚡ Import context

export default function HomePage() {  
    // ⚡ Get active state and setter directly from your context provider
    const { activeCollectionId, setActiveCollectionId } = useCollection();

    return (
        <div className="mt-10 w-full flex flex-col">
            {!activeCollectionId ? (
                // Sets the collection ID immediately on click
                <GlobalProgress onSelectCollection={setActiveCollectionId} />
            ) : ( 
                /* 🗺️ VIEW 2: The Core Card Grids */
                <div className="px-8 space-y-4">
                    {/* Clear the context value to go back home */}
                    <Button className="px-2 py-1" variant="outline" onClick={() => setActiveCollectionId(null)}>
                        ← <span className="px-1"></span> Home
                    </Button>
                    
                    {/* Pass the active id down to the grid */}
                    <CollectionGrid collectionId={activeCollectionId} />
                </div>
            )}
        </div>
    );
}
