import { 
  users, 
  type User, 
  type InsertUser, 
  reviews, 
  type Review, 
  type InsertReview,
  type FormStructure
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods (keeping from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Review methods
  createReview(review: InsertReview): Promise<Review>;
  getReviewById(id: number): Promise<Review | undefined>;
  getReviewsByProductType(productType: string): Promise<Review[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private reviews: Map<number, Review>;
  private userCurrentId: number;
  private reviewCurrentId: number;

  constructor() {
    this.users = new Map();
    this.reviews = new Map();
    this.userCurrentId = 1;
    this.reviewCurrentId = 1;
  }

  // User methods (keeping from original)
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
  
  // Review methods
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewCurrentId++;
    const review: Review = { 
      ...insertReview, 
      id,
      createdAt: insertReview.createdAt || new Date().toISOString()
    };
    this.reviews.set(id, review);
    return review;
  }
  
  async getReviewById(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }
  
  async getReviewsByProductType(productType: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.productType.toLowerCase() === productType.toLowerCase()
    );
  }
}

export const storage = new MemStorage();
