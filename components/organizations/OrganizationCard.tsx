import { Organization } from "@/lib/types";
import { formatArrayDisplay } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface OrganizationCardProps {
  organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{organization.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {formatArrayDisplay(organization.type)}
        </p>
        <p className="text-sm text-foreground">
          {organization.resourcesOffered}
        </p>
      </CardContent>
    </Card>
  );
}

