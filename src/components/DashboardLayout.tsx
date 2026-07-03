"use client";

import React, { useState } from "react";
import { useUser } from "@/hooks/use-user"; // Check your exact folder name case here
import { redirect } from "next/navigation";
import HomePage from "@/components/pages/HomePage";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout() {
  const { signOut, user, loading } = useUser();
  const [menu, openMenu] = useState(false);

  // Prevent flicker during initial session resolution
  if (loading) {
    return <div className="p-8 text-center text-sm">Verifying session...</div>;
  }

  // Client-side protected route fallback redirect
  if (!user) {
    redirect("/");
  }

  const displayUserText =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "Collector";

  return (
    <div className="w-full mx-auto flex flex-col justify-center">
      {/* Header Action Section */}
      <div className="flex justify-between items-center border-b p-4 md:p-9 md:pt-0 w-full">
        <span className="text-sm text-muted-foreground">Hi, {displayUserText}!</span>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger  asChild><Menu className="cursor-pointer hover:opacity-70"/></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-xs h-8 px-3 rounded-lg bg-primary w-full text-center">

                  <button
                  onClick={() => signOut()}
                  className=" hover:text-white transition-colors text-center text-xs font-semibold cursor-pointer w-full"
                >
                  Sign Out
                </button>

                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {menu}
          
        </div>
        
      </div>
      
      {/* Status components */}
      <HomePage />

    </div>
  );
}
