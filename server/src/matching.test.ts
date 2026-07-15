import { describe, it, expect } from "vitest";
import { matchOpportunities } from "./matching.js";
import type { Opportunity } from "./db/schema.js";

function makeOpportunity(overrides: Partial<Opportunity>): Opportunity {
  return {
    id: 1,
    title: "Test Opportunity",
    industry: "Construction",
    state: "TX",
    description: "A test opportunity.",
    qualifications: null,
    createdAt: new Date(),
    ...overrides,
  };
}

describe("matchOpportunities", () => {
  const opportunities: Opportunity[] = [
    makeOpportunity({ id: 1, industry: "Construction", state: "TX" }),
    makeOpportunity({ id: 2, industry: "Construction", state: "CA" }),
    makeOpportunity({ id: 3, industry: "IT", state: "TX" }),
    makeOpportunity({ id: 4, industry: "Cleaning", state: "IL" }),
  ];

  it("returns exact matches when industry and state both match", () => {
    const result = matchOpportunities(opportunities, { industry: "Construction", state: "TX" });
    expect(result.exact.map((o) => o.id)).toEqual([1]);
    expect(result.exact[0].matchStrength).toBe("exact");
  });

  it("returns industry-only fallback matches when state does not match", () => {
    const result = matchOpportunities(opportunities, { industry: "Construction", state: "NY" });
    expect(result.exact).toEqual([]);
    expect(result.fallback.map((o) => o.id)).toEqual([1, 2]);
    expect(result.fallback.every((o) => o.matchStrength === "industry")).toBe(true);
  });

  it("excludes exact matches from the fallback list", () => {
    const result = matchOpportunities(opportunities, { industry: "Construction", state: "TX" });
    expect(result.fallback.map((o) => o.id)).toEqual([2]);
  });

  it("returns both empty when neither industry nor state matches anything", () => {
    const result = matchOpportunities(opportunities, { industry: "Recruiting", state: "WA" });
    expect(result.exact).toEqual([]);
    expect(result.fallback).toEqual([]);
  });
});
