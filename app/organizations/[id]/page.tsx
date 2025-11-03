"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Organization } from "@/lib/types";
import { getOrganization } from "@/lib/api/organizations";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OrganizationProfile } from "@/components/organizations/OrganizationProfile";

function OrganizationPageContent() {
  const params = useParams();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrganization();
  }, [params.id]);

  async function loadOrganization() {
    if (!params.id || typeof params.id !== 'string') {
      setError("Invalid organization ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const org = await getOrganization(params.id);
      if (org) {
        setOrganization(org);
      } else {
        setError("Organization not found");
      }
    } catch (err) {
      console.error("Failed to load organization:", err);
      setError("Failed to load organization");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout activeRoute="/organizations">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading organization...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !organization) {
    return (
      <DashboardLayout activeRoute="/organizations">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error || "Organization not found"}</p>
          <Link
            href="/organizations"
            className="text-primary hover:underline"
          >
            Back to Organizations
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeRoute="/organizations">
      <OrganizationProfile organization={organization} />
    </DashboardLayout>
  );
}

export default function OrganizationPage() {
  return (
    <Suspense fallback={
      <DashboardLayout activeRoute="/organizations">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading organization...</p>
        </div>
      </DashboardLayout>
    }>
      <OrganizationPageContent />
    </Suspense>
  );
}

