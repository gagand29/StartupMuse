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

/**
 * Analyzes the user's topic to extract any location mentions
 * and generates an appropriate prompt for OpenAI
 */
function extractLocationFromTopic(topic: string): string {
  // Common cities, countries, and regions to check for
  const places = [
    // Major global cities
    'new york', 'paris', 'london', 'tokyo', 'shanghai', 'dubai', 'singapore',
    'los angeles', 'chicago', 'toronto', 'sydney', 'melbourne', 'berlin', 'madrid',
    'rome', 'mumbai', 'delhi', 'bangalore', 'bangkok', 'seoul', 'hong kong',
    
    // Countries
    'india', 'china', 'japan', 'france', 'germany', 'italy', 'spain',
    'canada', 'australia', 'brazil', 'mexico', 'russia', 'uk', 'usa',
    'united states', 'united kingdom', 
    
    // US states
    'california', 'texas', 'florida', 'new york state', 'illinois',
    'pennsylvania', 'ohio', 'georgia', 'michigan', 'north carolina',
    
    // Regions
    'europe', 'asia', 'africa', 'south america', 'north america',
    'middle east', 'southeast asia', 'latin america', 'scandinavia',
    'caribbean', 'mediterranean', 'eastern europe', 'western europe'
  ];
  
  // Convert the topic to lowercase for case-insensitive matching
  const lowerTopic = topic.toLowerCase();
  
  // Check if any location names are in the topic
  const foundPlace = places.find(place => lowerTopic.includes(place));
  
  if (foundPlace) {
    console.log(`Found location in topic: ${foundPlace}`);
    
    return `
      - The startup headquarters MUST be located in or near ${foundPlace.charAt(0).toUpperCase() + foundPlace.slice(1)}
      - Choose a specific city within this region that would be appropriate for this business
      - If the location is a city, use that exact city
      - If the location is a country or region, choose a notable but perhaps not obvious city within it
    `;
  }
  
  // Default prompt if no location is specified
  return `
      - Choose a real, but unique or unexpected city that would make an interesting headquarters
      - Avoid obvious tech hubs like San Francisco, New York, or London unless specifically relevant
      - Consider cities in different countries and continents for global diversity
      - If the topic suggests a specific industry, consider cities known for that particular industry
  `;
}

export async function generateStartupIdea(topic: string): Promise<InsertIdea> {
  try {
    // Extract any geographic locations from the topic
    const locationBasedPrompt = extractLocationFromTopic(topic);
    
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
      ${locationBasedPrompt}
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
