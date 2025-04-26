import { ideas, type Idea, type InsertIdea, users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // Idea storage methods
  saveIdea(idea: InsertIdea): Promise<Idea>;
  getAllIdeas(): Promise<Idea[]>;
  
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
    const idea: Idea = { ...insertIdea, id };
    this.ideas.set(id, idea);
    return idea;
  }

  async getAllIdeas(): Promise<Idea[]> {
    return Array.from(this.ideas.values()).sort((a, b) => b.id - a.id);
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
