import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping from original)
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

// Form field schema for OpenAI response
export const formFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum([
    "text",
    "textarea",
    "number",
    "email",
    "select",
    "radio",
    "checkbox",
    "date",
    "range",
    "rating",
  ]),
  required: z.boolean().optional(),
  options: z.array(
    z.object({
      label: z.string(),
      value: z.string()
    })
  ).optional(),
  placeholder: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  section: z.string().optional()
});

export type FormField = z.infer<typeof formFieldSchema>;

// Schema for form structure response from OpenAI
export const formStructureSchema = z.object({
  title: z.string(),
  sections: z.array(z.string()).optional(),
  fields: z.array(formFieldSchema)
});

export type FormStructure = z.infer<typeof formStructureSchema>;

// Product reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productType: text("product_type").notNull(),
  reviewData: jsonb("review_data").notNull(),
  createdAt: text("created_at").notNull()
});

export const insertReviewSchema = createInsertSchema(reviews);

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
