import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ideas = pgTable("ideas", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull(),
  city: text("city"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  locationRationale: text("locationRationale"), // Added locationRationale field
});

export const insertIdeaSchema = createInsertSchema(ideas).omit({
  id: true,
});

export type InsertIdea = z.infer<typeof insertIdeaSchema>;
export type Idea = typeof ideas.$inferSelect;

// Keeping existing user schema for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;