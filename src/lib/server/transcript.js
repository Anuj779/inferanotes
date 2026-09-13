import "server-only";
import { YouTubeTranscriptApi } from "youtube-transcript-nodejs";
import { AppError } from "../validation";

export async function source(videoId, supplied) {
  let title = "YouTube study notes";
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (res.ok) title = (await res.json()).title || title;
  } catch {
    /* Metadata is optional. */
  }

  if (supplied) return { title, transcript: supplied };

  try {
    const { AutoPoTokenProvider } = await import("youtube-transcript-nodejs");
    const api = new YouTubeTranscriptApi({ poTokenProvider: new AutoPoTokenProvider() });
    const items = await api.fetch(videoId);
    
    if (!items || !items.length) throw new Error("empty");
    
    const transcript = items
      .map((item) => {
        const seconds = item.start;
        return `[${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}] ${item.text}`;
      })
      .join("\n");
      
    if (transcript.length > 1000000) {
      throw new AppError(
        "This lecture is too long. Paste a shorter transcript section below.",
        413,
        "SOURCE_TOO_LONG",
      );
    }
    
    return { title, transcript };
  } catch (error) {
    console.error("YoutubeTranscript failed:", error.name, error.message);
    
    if (error.code === "SOURCE_TOO_LONG" || error instanceof AppError) throw error;
    
    // Fallback to Render Engine if YouTube blocks us or there are no captions
    console.log("Falling back to Render Transcription Engine for:", videoId);
    try {
      const renderRes = await fetch("https://inferanotes.onrender.com/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}` }),
        signal: AbortSignal.timeout(170000) // 170 seconds
      });
      
      const renderData = await renderRes.json();
      
      if (renderData.success && renderData.transcript) {
        return { title, transcript: renderData.transcript };
      }
      console.error("Render Engine failed:", renderData.error);
    } catch (renderError) {
      console.error("Render Engine fetch failed:", renderError);
    }

    if (error.name === "NoTranscriptFound" || error.name === "TranscriptsDisabled" || error.message?.includes("No transcripts")) {
      throw new AppError(
        "This video does not have any captions or subtitles on YouTube.",
        422,
        "NO_CAPTIONS"
      );
    }
    
    if (error.name === "VideoUnavailable") {
      throw new AppError(
        "This video is deleted, private, or unavailable. Please check the URL.",
        422,
        "VIDEO_UNAVAILABLE"
      );
    }
    
    throw new AppError(
      "YouTube has blocked our servers from reading the transcript for this video. Please try another video.",
      422,
      "TRANSCRIPT_UNAVAILABLE",
    );
  }
}
