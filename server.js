/* eslint-disable no-undef */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY environment variable");
  process.exit(1);
}

const app = express();

// Simplified CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://corn-flix-gamma.vercel.app',
        'https://cornflix.app',
        'https://www.cornflix.app',
        'http://localhost:5173'  // Keep this if you want to test production API locally
      ]
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS']
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  app.use(express.static('dist')); // Assuming your build output is in 'dist'
  
  // Handle client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenAI API endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { movieTitle, genres } = req.body;

    if (!movieTitle || !genres) {
      return res.status(400).json({ 
        error: "Missing required parameters",
        details: { movieTitle, genres }
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Based on the movie "${movieTitle}" (genres: ${genres}), suggest 10 similar movies that fans would enjoy. Return ONLY a comma-separated list of movie titles.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI");
    }

    const recommendations = completion.choices[0].message.content
      .split(",")
      .map(title => title.trim())
      .filter(title => title.length > 0);

    if (recommendations.length === 0) {
      throw new Error("No recommendations received from OpenAI");
    }

    res.json({ recommendations });
  } catch (error) {
    console.error("Server error:", error);
    
    const statusCode = error.status || 500;
    const errorMessage = error.message || "Internal server error";
    
    res.status(statusCode).json({ 
      error: errorMessage,
      type: error.type || 'SERVER_ERROR'
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
