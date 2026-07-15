import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MatchResponse, Opportunity } from "@/lib/api";

interface ResultsListProps {
  results: MatchResponse;
  industry: string;
  state: string;
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <CardTitle className="text-base">{opportunity.title}</CardTitle>
        <Badge variant={opportunity.matchStrength === "exact" ? "default" : "secondary"}>
          {opportunity.matchStrength === "exact" ? "Exact match" : "Industry match"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {opportunity.industry} &middot; {opportunity.state}
        </p>
        <p className="text-sm">{opportunity.description}</p>
        {opportunity.qualifications && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Qualifications: </span>
            {opportunity.qualifications}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function ResultsList({ results, industry, state }: ResultsListProps) {
  const { exact, fallback } = results;

  if (exact.length === 0 && fallback.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="font-medium">No matches found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We couldn't find any {industry} opportunities in {state}, or elsewhere. Check back
          soon as new opportunities are added.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {exact.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            {exact.length} exact match{exact.length === 1 ? "" : "es"} in {state}
          </h2>
          <div className="space-y-3">
            {exact.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </div>
      )}

      {fallback.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            {exact.length > 0
              ? `More ${industry} opportunities in other states`
              : `No exact matches in ${state} — here are other ${industry} opportunities`}
          </h2>
          <div className="space-y-3">
            {fallback.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
