import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// === TABLE DEFINITIONS ===
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  platform: text("platform").notNull(), // 'ios', 'android', 'react-native', 'flutter', etc.
  apiKey: text("api_key").notNull().unique(), // Used by SDK to authenticate
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const errorEvents = pgTable("error_events", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  type: text("type").notNull(), // 'error', 'warning', 'info', 'fatal', 'exception', 'crash'
  status: text("status").notNull().default("unresolved"), // 'unresolved', 'resolved', 'ignored', 'in_progress'
  severity: text("severity").notNull().default("medium"), // 'low', 'medium', 'high', 'critical'
  message: text("message").notNull(),
  stackTrace: text("stack_trace"),
  deviceInfo: jsonb("device_info"), // OS version, device model, etc.
  platformInfo: jsonb("platform_info"), // App version, build number
  tags: jsonb("tags"), // Custom tags
  breadcrumbs: jsonb("breadcrumbs"), // User actions leading to error
  occurredAt: timestamp("occurred_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  events: many(errorEvents),
}));

export const errorEventsRelations = relations(errorEvents, ({ one }) => ({
  project: one(projects, {
    fields: [errorEvents.projectId],
    references: [projects.id],
  }),
}));

// === BASE SCHEMAS ===
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, userId: true, apiKey: true });
export const insertErrorEventSchema = createInsertSchema(errorEvents).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

// Base types
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type ErrorEvent = typeof errorEvents.$inferSelect;
export type InsertErrorEvent = z.infer<typeof insertErrorEventSchema>;

// Request types
export type CreateProjectRequest = InsertProject;
export type IngestErrorEventRequest = Omit<InsertErrorEvent, "projectId"> & { apiKey: string };

// Response types
export type ProjectResponse = Project;
export type ErrorEventResponse = ErrorEvent;

export interface ProjectStats {
  totalErrors: number;
  errorsLast24h: number;
  uniqueUsers: number;
}
