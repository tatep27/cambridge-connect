"use client";

import { useEffect, useState } from "react";
import { Organization, OrgType } from "@/lib/types";
import { getOrganizations, getOrgTypes } from "@/lib/api/organizations";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OrganizationCard } from "@/components/organizations/OrganizationCard";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<OrgType[]>([]);

  const orgTypes = getOrgTypes();

  useEffect(() => {
    loadOrganizations();
  }, [search, selectedTypes]);

  async function loadOrganizations() {
    setLoading(true);
    const results = await getOrganizations({
      search: search || undefined,
      type: selectedTypes.length > 0 ? selectedTypes : undefined,
    });
    setOrganizations(results);
    setLoading(false);
  }

  function toggleOrgType(type: OrgType) {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }

  return (
    <DashboardLayout activeRoute="/organizations">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Organizations</h1>
          <p className="text-muted-foreground">Browse Cambridge-based organizations</p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <Input
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />

          <div>
            <h3 className="font-semibold mb-2">Organization Type</h3>
            <div className="space-y-2">
              {orgTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => toggleOrgType(type)}
                  />
                  <label
                    htmlFor={`type-${type}`}
                    className="text-sm cursor-pointer"
                  >
                    {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">Loading organizations...</div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No organizations found matching your filters
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Showing {organizations.length} organization{organizations.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <OrganizationCard key={org.id} organization={org} />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
