import { flattenCards } from "@/lib/utils/flattenCards";
import { CardIndex } from "@/lib/types/cards";

export const buildCardIndex = (): CardIndex => {
  const allCards = flattenCards();

  const index: CardIndex = {};

  allCards.forEach((card) => {
    index[card.uid] = card;
  });

  return index;
};