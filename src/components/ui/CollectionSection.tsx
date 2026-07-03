"use client";
import { useCollection } from '@/hooks/CollectionContext';
import Image from 'next/image';
import React from 'react'

const CollectionSection = () => {
    const { allCards, ownedCards } = useCollection(); 
  return (
    <div>
        <div className="grid grid-cols-3 gap-2">
      {allCards.map((card) => {
        const count = ownedCards[card.id] || 0;
        const isOwned = count > 0;

        return (
          <div
            key={card.uid}
            className={`
              rounded-lg p-2 border text-center
              transition-all
              ${
                isOwned
                  ? "bg-green-900/30 border-green-500"
                  : "bg-gray-900 opacity-40"
              }
            `}
          >
            {/* Logo */}
            <Image
              src={`${card.clubLogo}`}
              className="w-8 h-8 mx-auto mb-1"
              alt={card.club}
              width={10}
              height={10}
            />

            {/* Name */}
            <p className="text-xs font-bold truncate">
              {card.name}
            </p>

            {/* Club */}
            <p className="text-[10px] opacity-70">
              {card.club}
            </p>

            {/* Status */}
            <div className="mt-1 text-[10px]">
              {count === 0 && (
                <span className="text-red-400">MISSING</span>
              )}

              {count === 1 && (
                <span className="text-green-400">OWNED</span>
              )}

              {count > 1 && (
                <span className="text-yellow-400">
                  x{count}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
    </div>
  )
}

export default CollectionSection