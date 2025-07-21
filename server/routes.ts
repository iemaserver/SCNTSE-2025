import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { parse } from "csv-parse";
import type { Request, Response } from "express";
import { fileURLToPath } from "url";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  app.post("/api/admit", async (req: Request, res: Response) => {
    // Trim user input for robust comparison
    const email = (req.body.email || "").trim();
    const parentEmail = (req.body.parentEmail || "").trim();
    if (!email || !parentEmail) {
      return res.status(400).json({ message: "Missing credentials" });
    }    // Use import.meta.url to resolve the CSV path in ESM
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // In production, the server runs from dist/index.js, so CSV is in dist/admit_cards
    // In development, the server runs from server/index.ts, so CSV is in server/admit_cards
    const csvPath = process.env.NODE_ENV === 'production' 
      ? path.resolve(__dirname, "./admit_cards/uploaded_admit_cards.csv")
      : path.resolve(__dirname, "./admit_cards/uploaded_admit_cards.csv");
      
    if (!fs.existsSync(csvPath)) {
      return res.status(500).json({ message: "Admit card data unavailable" });
    }
    const parser = fs
      .createReadStream(csvPath)
      .pipe(parse({ columns: true, trim: true, delimiter: "," }));
    for await (const record of parser) {
      // Case-insensitive, trimmed string comparison for new headers
      const emailMatch =
        (record["Email"] || "").trim().toLowerCase() === email.toLowerCase();
      const pwMatch =
        (record["Parent Email"] || "").trim().toLowerCase() ===
        parentEmail.toLowerCase();
      if (emailMatch && pwMatch) {
        return res.json({ url: record.URL || record.url });
      }
    }
    // Always delay error to mitigate timing attacks
    await new Promise((r) => setTimeout(r, 500));
    return res.status(401).json({ message: "Invalid credentials" });
  });

  return httpServer;
}
