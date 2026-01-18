import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { randomBytes } from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Projects Routes
  app.get(api.projects.list.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const projects = await storage.getProjects(userId);
    res.json(projects);
  });

  app.post(api.projects.create.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      // Generate API Key
      const apiKey = randomBytes(32).toString('hex');
      
      const input = api.projects.create.input.parse({
        ...req.body,
        userId,
        apiKey
      });

      const project = await storage.createProject(input);
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.projects.get.path, isAuthenticated, async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    // Check ownership
    const userId = (req.user as any).claims.sub;
    if (project.userId !== userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json(project);
  });

  app.delete(api.projects.delete.path, isAuthenticated, async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const userId = (req.user as any).claims.sub;
    if (project.userId !== userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    await storage.deleteProject(project.id);
    res.status(204).send();
  });

  // Events Routes
  app.get(api.events.list.path, isAuthenticated, async (req, res) => {
    const projectId = Number(req.params.projectId);
    const project = await storage.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const userId = (req.user as any).claims.sub;
    if (project.userId !== userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const events = await storage.getProjectEvents(projectId);
    res.json(events);
  });

  app.get(api.events.get.path, isAuthenticated, async (req, res) => {
    const event = await storage.getEvent(Number(req.params.id));
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check ownership via project
    const project = await storage.getProject(event.projectId);
    const userId = (req.user as any).claims.sub;
    
    if (!project || project.userId !== userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json(event);
  });

  // Ingestion Route (Public, authenticated via API Key)
  app.post(api.events.ingest.path, async (req, res) => {
    try {
      console.log("Receiving error ingestion:", req.body);
      const input = api.events.ingest.input.parse(req.body);
      const project = await storage.getProjectByApiKey(input.apiKey);

      if (!project) {
        console.error("Invalid API Key:", input.apiKey);
        return res.status(404).json({ message: 'Invalid API Key' });
      }

      // Remove apiKey from input before creating event
      const { apiKey, ...eventData } = input;
      
      const event = await storage.createErrorEvent({
        ...eventData,
        projectId: project.id
      });

      res.status(201).json({ id: event.id });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed Data
  const existingProjects = await storage.getProjects("test-user"); // Check if we should seed for a test user or just general check
  // Better check count of all projects or just skip if any exist.
  // Since we have auth, seeding is tricky because we need a user.
  // We can skip seeding for now or seed a demo project if we can mock a user, but Replit Auth handles users.
  // I will skip auto-seeding for now as it requires a valid user ID from Replit Auth.

  return httpServer;
}
