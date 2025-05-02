import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateFormStructure } from "./openai";
import { ZodError } from "zod";
import { insertReviewSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Generate form structure based on product type
  app.post("/api/form-structure", async (req: Request, res: Response) => {
    try {
      const { productType } = req.body;
      
      if (!productType || typeof productType !== "string") {
        return res.status(400).json({ 
          message: "Product type is required and must be a string" 
        });
      }
      
      const formStructure = await generateFormStructure(productType);
      return res.status(200).json(formStructure);
    } catch (error) {
      console.error("Error generating form structure:", error);
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid form structure returned from OpenAI",
          details: error.errors
        });
      }
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ message: errorMessage });
    }
  });
  
  // Submit a completed review
  app.post("/api/reviews", async (req: Request, res: Response) => {
    try {
      const reviewData = req.body;
      
      // Validate review data against schema
      const validatedData = insertReviewSchema.parse({
        productType: reviewData.productType,
        reviewData: reviewData.reviewData,
        createdAt: new Date().toISOString()
      });
      
      // Store the review
      const savedReview = await storage.createReview(validatedData);
      return res.status(201).json(savedReview);
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid review data",
          details: error.errors
        });
      }
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ message: errorMessage });
    }
  });
  
  // Get reviews by product type (for potential future use)
  app.get("/api/reviews/:productType", async (req: Request, res: Response) => {
    try {
      const { productType } = req.params;
      const reviews = await storage.getReviewsByProductType(productType);
      return res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ message: errorMessage });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
