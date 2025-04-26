import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateStartupIdea } from "./openai";
import { insertIdeaSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Route to generate startup idea
  app.post("/api/generate", async (req, res) => {
    try {
      const { topic } = req.body;
      
      if (!topic || typeof topic !== "string") {
        return res.status(400).json({ message: "Topic is required" });
      }
      
      const startupIdea = await generateStartupIdea(topic);
      return res.status(200).json(startupIdea);
    } catch (error: any) {
      console.error("Error generating idea:", error);
      return res.status(500).json({ 
        message: "Failed to generate startup idea", 
        error: error?.message || "Unknown error" 
      });
    }
  });

  // Route to save an idea
  app.post("/api/save", async (req, res) => {
    try {
      const result = insertIdeaSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          message: "Invalid idea data", 
          error: validationError.message 
        });
      }
      
      const savedIdea = await storage.saveIdea(result.data);
      return res.status(200).json(savedIdea);
    } catch (error: any) {
      console.error("Error saving idea:", error);
      return res.status(500).json({ 
        message: "Failed to save idea", 
        error: error?.message || "Unknown error" 
      });
    }
  });

  // Route to get all saved ideas
  app.get("/api/ideas", async (req, res) => {
    try {
      const ideas = await storage.getAllIdeas();
      return res.status(200).json(ideas);
    } catch (error: any) {
      console.error("Error fetching ideas:", error);
      return res.status(500).json({ 
        message: "Failed to fetch ideas", 
        error: error?.message || "Unknown error" 
      });
    }
  });
  
  // Route to get a specific idea by ID
  app.get("/api/ideas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid idea ID" });
      }
      
      const idea = await storage.getIdeaById(id);
      
      if (!idea) {
        return res.status(404).json({ message: "Idea not found" });
      }
      
      return res.status(200).json(idea);
    } catch (error: any) {
      console.error("Error fetching idea:", error);
      return res.status(500).json({ 
        message: "Failed to fetch idea", 
        error: error?.message || "Unknown error" 
      });
    }
  });
  
  // Route to update an idea
  app.put("/api/ideas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid idea ID" });
      }
      
      const result = insertIdeaSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          message: "Invalid idea data", 
          error: validationError.message 
        });
      }
      
      const updatedIdea = await storage.updateIdea(id, result.data);
      
      if (!updatedIdea) {
        return res.status(404).json({ message: "Idea not found" });
      }
      
      return res.status(200).json(updatedIdea);
    } catch (error: any) {
      console.error("Error updating idea:", error);
      return res.status(500).json({ 
        message: "Failed to update idea", 
        error: error?.message || "Unknown error" 
      });
    }
  });
  
  // Route to delete an idea
  app.delete("/api/ideas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid idea ID" });
      }
      
      const success = await storage.deleteIdea(id);
      
      if (!success) {
        return res.status(404).json({ message: "Idea not found" });
      }
      
      return res.status(200).json({ message: "Idea deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting idea:", error);
      return res.status(500).json({ 
        message: "Failed to delete idea", 
        error: error?.message || "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
