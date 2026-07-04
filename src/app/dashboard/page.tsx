import DashboardLayout from "@/components/DashboardLayout";
import { CollectionProvider } from "@/hooks/CollectionContext";
import HomePage from "@/components/pages/HomePage";

export default async function DashboardPage() {
  return (
    // ⚡ CLEANED UP: No longer needs server-side flattening or initialStaticCards prop
    <CollectionProvider>
      <DashboardLayout>
        <HomePage />
      </DashboardLayout>
    </CollectionProvider>
  );
}
