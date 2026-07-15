import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const opportunities = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  industry: text("industry").notNull(),
  state: text("state").notNull(),
  description: text("description").notNull(),
  qualifications: text("qualifications"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const searchLogs = pgTable("search_logs", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  industry: text("industry").notNull(),
  state: text("state").notNull(),
  exactMatchCount: integer("exact_match_count").notNull(),
  fallbackMatchCount: integer("fallback_match_count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Opportunity = typeof opportunities.$inferSelect;
export type NewOpportunity = typeof opportunities.$inferInsert;
