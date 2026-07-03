import sets from "@/lib/data/cards.json";
import { FlatCard} from "@/lib/types/cards";


export const flattenCards = (): FlatCard[] => {
  const groups = sets.groups;

  const flat: FlatCard[] = [];

  groups.forEach((group) => {
    group.cards?.forEach((card) => {
      flat.push({
        uid: `${group.subset}-${group.group_name}-${card.id}`,

        id: card.id,
        name: card.name,

        card_number: String(card.card_number),

        club: group.group_name,
        clubLogo: group.logo ?? "",

        group: group.subset,

        isSpecial: group.subset !== "Base Cards",

        subset: group.subset,
      });
    });
  });

  return flat;
};

