/**
 * Idea Controller - Handles HTTP requests related to startup ideas
 * Provides API endpoints for generating and managing startup ideas
 */
import { Request, Response } from "express";
import { openAIService } from "../services/openai.service";
import { storageService } from "../services/storage.service";
import { insertIdeaSchema } from "@shared/schema";

/**
 * Controller for handling all idea-related API endpoints
 */
export class IdeaController {
  /**
   * Generate a new startup idea based on the provided topic
   */
  async generateIdea(req: Request, res: Response) {
    try {
      const { topic } = req.body;
      
      if (!topic || typeof topic !== "string") {
        return res.status(400).json({ error: "Topic is required" });
      }
      
      const idea = await openAIService.generateStartupIdea(topic);
      
      return res.json(idea);
    } catch (error: any) {
      console.error("Error generating idea:", error);
      return res.status(500).json({ error: error.message || "Failed to generate idea" });
    }
  }

  /**
   * Save a startup idea to storage
   */
  async saveIdea(req: Request, res: Response) {
    try {
      const result = insertIdeaSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid idea data", details: result.error });
      }
      
      const savedIdea = await storageService.saveIdea(result.data);
      
      return res.status(201).json(savedIdea);
    } catch (error: any) {
      console.error("Error saving idea:", error);
      return res.status(500).json({ error: error.message || "Failed to save idea" });
    }
  }

  /**
   * Get all saved startup ideas
   */
  async getAllIdeas(_req: Request, res: Response) {
    try {
      const ideas = await storageService.getAllIdeas();
      return res.json(ideas);
    } catch (error: any) {
      console.error("Error getting ideas:", error);
      return res.status(500).json({ error: error.message || "Failed to get ideas" });
    }
  }

  /**
   * Get a specific startup idea by ID
   */
  async getIdeaById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const idea = await storageService.getIdeaById(id);
      
      if (!idea) {
        return res.status(404).json({ error: "Idea not found" });
      }
      
      return res.json(idea);
    } catch (error: any) {
      console.error("Error getting idea:", error);
      return res.status(500).json({ error: error.message || "Failed to get idea" });
    }
  }

  /**
   * Update an existing startup idea
   */
  async updateIdea(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const result = insertIdeaSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid idea data", details: result.error });
      }
      
      const updatedIdea = await storageService.updateIdea(id, result.data);
      
      if (!updatedIdea) {
        return res.status(404).json({ error: "Idea not found" });
      }
      
      return res.json(updatedIdea);
    } catch (error: any) {
      console.error("Error updating idea:", error);
      return res.status(500).json({ error: error.message || "Failed to update idea" });
    }
  }

  /**
   * Delete a startup idea
   */
  async deleteIdea(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const success = await storageService.deleteIdea(id);
      
      if (!success) {
        return res.status(404).json({ error: "Idea not found" });
      }
      
      return res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting idea:", error);
      return res.status(500).json({ error: error.message || "Failed to delete idea" });
    }
  }
}

// Export singleton instance for use in routes
export const ideaController = new IdeaController();