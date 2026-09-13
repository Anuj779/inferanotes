import "server-only";
import { YoutubeTranscript } from "youtube-transcript";
import { AppError } from "../validation";

const SCRAPER_API_KEY = "5765e737cc4f5a94725f26cf4a0a70e3";

export async function source(videoId, supplied) {
  let title = "YouTube study notes";
  
  const getProxyUrl = (targetUrl) => {
    return `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(targetUrl)}`;
  };

  try {
    const res = await fetch(getProxyUrl(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`), { signal: AbortSignal.timeout(10000) });
    if (res.ok) title = (await res.json()).title || title;
  } catch {
    /* Metadata is optional. */
  }

  if (supplied) return { title, transcript: supplied };

  try {
    const signal = AbortSignal.timeout(60000);
    let milliseconds = false;
    
    // Use ScraperAPI proxy for every request made by youtube-transcript
    const items = await YoutubeTranscript.fetchTranscript(videoId, {
      fetch: async (url, options) => {
        const proxyUrl = getProxyUrl(url);
        const response = await fetch(proxyUrl, { ...options, signal });
        
        if (new URL(url).pathname.includes("timedtext")) {
          milliseconds = /<p\s+t="\d+"\s+d="\d+"/.test(await response.clone().text());
        }
        return response;
      },
    });
    
    if (!items || !items.length) throw new Error("empty");
    
    const transcript = items
      .map((item) => {
        const seconds = milliseconds ? item.offset / 1000 : item.offset;
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
    console.error("YoutubeTranscript via ScraperAPI failed:", error.message);
    
    if (error.code === "SOURCE_TOO_LONG" || error instanceof AppError) throw error;

    if (error.message && error.message.includes("No transcripts are available")) {
      throw new AppError(
        "This video does not have any captions or subtitles on YouTube.",
        422,
        "NO_CAPTIONS"
      );
    }
    
    if (error.message && error.message.includes("Video unavailable")) {
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
