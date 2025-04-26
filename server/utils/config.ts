/**
 * Server Configuration - Manages environment settings and defaults
 * Centralizes configuration values for the application
 */

/**
 * Application configuration with typesafe properties
 */
export const config = {
  // Server settings
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5000,
    host: process.env.HOST || "0.0.0.0",
    environment: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",
  },
  
  // API settings
  api: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    sessionSecret: process.env.SESSION_SECRET || "startup-generator-secret",
  },
  
  // Database settings (for future use)
  database: {
    url: process.env.DATABASE_URL,
  }
};