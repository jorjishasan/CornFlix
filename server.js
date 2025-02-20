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

// Allowed domains configuration
const allowedDomains = {
  development: ['http://localhost:5173'],
  production: [
    'cornflix.app',
    'www.cornflix.app',
    'corn-flix-gamma.vercel.app',
    'www.corn-flix-gamma.vercel.app'
  ]
};

// Helper function to check if origin matches allowed domains
const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow requests with no origin
  
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? allowedDomains.production
    : allowedDomains.development;

  // Parse the origin URL
  try {
    const originUrl = new URL(origin);
    const hostname = originUrl.hostname;

    // Check if hostname matches any allowed domain
    return allowedOrigins.some(domain => 
      hostname === domain || // Exact match
      hostname.endsWith('.' + domain) // Subdomain match
    );
  } catch (error) {
    console.error('Invalid origin:', origin);
    return false;
  }
};

// Configure CORS with proper error handling
app.use(cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      // Return the actual origin instead of true
      callback(null, origin);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Add CORS headers middleware for preflight
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (isOriginAllowed(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
});

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
