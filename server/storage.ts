import { ideas, type Idea, type InsertIdea, users, type User, type InsertUser } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private ideas: Map<number, Idea>;
  private userCurrentId: number;
  private ideaCurrentId: number;

  constructor() {
    this.users = new Map();
    this.ideas = new Map();
    this.userCurrentId = 1;
    this.ideaCurrentId = 1;
  }

  // Idea storage methods
  async saveIdea(insertIdea: InsertIdea): Promise<Idea> {
    const id = this.ideaCurrentId++;
    const idea: Idea = { 
      ...insertIdea, 
      id,
      city: insertIdea.city ?? null,
      latitude: insertIdea.latitude ?? null,
      longitude: insertIdea.longitude ?? null 
    };
    this.ideas.set(id, idea);
    return idea;
  }

  async getAllIdeas(): Promise<Idea[]> {
    return Array.from(this.ideas.values()).sort((a, b) => b.id - a.id);
  }
  
  async getIdeaById(id: number): Promise<Idea | undefined> {
    return this.ideas.get(id);
  }

  async updateIdea(id: number, updateIdea: InsertIdea): Promise<Idea | undefined> {
    const existingIdea = await this.getIdeaById(id);
    
    if (!existingIdea) {
      return undefined;
    }
    
    const updatedIdea: Idea = { 
      ...updateIdea, 
      id,
      city: updateIdea.city ?? null,
      latitude: updateIdea.latitude ?? null,
      longitude: updateIdea.longitude ?? null
    };
    
    this.ideas.set(id, updatedIdea);
    return updatedIdea;
  }

  async deleteIdea(id: number): Promise<boolean> {
    const exists = this.ideas.has(id);
    
    if (exists) {
      this.ideas.delete(id);
      return true;
    }
    
    return false;
  }
  
  // User storage methods (kept for compatibility)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
