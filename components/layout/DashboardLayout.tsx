import Link from "next/link";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  activeRoute?: string;
}

export function DashboardLayout({ children, activeRoute }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-6">
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
          <Link 
            href="/ai-resource-finder" 
            className={`block py-2 px-4 rounded hover:bg-gray-200 ${activeRoute === '/ai-resource-finder' ? 'bg-gray-200 font-medium' : ''}`}
          >
            AI Resource Finder
          </Link>
          <Link 
            href="/settings" 
            className={`block py-2 px-4 rounded hover:bg-gray-200 ${activeRoute === '/settings' ? 'bg-gray-200 font-medium' : ''}`}
          >
            Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

