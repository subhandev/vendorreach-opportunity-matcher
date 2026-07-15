import type { Opportunity } from "./db/schema.js";

export interface MatchCriteria {
  industry: string;
  state: string;
}

export type MatchedOpportunity = Opportunity & { matchStrength: "exact" | "industry" };

export interface MatchResult {
  exact: MatchedOpportunity[];
  fallback: MatchedOpportunity[];
}

export function matchOpportunities(
  opportunities: Opportunity[],
  { industry, state }: MatchCriteria
): MatchResult {
  const exact = opportunities
    .filter((o) => o.industry === industry && o.state === state)
    .map((o) => ({ ...o, matchStrength: "exact" as const }));

  const fallback = opportunities
    .filter((o) => o.industry === industry && o.state !== state)
    .map((o) => ({ ...o, matchStrength: "industry" as const }));

  return { exact, fallback };
}
