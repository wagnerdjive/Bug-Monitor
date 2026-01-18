import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import {
  projects, errorEvents,
  type Project, type InsertProject,
  type ErrorEvent, type InsertErrorEvent
} from "@shared/schema";
import { randomBytes } from "crypto";

export interface IStorage {
  // Projects
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectByApiKey(apiKey: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // Events
  getProjectEvents(projectId: number, limit?: number, offset?: number): Promise<ErrorEvent[]>;
  getEvent(id: number): Promise<ErrorEvent | undefined>;
  createErrorEvent(event: InsertErrorEvent): Promise<ErrorEvent>;
}

export class DatabaseStorage implements IStorage {
  async getProjects(userId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjectByApiKey(apiKey: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.apiKey, apiKey));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    // Generate a random API key if one isn't provided (though schema usually enforces uniqueness, best to generate here)
    // But our schema says apiKey is required in InsertProject.
    // Let's assume the route handler generates it.
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getProjectEvents(projectId: number, limit: number = 50, offset: number = 0): Promise<ErrorEvent[]> {
    return await db.select()
      .from(errorEvents)
      .where(eq(errorEvents.projectId, projectId))
      .orderBy(desc(errorEvents.occurredAt))
      .limit(limit)
      .offset(offset);
  }

  async getEvent(id: number): Promise<ErrorEvent | undefined> {
    const [event] = await db.select().from(errorEvents).where(eq(errorEvents.id, id));
    return event;
  }

  async createErrorEvent(insertEvent: InsertErrorEvent): Promise<ErrorEvent> {
    const [event] = await db.insert(errorEvents).values(insertEvent).returning();
    return event;
  }
}

export const storage = new DatabaseStorage();
