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
    const signal = AbortSignal.timeout(15000);
    let milliseconds = false;
    const items = await YoutubeTranscript.fetchTranscript(videoId, {
      fetch: async (url, options) => {
        const response = await fetch(url, { ...options, signal });
        // The package returns milliseconds for srv3 <p t="..."> captions,
        // but seconds for legacy <text start="..."> captions. Read the format.
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
    if (transcript.length > 90000)
      throw new AppError(
        "This lecture is too long. Paste a shorter transcript section below.",
        413,
        "SOURCE_TOO_LONG",
      );
    return { title, transcript };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Captions could not be retrieved. Open YouTube’s transcript and paste it below to continue.",
      422,
      "TRANSCRIPT_UNAVAILABLE",
    );
  }
}
