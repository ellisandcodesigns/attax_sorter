import CollectionGrid from "@/components/ui/CollectionGrid";
import DashboardLayout from "@/components/DashboardLayout";
import { CollectionProvider } from "@/hooks/CollectionContext";
import cards from "@/lib/data/cards.json"; 
import { FlatCard } from "@/lib/types/cards";

export default async function DashboardPage() {
  // 1. Run data formatting operations securely on the server
  const flattenedCards: FlatCard[] = cards.groups.flatMap((groupItem) => {
    return groupItem.cards.map((cardItem) => ({
      id: cardItem.id,
      name: cardItem.name,
      card_number: String(cardItem.card_number),
      uid: (cardItem as any).uid || `${groupItem.subset}-${groupItem.group_name}-${cardItem.id}`,
      subset: groupItem.subset,
      group: groupItem.group_name,
      club: groupItem.group_name, 
      clubLogo: groupItem.logo || "", 
      isSpecial: groupItem.subset !== "Base Cards", 
      leader: (cardItem as any).leader || false,
    }));
  });

  return (
    <CollectionProvider initialStaticCards={flattenedCards}>
      <DashboardLayout/>
    </CollectionProvider>
  );
}
