"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  activeRoute?: string;
}

export function DashboardLayout({ children, activeRoute }: DashboardLayoutProps) {
  const router = useRouter();

  function handleSignOut() {
    // TODO: Implement sign out logic in Phase 2
    alert("Sign out functionality coming soon!");
  }

  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <aside className="w-64 bg-gray-100 p-6 fixed left-0 top-0 bottom-0 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-8">Cambridge Connect</h1>
        <nav className="space-y-2">
          <Link 
            href="/dashboard" 
            className={`block py-2 px-4 rounded hover:bg-gray-200 ${activeRoute === '/dashboard' ? 'bg-gray-200 font-medium' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/organizations" 
            className={`block py-2 px-4 rounded hover:bg-gray-200 ${activeRoute === '/organizations' ? 'bg-gray-200 font-medium' : ''}`}
          >
            Organizations
          </Link>
          <Link 
            href="/forums" 
            className={`block py-2 px-4 rounded hover:bg-gray-200 ${activeRoute === '/forums' ? 'bg-gray-200 font-medium' : ''}`}
          >
            Forums
          </Link>
        </nav>
      </aside>

      {/* Main content area with fixed header */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Fixed Top Bar */}
        <header className="sticky top-0 z-50 border-b bg-background px-6 py-4 flex items-center justify-between gap-4">
          {/* AI Search/Prompt Bar */}
          <div className="flex-1 max-w-3xl">
            <Input
              type="text"
              placeholder="Ask AI: Find resources, organizations, or get help..."
              className="w-full"
              // TODO: Add onChange handler for AI search
            />
          </div>
          
          {/* Profile Dropdown - Right Side */}
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => router.push('/settings?tab=profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}

