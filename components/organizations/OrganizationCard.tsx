"use client";

import Link from "next/link";
import { Organization } from "@/lib/types";
import { formatArrayDisplay } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface OrganizationCardProps {
  organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Link href={`/organizations/${organization.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
            {organization.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {formatArrayDisplay(organization.type)}
          </p>
          <p className="text-sm text-foreground line-clamp-2">
            {organization.resourcesOffered}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

