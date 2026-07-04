"use client";

import React, { useState } from "react";
import { useUser } from "@/hooks/use-user"; // Check your exact folder name case here
import { redirect } from "next/navigation";
import HomePage from "@/components/pages/HomePage";
import { Menu, X, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SidebarApp from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { signOut, user, loading } = useUser();

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
    <div className="w-full mx-auto flex flex-col justify-center max-w-4xl">

      {/* SIDE BAR */}


        <SidebarApp>
        {children}
      </SidebarApp>

    </div>
  );
}
