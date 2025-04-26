/**
 * Storage Service - Manages data persistence for the application
 * Provides methods for storing and retrieving startup ideas
 */
import { Idea, InsertIdea, User, InsertUser } from "@shared/schema";

/**
 * Interface defining all storage operations for the application
 */
export interface IStorage {
  // Idea storage methods
  saveIdea(idea: InsertIdea): Promise<Idea>;
  getAllIdeas(): Promise<Idea[]>;
  getIdeaById(id: number): Promise<Idea | undefined>;
  updateIdea(id: number, idea: InsertIdea): Promise<Idea | undefined>;
  deleteIdea(id: number): Promise<boolean>;
  
  // User storage methods (kept for compatibility)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

/**
 * In-memory implementation of the storage interface
 * Used for development and testing purposes
 */
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private ideas: Map<number, Idea>;
  private userCurrentId: number;
  private ideaCurrentId: number;

  /**
   * Initialize storage with empty collections and starting IDs
   */
  constructor() {
    this.users = new Map<number, User>();
    this.ideas = new Map<number, Idea>();
    this.userCurrentId = 1;
    this.ideaCurrentId = 1;
  }

  /**
   * Save a new startup idea to storage
   */
  async saveIdea(insertIdea: InsertIdea): Promise<Idea> {
    const id = this.ideaCurrentId++;
    
    const idea: Idea = { 
      ...insertIdea,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.ideas.set(id, idea);
    return idea;
  }

  /**
   * Retrieve all startup ideas from storage
   */
  async getAllIdeas(): Promise<Idea[]> {
    return Array.from(this.ideas.values());
  }

  /**
   * Find a specific startup idea by its ID
   */
  async getIdeaById(id: number): Promise<Idea | undefined> {
    return this.ideas.get(id);
  }

  /**
   * Update an existing startup idea
   */
  async updateIdea(id: number, updateIdea: InsertIdea): Promise<Idea | undefined> {
    const existingIdea = this.ideas.get(id);
    
    if (!existingIdea) {
      return undefined;
    }
    
    const updatedIdea: Idea = { 
      ...updateIdea,
      id,
      createdAt: existingIdea.createdAt,
      updatedAt: new Date()
    };
    
    this.ideas.set(id, updatedIdea);
    return updatedIdea;
  }

  /**
   * Remove a startup idea from storage
   */
  async deleteIdea(id: number): Promise<boolean> {
    return this.ideas.delete(id);
  }

  /**
   * Find a user by their ID
   */
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  /**
   * Find a user by their username
   */
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  /**
   * Create a new user in storage
   */
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    
    const user: User = { ...insertUser, id };
    
    this.users.set(id, user);
    return user;
  }
}

// Export singleton instance for use throughout the application
export const storageService = new MemStorage();