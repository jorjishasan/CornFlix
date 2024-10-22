/* eslint-disable no-undef */
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const NVIDIA_API_KEY = process.env.VITE_NVIDIA_API_KEY;

if (!NVIDIA_API_KEY) {
  console.error("NVIDIA API key is not set in the environment variables");
  process.exit(1);
}

app.post("/api/nim", async (req, res) => {
  try {
    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
