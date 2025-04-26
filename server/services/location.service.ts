/**
 * Location Service - Handles location detection and processing
 * Helps identify geographical locations in user prompts
 */

/**
 * Service to detect and handle location information in user inputs
 */
export class LocationService {
  // List of common places to check for in user input
  private places: string[] = [
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
  
  /**
   * Analyzes user input to extract location mentions and generates an 
   * appropriate prompt for location-aware idea generation
   */
  extractLocationFromTopic(topic: string): string {
    // Convert the topic to lowercase for case-insensitive matching
    const lowerTopic = topic.toLowerCase();
    
    // Check if any location names are in the topic
    const foundPlace = this.places.find(place => lowerTopic.includes(place));
    
    if (foundPlace) {
      console.log(`Found location in topic: ${foundPlace}`);
      
      // Return location-specific prompt instructions
      return `
        - The startup headquarters MUST be located in or near ${this.capitalizeFirstLetter(foundPlace)}
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

  /**
   * Helper method to capitalize the first letter of a string
   */
  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Export singleton instance for use throughout the application
export const locationService = new LocationService();