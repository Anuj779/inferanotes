require("dotenv").config();
const express = require("express");
const cors = require("cors");
const youtubedl = require("youtube-dl-exec");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/transcribe", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing YouTube URL" });

  const id = crypto.randomBytes(8).toString("hex");
  const audioPath = path.join(__dirname, `${id}.m4a`);

  console.log(`[${id}] Starting processing for ${url}`);

  try {
    // 1. Download audio at lowest possible bitrate
    console.log(`[${id}] Downloading audio...`);
    await youtubedl(url, {
      extractAudio: true,
      audioFormat: "m4a",
      audioQuality: "9", 
      output: audioPath,
      noPlaylist: true,
    });

    console.log(`[${id}] Audio downloaded. File size: ${fs.statSync(audioPath).size / (1024 * 1024)} MB`);

    // 2. Read audio file to Base64
    const audioData = fs.readFileSync(audioPath).toString("base64");

    // 3. Transcribe using Gemini 1.5 Flash
    console.log(`[${id}] Sending to Gemini for transcription...`);
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "audio/mp4", data: audioData } },
            { text: "Generate a perfectly accurate, verbatim transcript of this entire audio file. Do not summarize. Only output the spoken text." }
          ]
        }
      ]
    });

    console.log(`[${id}] Transcription complete!`);
    
    // Clean up file
    fs.unlinkSync(audioPath);

    return res.json({ success: true, transcript: result.text });
  } catch (error) {
    console.error(`[${id}] Error:`, error);
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    return res.status(500).json({ success: false, error: error.message || error.toString() });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Transcription Engine running on port ${PORT}`);
});
