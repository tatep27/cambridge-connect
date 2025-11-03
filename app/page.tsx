export default function Home() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-8">Cambridge Connect</h1>
        <nav className="space-y-2">
          <a href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-200">
            Dashboard
          </a>
          <a href="/organizations" className="block py-2 px-4 rounded hover:bg-gray-200">
            Organizations
          </a>
          <a href="/forums" className="block py-2 px-4 rounded hover:bg-gray-200">
            Forums
          </a>
          <a href="/ai-resource-finder" className="block py-2 px-4 rounded hover:bg-gray-200">
            AI Resource Finder
          </a>
          <a href="/settings" className="block py-2 px-4 rounded hover:bg-gray-200">
            Settings
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-4">Welcome to Cambridge Connect</h2>
        <p className="text-gray-600">Select a page from the sidebar to begin.</p>
      </main>
    </div>
  );
}

