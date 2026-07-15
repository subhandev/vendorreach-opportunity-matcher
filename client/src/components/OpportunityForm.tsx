import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INDUSTRIES, STATES } from "@/lib/constants";
import type { MatchRequest } from "@/lib/api";

interface OpportunityFormProps {
  onSubmit: (payload: MatchRequest) => void;
  isLoading: boolean;
}

interface FormErrors {
  businessName?: string;
  industry?: string;
  state?: string;
}

export function OpportunityForm({ onSubmit, isLoading }: OpportunityFormProps) {
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [state, setState] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const nextErrors: FormErrors = {};
    if (!businessName.trim()) nextErrors.businessName = "Business name is required.";
    if (!industry) nextErrors.industry = "Please select an industry.";
    if (!state) nextErrors.state = "Please select a state.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ businessName: businessName.trim(), industry, state });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="businessName">Business name</Label>
        <Input
          id="businessName"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Acme Contracting Co."
          aria-invalid={!!errors.businessName}
        />
        {errors.businessName && (
          <p className="text-sm text-destructive">{errors.businessName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger id="industry" className="w-full" aria-invalid={!!errors.industry}>
            <SelectValue placeholder="Select an industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.industry && <p className="text-sm text-destructive">{errors.industry}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger id="state" className="w-full" aria-invalid={!!errors.state}>
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {STATES.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Searching..." : "Find opportunities"}
      </Button>
    </form>
  );
}
