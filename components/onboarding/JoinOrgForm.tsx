"use client";

import { useEffect, useState } from "react";
import { Organization } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrganizations } from "@/lib/api-client/organizations";
import { joinOrganization } from "@/lib/api-client/organizations";
import { OrganizationCard } from "@/components/organizations/OrganizationCard";

interface JoinOrgFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export function JoinOrgForm({ onSuccess, onCancel }: JoinOrgFormProps) {
  const [search, setSearch] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadOrganizations() {
    try {
      setLoadingOrgs(true);
      const orgs = await getOrganizations({ search });
      setOrganizations(orgs);
    } catch (err) {
      setError("Failed to load organizations");
    } finally {
      setLoadingOrgs(false);
    }
  }

  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      loadOrganizations();
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleJoin() {
    if (!selectedOrgId) {
      setError("Please select an organization");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await joinOrganization(selectedOrgId);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join organization");
      setLoading(false);
    }
  }

  const filteredOrgs = organizations.filter((org) =>
    org.name.toLowerCase().includes(search.toLowerCase()) ||
    org.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Existing Organization</CardTitle>
        <CardDescription>
          Search for and join an organization that you&apos;re already part of
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="search" className="text-sm font-medium">
            Search Organizations
          </label>
          <Input
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or description..."
            disabled={loading || loadingOrgs}
          />
        </div>

        {loadingOrgs ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading organizations...
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {search ? "No organizations found matching your search" : "No organizations available"}
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredOrgs.map((org) => (
              <div
                key={org.id}
                onClick={() => setSelectedOrgId(org.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedOrgId === org.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-gray-50"
                }`}
              >
                <h3 className="font-semibold">{org.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {org.description}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleJoin}
            className="flex-1"
            disabled={loading || !selectedOrgId}
          >
            {loading ? "Joining..." : "Join Organization"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

