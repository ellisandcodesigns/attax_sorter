// lib/utils/flattenCards.ts
import { FlatCard } from "@/lib/types/cards";

/**
 * Transforms a raw Match Attax collection JSON dataset into a flat array of cards.
 * Handles grouped subsets, club data, and generates a predictable unique ID (uid).
 */
export function flattenCollection(jsonData: any): FlatCard[] {
  // Guard clause against missing groups array
  if (!jsonData || !Array.isArray(jsonData.groups)) {
    return [];
  }

  return jsonData.groups.flatMap((groupItem: any) => {
    // Guard clause against missing cards inside a group
    if (!Array.isArray(groupItem.cards)) {
      return [];
    }

    return groupItem.cards.map((cardItem: any) => ({
      // Match the fields required by your FlatCard type definition
      id: cardItem.id,
      name: cardItem.name,
      card_number: String(cardItem.card_number),
      
      // Prioritise JSON uid if explicitly declared, otherwise fall back to explicit group composition
      uid: cardItem.uid || `${groupItem.subset}-${groupItem.group_name}-${cardItem.id}`,
      
      subset: groupItem.subset,
      group: groupItem.subset, // Backwards-compatible alias for filters
      club: groupItem.group_name,
      clubLogo: groupItem.logo || "",
      
      // Determine if it is a special card variant based on subset classification
      isSpecial: groupItem.subset !== "Base Cards",
      leader: cardItem.leader || false,
    }));
  });
}
