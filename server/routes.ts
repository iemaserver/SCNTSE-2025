import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

// Token memory store for secure download links
const downloadTokens = new Map<string, { pdfPath: string; expires: number }>();

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const excelPath = path.resolve(__dirname, "../_SCNTSE 2026 (Responses).xlsx");
  const admitCardsDir = path.resolve(__dirname, "./admit_cards");
  const localAdmitDir = path.resolve(__dirname, "../admit");

  // Helper to find PDF file path
  const getPdfPath = (aadharClean: string) => {
    const filename = `${aadharClean}.pdf`;
    const p1 = path.join(admitCardsDir, filename);
    if (fs.existsSync(p1)) return p1;
    const p2 = path.join(localAdmitDir, filename);
    if (fs.existsSync(p2)) return p2;
    return null;
  };

  // Secure API endpoint: Validate strictly from _SCNTSE 2026 (Responses).xlsx Sheet1
  app.post("/api/admit", async (req: Request, res: Response) => {
    try {
      const emailInput = (req.body.email || "").toString().trim().toLowerCase();
      const aadharInput = (req.body.aadhar || req.body.aadharNumber || "").toString().trim();
      const aadharClean = aadharInput.replace(/[^\d]/g, "");

      if (!emailInput || !aadharClean) {
        return res.status(400).json({ success: false, message: "Please enter both registered Email Address and Aadhar Number." });
      }

      if (!fs.existsSync(excelPath)) {
        return res.status(500).json({ success: false, message: "Candidate data file unavailable." });
      }

      // Read Excel file directly in memory
      const workbook = XLSX.readFile(excelPath);
      const sheet = workbook.Sheets["Sheet1"];
      if (!sheet) {
        return res.status(500).json({ success: false, message: "Sheet1 data not found in Excel file." });
      }

      const rows: any[] = XLSX.utils.sheet_to_json(sheet);
      
      let matchedCandidate: any = null;

      for (const row of rows) {
        const e1 = (row["Email Address"] || "").toString().trim().toLowerCase();
        const e2 = (row["Email"] || "").toString().trim().toLowerCase();

        let rowAadharRaw = (row["Aadhar Number"] || "").toString().trim();
        if (rowAadharRaw.endsWith(".0")) {
          rowAadharRaw = rowAadharRaw.slice(0, -2);
        }
        const rowAadharClean = rowAadharRaw.replace(/[^\d]/g, "");

        const emailMatched = (e1 === emailInput || e2 === emailInput);
        const aadharMatched = (rowAadharClean === aadharClean || rowAadharRaw === aadharInput);

        if (emailMatched && aadharMatched) {
          matchedCandidate = {
            name: (row["Name"] || "").toString().trim(),
            hall_ticket: (row["Hall ticket number"] || "").toString().trim(),
            aadhar_clean: rowAadharClean
          };
          break;
        }
      }

      if (!matchedCandidate) {
        return res.status(401).json({
          success: false,
          message: "No candidate found matching the provided Email ID and Aadhar Number. Please check your credentials and try again."
        });
      }

      const pdfFilePath = getPdfPath(matchedCandidate.aadhar_clean);
      if (!pdfFilePath) {
        return res.status(404).json({ success: false, message: "Admit card PDF file not found on server." });
      }

      // Generate a secure one-time download token (expires in 15 minutes)
      const token = crypto.randomBytes(24).toString("hex");
      downloadTokens.set(token, {
        pdfPath: pdfFilePath,
        expires: Date.now() + 15 * 60 * 1000
      });

      return res.json({
        success: true,
        name: matchedCandidate.name,
        hall_ticket: matchedCandidate.hall_ticket,
        downloadToken: token
      });
    } catch (err: any) {
      console.error("Error in /api/admit:", err);
      return res.status(500).json({ success: false, message: err?.message || "Server error processing admit card request." });
    }
  });

  // Secure tokenized download route
  app.get("/api/download-admit", (req: Request, res: Response) => {
    const token = (req.query.token || "").toString();
    if (!token || !downloadTokens.has(token)) {
      return res.status(403).send("Unauthorized or expired download link.");
    }

    const tokenData = downloadTokens.get(token)!;
    if (Date.now() > tokenData.expires) {
      downloadTokens.delete(token);
      return res.status(403).send("Download link has expired. Please log in again.");
    }

    const pdfPath = tokenData.pdfPath;
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).send("Admit card PDF file missing.");
    }

    const filename = path.basename(pdfPath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return fs.createReadStream(pdfPath).pipe(res);
  });

  return httpServer;
}
