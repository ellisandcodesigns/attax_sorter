"use client"
import React from 'react'
import MediumCard from './CardVarients'
import { CardContent, CardFooter, CardHeader } from './card'
import { Progress } from './progress'
import { useCollection } from '@/hooks/CollectionContext'


export const GlobalProgress = () => {
   
  const { ownedCount, totalCards, completion, duplicateCount } = useCollection();
  
  return (
    <div className="bg-linear-to-b from-[#1B9D80] to-[#173F38] p-1 rounded-md shadow-lg w-full max-w-3xl">
      <MediumCard classes="bg-gradient-to-b from-[#16433B] via-[#172F2C] to-[#132624] w-full flex flex-col justify-center p-5 gap-10 rounded-md">
        <p className='p-2 py-4 text-lg text-foreground/60 font-semibold'>Match Attax 2025 / 2026</p>
        <CardHeader className="px-2 pt-5 pb-2 flex justify-between items-center border-none">
          
          <h2 className="text-3xl font-bold">
            {ownedCount} <span> / {totalCards}</span>
          </h2>
          <span className='text-2xl font-bold'>{completion}%</span>
        </CardHeader>

        <CardContent className="px-2 py-8">
          <Progress className='w-full h-2' value={completion} />
        </CardContent>
        
        <CardFooter className="bg-inherit px-2 pt-2 pb-5 border-none">
          <div className="flex justify-between w-full md:justify-center md:gap-6">
            <div className='p-4 md:px-6 bg-[#12211F] rounded-md flex flex-col items-center'>
              <p className='font-bold text-lg'>{ownedCount}</p>
              <p className='text-foreground/40 text-xs'>Owned</p>
            </div>

            <div className='p-4 md:px-6 bg-[#12211F] rounded-md flex flex-col items-center'>
              <p className='font-bold text-lg'>{totalCards - ownedCount}</p>
              <p className='text-foreground/40 text-xs'>Missing</p>
            </div>

            <div className='p-4 md:px-6 bg-[#12211F] rounded-md flex flex-col items-center'>
              <p className='font-bold text-lg'>{duplicateCount}</p>
              <p className='text-foreground/40 text-xs'>Spares</p>
            </div>
      
          </div>
        </CardFooter>
      </MediumCard>

      
    </div>
  )
}
