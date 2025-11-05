"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (session) {
      // User is authenticated
      if (session.user.organizationId) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } else {
      // User is not authenticated, redirect to login
      router.push("/login");
    }
  }, [session, status, router]);

  // Show loading state while checking session
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
}
