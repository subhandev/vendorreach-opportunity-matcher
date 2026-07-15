import "dotenv/config";
import { db } from "./client.js";
import { opportunities, searchLogs } from "./schema.js";
import type { NewOpportunity } from "./schema.js";

const sampleOpportunities: NewOpportunity[] = [
  {
    title: "Highway Guardrail Replacement Project",
    industry: "Construction",
    state: "TX",
    description: "State DOT contract to replace damaged guardrails along 40 miles of rural highway.",
    qualifications: "Requires active TxDOT prequalification and $2M general liability coverage.",
  },
  {
    title: "Municipal Building Renovation",
    industry: "Construction",
    state: "CA",
    description: "Renovation of a 3-story city administrative building, including HVAC and ADA upgrades.",
    qualifications: "Licensed California B General Contractor, minimum $5M annual revenue.",
  },
  {
    title: "School Roofing Repair Contract",
    industry: "Construction",
    state: "FL",
    description: "Repair and replace roofing across 4 public elementary schools before the fall term.",
    qualifications: "Certified roofing contractor license, OSHA 30 certification for all site leads.",
  },
  {
    title: "State Agency Cybersecurity Audit",
    industry: "IT",
    state: "NY",
    description: "Comprehensive security audit and penetration test of a state agency's public-facing systems.",
    qualifications: "CMMI Level 3 or equivalent, staff with active CISSP certification.",
  },
  {
    title: "County IT Helpdesk Support Contract",
    industry: "IT",
    state: "TX",
    description: "Tier 1/2 helpdesk support for county government offices, 12-month renewable contract.",
    qualifications: "Prior public-sector helpdesk experience preferred, no formal certification required.",
  },
  {
    title: "Cloud Migration Services for City Government",
    industry: "IT",
    state: "WA",
    description: "Migrate legacy on-premise systems to a cloud environment for a mid-size city government.",
    qualifications: "AWS or Azure Government certified partner status required.",
  },
  {
    title: "Janitorial Services for County Courthouses",
    industry: "Cleaning",
    state: "IL",
    description: "Daily janitorial and sanitation services across 3 county courthouse locations.",
    qualifications: "Bonded and insured, background-checked staff for secure facility access.",
  },
  {
    title: "Post-Construction Cleanup Services",
    industry: "Cleaning",
    state: "GA",
    description: "Final cleanup pass for a newly built public library ahead of its opening.",
    qualifications: "General liability insurance of at least $1M, no certification required.",
  },
  {
    title: "Staffing Services for Seasonal State Workers",
    industry: "Recruiting",
    state: "CA",
    description: "Source and place seasonal administrative staff for a state agency's peak season.",
    qualifications: "Licensed staffing agency in California, minimum 2 years of public-sector placements.",
  },
  {
    title: "Executive Search for City Department Heads",
    industry: "Recruiting",
    state: "NY",
    description: "Retained executive search for two department head roles within city government.",
    qualifications: "Demonstrated track record in public-sector executive placements.",
  },
];

async function seed() {
  console.log("Clearing existing data...");
  await db.delete(searchLogs);
  await db.delete(opportunities);

  console.log(`Inserting ${sampleOpportunities.length} opportunities...`);
  await db.insert(opportunities).values(sampleOpportunities);

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
