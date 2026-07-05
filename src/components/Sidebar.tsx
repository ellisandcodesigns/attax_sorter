"use client";

import { useState } from "react";
import { Menu, X, LogOut, User, ArrowLeft, Copy, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import HomePage from "./pages/HomePage";
import { useCollection } from "@/hooks/CollectionContext";
import { SidebarInlineExport } from "./CollectionExporter";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./ui/dialog";

export default function SidebarApp({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useUser();
  const { activeCollectionId, setActiveCollectionId } = useCollection();
  const [openexport, setOpenExport] = useState(false);


  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* SIDEBAR OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-72 bg-background border-r transform transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="font-bold text-lg">Match Attax</h1>
          <Button variant="secondary" size="icon" onClick={() => setOpen(false)} className="bg-transparent">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="py-5 px-3">
         
          <SidebarInlineExport/>
          
        </div>


        {/* BOTTOM PROFILE AREA */}
        <div className="absolute bottom-0 w-full border-t p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm w-full justify-between">
            <User className="w-4 h-4" />
            <span className="truncate">{user?.email || "Guest"}</span>
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col w-full">
        
        {/* TOP BAR */}
        <header className="py-2 flex items-center justify-evenly gap-15 w-full px-4 border-b border-accent pb-5">

          {activeCollectionId === null ? (
              <div>

              </div>
          ): (
            <Button size="icon" variant="outline" onClick={() => setActiveCollectionId(null)}>
            <ArrowLeft/>
            </Button>
          )} 

          <h2 className="ml-3 font-semibold">Attax Collector</h2>

          <Button className="bg-transparent py-5" variant="secondary" onClick={() => setOpen(true)}>
            <Menu className="w-6! h-6!" />
          </Button>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}