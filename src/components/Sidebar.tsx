"use client";

import { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import HomePage from "./pages/HomePage";

export default function SidebarApp({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useUser();

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
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>


        {/* BOTTOM PROFILE AREA */}
        <div className="absolute bottom-0 w-full border-t p-4 space-y-2">
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
        <header className="h-14 border-b flex items-center px-4">
          <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>

          <h2 className="ml-3 font-semibold">Collection</h2>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}