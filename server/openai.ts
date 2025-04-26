import OpenAI from "openai";
import { InsertIdea } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface StartupIdeaResponse {
  name: string;
  description: string;
  features: string[];
  city: string;
  latitude: string;
  longitude: string;
}

export async function generateStartupIdea(topic: string): Promise<InsertIdea> {
  try {
    const prompt = `Generate a personalized startup app idea related to "${topic}".
      Please respond with a JSON object in the following format:
      {
        "name": "A catchy startup name",
        "description": "A brief description of what the app does (max 120 characters)",
        "features": ["Feature 1", "Feature 2", "Feature 3"],
        "city": "A unique or unexpected real city for this startup's headquarters",
        "latitude": "Latitude of the city (e.g., 40.7128)",
        "longitude": "Longitude of the city (e.g., -74.0060)"
      }
      
      Be creative but concise. The name should be memorable and relate to the topic.
      The description should explain the core value proposition in 1-2 sentences.
      The features should be the 3 most important capabilities of the application.
      
      For the headquarters location:
      - Choose a real, but unique or unexpected city that would make an interesting headquarters
      - Avoid obvious tech hubs like San Francisco, New York, or London unless specifically relevant
      - Consider cities in different countries and continents for global diversity
      - If the topic suggests a specific geographic region, consider cities there
      - For niche or specialized startups, consider cities known for that particular industry or with relevant resources
      - Provide accurate latitude and longitude coordinates for the selected city`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 600,
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }
    
    const startupIdea: StartupIdeaResponse = JSON.parse(content);
    
    // Validate response has all necessary fields
    if (!startupIdea.name || !startupIdea.description || !Array.isArray(startupIdea.features)) {
      throw new Error("Invalid response format from OpenAI");
    }

    // Ensure exactly 3 features
    const features = startupIdea.features.slice(0, 3);
    if (features.length < 3) {
      // Pad with empty features if we got fewer than 3
      while (features.length < 3) {
        features.push(`Additional feature for ${startupIdea.name}`);
      }
    }

    // Default to San Francisco if no location is provided
    const city = startupIdea.city || "San Francisco";
    const latitude = startupIdea.latitude || "37.7749";
    const longitude = startupIdea.longitude || "-122.4194";

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
