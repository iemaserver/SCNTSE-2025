import { users, type User, type InsertUser, type QuestionnaireResponse, type InsertQuestionnaireResponse } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createQuestionnaireResponse(response: InsertQuestionnaireResponse): Promise<QuestionnaireResponse>;
  getQuestionnaireStats(): Promise<{ total: number; science: number; english: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questionnaireResponses: Map<number, QuestionnaireResponse>;
  private currentUserId: number;
  private currentQuestionnaireId: number;

  constructor() {
    this.users = new Map();
    this.questionnaireResponses = new Map();
    this.currentUserId = 1;
    this.currentQuestionnaireId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createQuestionnaireResponse(insertResponse: InsertQuestionnaireResponse): Promise<QuestionnaireResponse> {
    const id = this.currentQuestionnaireId++;
    const response: QuestionnaireResponse = { ...insertResponse, id };
    this.questionnaireResponses.set(id, response);
    return response;
  }

  async getQuestionnaireStats(): Promise<{ total: number; science: number; english: number }> {
    const responses = Array.from(this.questionnaireResponses.values());
    const total = responses.length;
    const science = responses.filter(r => r.recommendation.toLowerCase().includes('science')).length;
    const english = responses.filter(r => r.recommendation.toLowerCase().includes('english')).length;
    
    return { total, science, english };
  }
}

export const storage = new MemStorage();
