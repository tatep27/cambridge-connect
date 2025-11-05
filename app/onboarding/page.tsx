"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    // If user already has an organization, redirect to dashboard
    if (session.user.organizationId) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!session || session.user.organizationId) {
    return null; // Redirecting
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome to Cambridge Connect!</h1>
        <p className="text-muted-foreground mb-8">
          To get started, you need to join an existing organization or create a new one.
        </p>
        <div className="space-y-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Join an Existing Organization</h2>
            <p className="text-muted-foreground mb-4">
              Search for and join an organization that you&apos;re already part of.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Coming soon in Phase 4E
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Create a New Organization</h2>
            <p className="text-muted-foreground mb-4">
              Create a new organization profile for your group.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Coming soon in Phase 4E
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

