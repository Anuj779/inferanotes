import "server-only";
import { YoutubeTranscript } from "youtube-transcript";
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
    const signal = AbortSignal.timeout(60000);
    let milliseconds = false;
    const items = await YoutubeTranscript.fetchTranscript(videoId, {
      fetch: async (url, options) => {
        const response = await fetch(url, { ...options, signal });
        if (new URL(url).pathname.includes("timedtext"))
          milliseconds = /<p\s+t="\d+"\s+d="\d+"/.test(
            await response.clone().text(),
          );
        return response;
      },
    });
    if (!items.length) throw new Error("empty");
    const transcript = items
      .map((item) => {
        const seconds = milliseconds ? item.offset / 1000 : item.offset;
        return `[${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}] ${item.text}`;
      })
      .join("\n");
    if (transcript.length > 1000000)
      throw new AppError(
        "This lecture is too long. Paste a shorter transcript section below.",
        413,
        "SOURCE_TOO_LONG",
      );
    return { title, transcript };
  } catch (error) {
    console.error("YoutubeTranscript failed:", error);
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

    if (error.message && error.message.includes("No transcripts are available")) {
      throw new AppError(
        "This video does not have any captions or subtitles on YouTube. Please choose a video with captions or paste the transcript below.",
        422,
        "NO_CAPTIONS"
      );
    }
    
    throw new AppError(
      "YouTube blocked the server from reading this transcript. You will need to paste the transcript manually below.",
      422,
      "TRANSCRIPT_UNAVAILABLE",
    );
  }
}
