"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreateOrgForm } from "./CreateOrgForm";
import { JoinOrgForm } from "./JoinOrgForm";

type OnboardingMode = "select" | "join" | "create";

export function OnboardingFlow() {
  const router = useRouter();
  const [mode, setMode] = useState<OnboardingMode>("select");

  function handleSuccess() {
    // Redirect to dashboard after successful onboarding
    router.push("/dashboard");
    router.refresh();
  }

  if (mode === "join") {
    return (
      <div className="max-w-2xl mx-auto">
        <JoinOrgForm
          onSuccess={handleSuccess}
          onCancel={() => setMode("select")}
        />
      </div>
    );
  }

  if (mode === "create") {
    return (
      <div className="max-w-2xl mx-auto">
        <CreateOrgForm
          onSuccess={handleSuccess}
          onCancel={() => setMode("select")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="p-6 border rounded-lg hover:border-primary transition-colors cursor-pointer" onClick={() => setMode("join")}>
        <h2 className="text-xl font-semibold mb-2">Join an Existing Organization</h2>
        <p className="text-muted-foreground mb-4">
          Search for and join an organization that you&apos;re already part of.
        </p>
        <Button variant="outline" className="w-full">
          Join Organization
        </Button>
      </div>
      <div className="p-6 border rounded-lg hover:border-primary transition-colors cursor-pointer" onClick={() => setMode("create")}>
        <h2 className="text-xl font-semibold mb-2">Create a New Organization</h2>
        <p className="text-muted-foreground mb-4">
          Create a new organization profile for your group.
        </p>
        <Button variant="outline" className="w-full">
          Create Organization
        </Button>
      </div>
    </div>
  );
}

