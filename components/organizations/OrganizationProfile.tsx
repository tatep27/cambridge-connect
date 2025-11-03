import { Organization } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Mail, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface OrganizationProfileProps {
  organization: Organization;
}

export function OrganizationProfile({ organization }: OrganizationProfileProps) {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back Button */}
      <Link href="/organizations">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Organizations
        </Button>
      </Link>

      {/* Single Card with All Information */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{organization.name}</CardTitle>
              <div className="flex flex-wrap gap-2 mb-4">
                {organization.type.map((type) => (
                  <Badge key={type} variant="secondary">
                    {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </Badge>
                ))}
              </div>
              {organization.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <MapPin className="h-4 w-4" />
                  <span>{organization.location}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-sm whitespace-pre-wrap text-muted-foreground">
              {organization.description}
            </p>
          </div>

          {/* Resources Offered Section */}
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-2">Reach Out to Us For</h3>
            <p className="text-sm whitespace-pre-wrap text-muted-foreground">
              {organization.resourcesOffered}
            </p>
          </div>

          {/* Contact Information Section */}
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="space-y-2">
              {organization.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {organization.website}
                  </a>
                </div>
              )}
              {organization.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${organization.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {organization.email}
                  </a>
                </div>
              )}
              {organization.contactInternal && (
                <div className="pt-2 mt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Internal Contact:</p>
                  <p className="text-sm">{organization.contactInternal}</p>
                </div>
              )}
            </div>
          </div>

          {/* Current Needs Section */}
          {organization.currentNeedsInternal && (
            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-2">Current Needs</h3>
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                {organization.currentNeedsInternal}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

