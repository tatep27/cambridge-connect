"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AIResourceFinder() {
  return (
    <DashboardLayout activeRoute="/ai-resource-finder">
      <div>
        <h2 className="text-3xl font-bold mb-4">AI Resource Finder</h2>
        <p className="text-muted-foreground">Use the search bar above to find resources, organizations, or get help.</p>
      </div>
    </DashboardLayout>
  );
}

