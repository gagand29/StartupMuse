/**
 * OpenAI Service - Handles all interactions with the OpenAI API
 * Provides methods for generating startup ideas with location awareness
 */
import OpenAI from "openai";
import { InsertIdea } from "@shared/schema";
import { LocationService } from "./location.service";

// Initialize OpenAI client with API key from environment
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Define shape of the OpenAI response for startup ideas
interface StartupIdeaResponse {
  name: string;
  description: string;
  features: string[];
  city: string;
  latitude: string;
  longitude: string;
}

/**
 * OpenAIService - Service for generating startup ideas using the OpenAI API
 * with support for location-aware recommendations
 */
export class OpenAIService {
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  /**
   * Generates a startup idea based on the provided topic
   * Detects locations in the topic and prioritizes them in the response
   */
  async generateStartupIdea(topic: string): Promise<InsertIdea> {
    try {
      // Extract any geographic locations from the topic
      const locationBasedPrompt = this.locationService.extractLocationFromTopic(topic);
      
      const prompt = `Generate a personalized startup app idea related to "${topic}".
        Please respond with a JSON object in the following format:
        {
          "name": "A catchy startup name",
          "description": "A brief description of what the app does (max 120 characters)",
          "features": ["Feature 1", "Feature 2", "Feature 3"],
          "city": "A unique or unexpected real city for this startup's headquarters",
          "latitude": "Latitude of the city (e.g., 40.7128)",
          "longitude": "Longitude of the city (e.g., -74.0060)",
          "locationRationale": "A one-line reason why this location is perfect for the startup"
        }
        
        Be creative but concise. The name should be memorable and relate to the topic.
        The description should explain the core value proposition in 1-2 sentences.
        The features should be the 3 most important capabilities of the application.
        
        For the headquarters location:
        ${locationBasedPrompt}
        - Provide accurate latitude and longitude coordinates for the selected city`;

      // Make API call to OpenAI with properly formatted prompt
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // The newest OpenAI model is "gpt-4o" which was released May 13, 2024
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 600,
      });

      const content = response.choices[0].message.content;
      
      if (!content) {
        throw new Error("Empty response from OpenAI");
      }
      
      // Parse and validate the response
      const startupIdea: StartupIdeaResponse = JSON.parse(content);
      
      // Validate response has all necessary fields
      if (!startupIdea.name || !startupIdea.description || !Array.isArray(startupIdea.features)) {
        throw new Error("Invalid response format from OpenAI");
      }

      // Ensure exactly 3 features
      const features = this.normalizeFeatures(startupIdea.name, startupIdea.features);

      // Default to San Francisco if no location is provided
      const city = startupIdea.city || "San Francisco";
      const latitude = startupIdea.latitude || "37.7749";
      const longitude = startupIdea.longitude || "-122.4194";

      // Return properly formatted startup idea
      return {
        topic,
        name: startupIdea.name,
        description: startupIdea.description,
        features,
        city,
        latitude,
        longitude
      };
    } catch (error: any) {
      console.error("OpenAI API error:", error);
      throw new Error(`Failed to generate startup idea: ${error?.message || "Unknown error"}`);
    }
  }

  /**
   * Ensures we have exactly 3 features, truncating or padding as needed
   */
  private normalizeFeatures(name: string, features: string[]): string[] {
    const normalizedFeatures = features.slice(0, 3);
    
    // Pad with empty features if we got fewer than 3
    while (normalizedFeatures.length < 3) {
      normalizedFeatures.push(`Additional feature for ${name}`);
    }
    
    return normalizedFeatures;
  }
}

// Export singleton instance for use throughout the application
export const openAIService = new OpenAIService();