/* eslint-disable no-undef */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.VITE_OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY environment variable");
  process.exit(1);
}

const app = express();

// Allowed domains should come from environment variables
const allowedOrigins = process.env.VITE_ALLOWED_ORIGINS 
  ? process.env.VITE_ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173']; // Default to localhost only

// Configure CORS with proper error handling
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
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
