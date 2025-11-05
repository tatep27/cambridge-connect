"use client";

import { useState } from "react";
import { OrgType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrgTypes } from "@/lib/api-client/organizations";
import { createOrganization, CreateOrganizationInput } from "@/lib/api-client/organizations";

interface CreateOrgFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

const ORG_TYPE_LABELS: Record<OrgType, string> = {
  nonprofit: "Nonprofit",
  public_library: "Public Library",
  community_center: "Community Center",
  grassroots: "Grassroots",
  arts_venue: "Arts & Venue",
  other: "Other",
};

export function CreateOrgForm({ onSuccess, onCancel }: CreateOrgFormProps) {
  const [name, setName] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<OrgType[]>([]);
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [contactInternal, setContactInternal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const orgTypes = getOrgTypes();

  function toggleType(type: OrgType) {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!name.trim()) {
        setError("Organization name is required");
        setLoading(false);
        return;
      }
      if (selectedTypes.length === 0) {
        setError("Please select at least one organization type");
        setLoading(false);
        return;
      }
      if (!description.trim()) {
        setError("Description is required");
        setLoading(false);
        return;
      }
      if (!contactInternal.trim()) {
        setError("Contact information is required");
        setLoading(false);
        return;
      }

      const input: CreateOrganizationInput = {
        name: name.trim(),
        type: selectedTypes,
        description: description.trim(),
        website: website.trim() || undefined,
        email: email.trim() || undefined,
        contactInternal: contactInternal.trim(),
      };

      await createOrganization(input);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create organization");
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Organization</CardTitle>
        <CardDescription>
          Create a new organization profile for your group
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Organization Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Cambridge Community Center"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Organization Type <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {orgTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => toggleType(type)}
                    disabled={loading}
                  />
                  <label
                    htmlFor={type}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {ORG_TYPE_LABELS[type]}
                  </label>
                </div>
              ))}
            </div>
            {selectedTypes.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Select at least one type
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your organization..."
              rows={4}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contactInternal" className="text-sm font-medium">
              Contact Information <span className="text-destructive">*</span>
            </label>
            <Input
              id="contactInternal"
              value={contactInternal}
              onChange={(e) => setContactInternal(e.target.value)}
              placeholder="e.g., John Doe, Director - john@example.com"
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Preferred contact for your organization
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="website" className="text-sm font-medium">
              Website (optional)
            </label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.org"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email (optional)
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@example.org"
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Creating..." : "Create Organization"}
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
        </form>
      </CardContent>
    </Card>
  );
}

