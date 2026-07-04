import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini client
let aiInstance: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please set it in the Secrets panel in AI Studio.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is healthy." });
  });

  // Server-side AI Chat and Troubleshooter proxy
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Invalid messages structure in request body." });
        return;
      }

      const ai = getAiClient();
      
      // Map frontend message roles to @google/genai roles
      const contents = messages.map((msg) => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

      const systemInstruction = `You are the Custom ROM AI Assistant & Troubleshooter, an expert in Android system modification, custom ROM flashing, recovery tools (TWRP, OrangeFox), dynamic partitioning, bootloader unlocking, safety-net/Play Integrity bypass, root access (Magisk, KernelSU, APatch), and brick/bootloop recovery.

Guidelines:
1. Provide professional, accurate, and step-by-step guidance.
2. Highlight bricking risks clearly with bold warnings.
3. Recommend actual fastboot/adb shell commands where applicable.
4. If a user is facing a bootloop, provide a priority troubleshooting list:
   - Wipe cache/dalvik
   - Format data (to remove storage encryption clashes)
   - Ensure the ROM is meant for their exact device codename
   - Sideload firmware if dynamic partitions need upgrading.
5. Do not use markdown headers larger than level 3 (###) to keep rendering clean.
6. Adopt an encouraging, developer-oriented, and highly skilled expert persona. Keep responses concise and structured.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "I was unable to generate a response. Please check your flashing steps and try again.";
      res.json({ text: responseText });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ 
        error: error.message || "An unexpected error occurred while communicating with the AI Assistant." 
      });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
