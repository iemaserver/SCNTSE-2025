import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const questionnaireResponses = pgTable("questionnaire_responses", {
  id: serial("id").primaryKey(),
  q1: text("q1").notNull(),
  q2: text("q2").notNull(),
  q3: text("q3").notNull(),
  q4: text("q4").notNull(),
  recommendation: text("recommendation").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQuestionnaireResponseSchema = createInsertSchema(questionnaireResponses).pick({
  q1: true,
  q2: true,
  q3: true,
  q4: true,
  recommendation: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQuestionnaireResponse = z.infer<typeof insertQuestionnaireResponseSchema>;
export type QuestionnaireResponse = typeof questionnaireResponses.$inferSelect;
