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
  getProjectEvents(projectId: number, filters?: { limit?: number, offset?: number, type?: string, status?: string, severity?: string }): Promise<ErrorEvent[]>;
  getEvent(id: number): Promise<ErrorEvent | undefined>;
  createErrorEvent(event: InsertErrorEvent): Promise<ErrorEvent>;
  updateErrorEvent(id: number, updates: Partial<ErrorEvent>): Promise<ErrorEvent>;
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
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getProjectEvents(projectId: number, filters: { limit?: number, offset?: number, type?: string, status?: string, severity?: string } = {}): Promise<ErrorEvent[]> {
    const { limit = 50, offset = 0, type, status, severity } = filters;
    let query = db.select()
      .from(errorEvents)
      .where(eq(errorEvents.projectId, projectId));
    
    if (type) query = query.where(eq(errorEvents.type, type)) as any;
    if (status) query = query.where(eq(errorEvents.status, status)) as any;
    if (severity) query = query.where(eq(errorEvents.severity, severity)) as any;

    return await (query as any)
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

  async updateErrorEvent(id: number, updates: Partial<ErrorEvent>): Promise<ErrorEvent> {
    const [updated] = await db.update(errorEvents)
      .set(updates)
      .where(eq(errorEvents.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
