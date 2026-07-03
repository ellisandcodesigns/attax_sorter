"use client"
import React from 'react'
import MediumCard from './CardVarients'
import { CardContent, CardHeader } from './card'
import { Progress } from './progress'
import { useCollection } from '@/hooks/CollectionContext'

export const GlobalProgress = () => {
  const { ownedCount, totalCards, completion } = useCollection();
  
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Main Container Card matching the image styling */}
      <MediumCard classes="bg-[#12161A] border border-gray-800/40 w-full flex flex-col p-6 rounded-2xl shadow-xl">
        
        {/* Header section with muted labels */}
        <CardHeader className="p-0 flex flex-row justify-between items-start border-none">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total progress</p>
            <h2 className="text-5xl font-black text-white mt-3 tracking-tight">
              {ownedCount} <span className="text-gray-500 font-normal text-2xl">/ {totalCards}</span>
            </h2>
          </div>
          <p className="text-gray-400 text-xs font-medium mt-1">{totalCards} stickers</p>
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
            <span>{ownedCount}/{totalCards}</span>
            <span>{completion}%</span>
          </div>
        </CardContent>

      </MediumCard>
    </div>
  )
}
