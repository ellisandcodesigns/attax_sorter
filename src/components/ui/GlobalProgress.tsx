"use client"
import React from 'react'
import MediumCard from './CardVarients'
import { CardContent, CardHeader } from './card'
import { Progress } from './progress'
import { useCollection } from '@/hooks/CollectionContext'
import collections from "@/lib/data/collections.json"

type progressType = {
  onSelectCollection: (id: string) => void;
}

export const GlobalProgress = ({onSelectCollection}: progressType) => {
 const { getCollectionStats } = useCollection();
  const myCollections = collections.collections;

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Main Container Card matching the image styling */}

      {myCollections.map((collection) => {

         const { ownedUniqueCount, totalCards, completion } = getCollectionStats(collection.id);

         return (

          

        <div className="w-full mx-auto max-w-5xl p-4 md:p-8 cursor-pointer active:opacity-60 hover:opacity-80" onClick={() => onSelectCollection(collection.id)} key={collection.id}>

         <MediumCard classes="bg-[#12161A] border border-gray-800/40 w-full flex flex-col p-6 rounded-2xl shadow-xl">
        
        {/* Header section with muted labels */}
        <CardHeader className="p-0 flex flex-col border-none">
          <div>
            <h2>{collection.name}</h2>
          </div>
          <div className='flex items-center justify-between w-full'>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total progress</p>
            <h2 className="text-3xl font-black text-white mt-3 tracking-tight">
              {ownedUniqueCount} <span className="text-gray-500 font-normal text-xl">/ {totalCards}</span>
            </h2>
          </div>
          <p className="text-gray-400 text-xs font-medium mt-1">{totalCards} Cards</p>
        </CardHeader>

        {/* Progress bar matching the layout */}
        <CardContent className="p-0 mt-6">
          <Progress 
            className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden" 
            color="bg-emerald-500"
            value={completion} 
          />
          
          {/* Sub-progress metadata */}
          <div className="flex justify-between items-center mt-3 text-xs font-medium text-gray-500">
            <span>{ownedUniqueCount}/{totalCards}</span>
            <span>{completion}%</span>
          </div>
        </CardContent>

      </MediumCard>
      </div>
         )

    })}
     
    </div>
  )
}
