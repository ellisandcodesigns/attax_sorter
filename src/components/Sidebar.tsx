"use client";

import { useState } from "react";
import { Menu, X, LogOut, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { useCollection } from "@/hooks/CollectionContext";
import { SidebarInlineExport } from "./CollectionExporter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";

export default function SidebarApp({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, signOut, displayName, updateProfileName } = useUser();
  const { activeCollectionId, setActiveCollectionId } = useCollection();

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
        className={`fixed z-50 top-0 left-0 h-full w-72 bg-background border-r flex flex-col transform transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="font-bold text-lg">Match Attax</h1>
          <Button variant="secondary" size="icon" onClick={() => setOpen(false)} className="bg-transparent cursor-pointer">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* INNER SCROLLABLE CONTENT BODY */}
        <div className="flex-1 py-4 px-3 overflow-y-auto">
          <SidebarInlineExport />
        </div>

        {/* BOTTOM PROFILE AREA WITH MODAL INCORPORATION */}
        <div className="border-t p-4 bg-background/50">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 h-12 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl cursor-pointer"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-foreground">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start text-left min-w-0 flex-1">
                  <span className="text-xs font-semibold text-foreground leading-tight">{displayName || "User"}</span>
                  <span className="text-[11px] text-muted-foreground truncate w-full">{user?.email || "Guest User"}</span>
                </div>
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Account Profile</span>
                </DialogTitle>
                <DialogDescription>
                  Manage your collectors profile.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                <label htmlFor="nickname" className="text-xs font-medium text-muted-foreground block">
                  Collector Nickname
                </label>
                <input
                  id="nickname"
                  type="text"
                  defaultValue={displayName} // Populates name instantly from Supabase Context
                  onBlur={(e) => updateProfileName(e.target.value)} // ⚡ Auto-saves to Supabase when user clicks away!
                  placeholder="Enter your name..."
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                />
              </div>

              {/* Profile Details Panel Info Card */}
              <div className="py-4 space-y-4">
                <div className="rounded-xl border bg-muted/30 p-4 space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground block">Registered Email Anchor</span>
                  <span className="text-sm font-semibold tracking-tight text-foreground">{user?.email || "Local Guest Vault"}</span>
                </div>
              </div>

              {/* Destructive Action Row */}
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto px-4 cursor-pointer"
                  onClick={() => {
                    signOut();
                    setOpen(false); // Closes sidebar on exit
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out of Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col w-full">
        
        {/* TOP BAR */}
        <header className="py-2 flex items-center justify-evenly gap-15 w-full px-4 border-b border-accent pb-5">
          {activeCollectionId === null ? (
              <div />
          ) : (
            <Button size="icon" variant="outline" onClick={() => setActiveCollectionId(null)}>
              <ArrowLeft/>
            </Button>
          )} 

          <h2 className="ml-3 font-semibold">Attax Collector</h2>

          <Button className="bg-transparent py-5 cursor-pointer" variant="secondary" onClick={() => setOpen(true)}>
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
