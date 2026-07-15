const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export interface Opportunity {
  id: number;
  title: string;
  industry: string;
  state: string;
  description: string;
  qualifications: string | null;
  matchStrength: "exact" | "industry";
}

export interface MatchResponse {
  exact: Opportunity[];
  fallback: Opportunity[];
}

export interface MatchRequest {
  businessName: string;
  industry: string;
  state: string;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function fetchMatches(payload: MatchRequest): Promise<MatchResponse> {
  const res = await fetch(`${API_URL}/api/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error ?? "Something went wrong. Please try again.", res.status);
  }

  return res.json();
}
