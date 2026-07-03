import { Geist_Mono, Nunito_Sans, Geist, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/hooks/use-user";
import { CollectionProvider } from "@/hooks/CollectionContext";
import { FlatCard } from "@/lib/types/cards";
import card from "@/lib/data/cards.json"

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

  const flattenedCards: FlatCard[] = card.groups.flatMap((groupItem: {
    cards: any[];
    subset: string;
    group_name: string;
    logo?: string;
  }) => {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>
          <AuthProvider>
           <CollectionProvider initialStaticCards={flattenedCards}> 
            {children}
          </CollectionProvider>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
