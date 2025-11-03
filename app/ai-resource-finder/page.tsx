import Link from "next/link";

export default function AIResourceFinder() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-8">Cambridge Connect</h1>
        <nav className="space-y-2">
          <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-200">
            Dashboard
          </Link>
          <Link href="/organizations" className="block py-2 px-4 rounded hover:bg-gray-200">
            Organizations
          </Link>
          <Link href="/forums" className="block py-2 px-4 rounded hover:bg-gray-200">
            Forums
          </Link>
          <Link href="/ai-resource-finder" className="block py-2 px-4 rounded bg-gray-200 font-medium">
            AI Resource Finder
          </Link>
          <Link href="/settings" className="block py-2 px-4 rounded hover:bg-gray-200">
            Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-4">AI Resource Finder</h2>
        <p className="text-gray-600">Coming soon</p>
      </main>
    </div>
  );
}

