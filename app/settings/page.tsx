"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Settings() {
  return (
    <DashboardLayout activeRoute="/settings">
      <div>
        <h2 className="text-3xl font-bold mb-4">Settings</h2>
        <p className="text-muted-foreground">Settings coming soon</p>
      </div>
    </DashboardLayout>
  );
}

