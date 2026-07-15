import { useEffect, useState } from "react";
import { OpportunityForm } from "@/components/OpportunityForm";
import { ResultsList } from "@/components/ResultsList";
import {
  ApiError,
  fetchMatches,
  wakeBackend,
  type MatchRequest,
  type MatchResponse,
} from "@/lib/api";

function App() {
  const [results, setResults] = useState<MatchResponse | null>(null);
  const [lastQuery, setLastQuery] = useState<{ industry: string; state: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    wakeBackend();
  }, []);

  async function handleSubmit(payload: MatchRequest) {
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await fetchMatches(payload);
      setResults(data);
      setLastQuery({ industry: payload.industry, state: payload.state });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't reach the server. Please try again in a moment."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          VendorReach Opportunity Matcher
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tell us about your business and we'll match you to relevant bids, RFPs, and
          contract opportunities.
        </p>
      </header>

      <div className="mb-8 rounded-lg border p-6">
        <OpportunityForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {results && lastQuery && (
        <ResultsList results={results} industry={lastQuery.industry} state={lastQuery.state} />
      )}
    </div>
  );
}

export default App;
