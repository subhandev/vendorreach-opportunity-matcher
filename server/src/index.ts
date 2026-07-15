import "dotenv/config";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { db } from "./db/client.js";
import { opportunities, searchLogs } from "./db/schema.js";
import { matchOpportunities } from "./matching.js";
import { INDUSTRIES, STATES } from "./constants.js";

const app = express();
app.use(express.json());

const allowedOrigins = (process.env.CLIENT_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
  })
);

const matchRequestSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required").max(200),
  industry: z.enum(INDUSTRIES),
  state: z.enum(STATES),
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/opportunities", async (_req, res) => {
  const all = await db.select().from(opportunities);
  res.json(all);
});

app.post("/api/match", async (req, res) => {
  const parsed = matchRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    return;
  }

  const { businessName, industry, state } = parsed.data;

  const all = await db.select().from(opportunities);
  const { exact, fallback } = matchOpportunities(all, { industry, state });

  await db.insert(searchLogs).values({
    businessName,
    industry,
    state,
    exactMatchCount: exact.length,
    fallbackMatchCount: fallback.length,
  });

  res.json({ exact, fallback });
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
