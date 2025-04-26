/**
 * API Routes - Defines and registers all API endpoints
 * Connects HTTP requests to their respective controllers
 */
import { Express } from "express";
import { ideaController } from "../controllers/idea.controller";

/**
 * Registers all API routes with the Express application
 */
export function registerApiRoutes(app: Express): void {
  // Idea routes
  app.post("/api/generate", ideaController.generateIdea.bind(ideaController));
  app.post("/api/ideas", ideaController.saveIdea.bind(ideaController));
  app.get("/api/ideas", ideaController.getAllIdeas.bind(ideaController));
  app.get("/api/ideas/:id", ideaController.getIdeaById.bind(ideaController));
  app.put("/api/ideas/:id", ideaController.updateIdea.bind(ideaController));
  app.delete("/api/ideas/:id", ideaController.deleteIdea.bind(ideaController));
}