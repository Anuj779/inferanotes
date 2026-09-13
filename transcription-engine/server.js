require("dotenv").config();
const express = require("express");
const cors = require("cors");
const youtubedl = require("youtube-dl-exec");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/transcribe", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing YouTube URL" });

  const id = crypto.randomBytes(8).toString("hex");
  const audioPath = path.join(__dirname, `${id}.m4a`);

  console.log(`[${id}] Starting processing for ${url}`);

  try {
    // 1. Download audio at lowest possible bitrate to keep under 25MB Groq limit
    console.log(`[${id}] Downloading audio...`);
    await youtubedl(url, {
      extractAudio: true,
      audioFormat: "m4a",
      audioQuality: "9", // lowest quality to save space
      output: audioPath,
      noPlaylist: true,
    });

    console.log(`[${id}] Audio downloaded. File size: ${fs.statSync(audioPath).size / (1024 * 1024)} MB`);

    // 2. Transcribe using Groq Whisper API (whisper-large-v3)
    console.log(`[${id}] Sending to Groq Whisper...`);
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-large-v3",
      response_format: "text",
    });

    console.log(`[${id}] Transcription complete!`);
    
    // Clean up file
    fs.unlinkSync(audioPath);

    return res.json({ success: true, transcript: transcription });
  } catch (error) {
    console.error(`[${id}] Error:`, error);
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    return res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Transcription Engine running on port ${PORT}`);
});
