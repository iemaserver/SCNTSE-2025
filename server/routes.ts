import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuestionnaireResponseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Submit questionnaire response
  app.post("/api/questionnaire", async (req, res) => {
    try {
      const data = insertQuestionnaireResponseSchema.parse(req.body);
      const response = await storage.createQuestionnaireResponse(data);
      res.json(response);
    } catch (error) {
      res.status(400).json({ error: "Invalid questionnaire data" });
    }
  });

  // Get questionnaire statistics (optional)
  app.get("/api/questionnaire/stats", async (req, res) => {
    try {
      const stats = await storage.getQuestionnaireStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
