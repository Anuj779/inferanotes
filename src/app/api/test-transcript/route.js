import { YoutubeTranscript } from "youtube-transcript";

export const maxDuration = 180;
export const dynamic = "force-dynamic";

export async function GET(request) {
  const url = new URL(request.url);
  const videoId = url.searchParams.get("v") || "UrsmFxEIp5k";
  
  try {
    const signal = AbortSignal.timeout(60000);
    let milliseconds = false;
    const items = await YoutubeTranscript.fetchTranscript(videoId, {
      fetch: async (url, options) => {
        const response = await fetch(url, { ...options, signal });
        if (new URL(url).pathname.includes("timedtext")) {
          const text = await response.clone().text();
          milliseconds = /<p\s+t="\d+"\s+d="\d+"/.test(text);
        }
        return response;
      },
    });
    
    return Response.json({ success: true, count: items.length });
  } catch (err) {
    return Response.json({ success: false, error: String(err), stack: err.stack, name: err.name });
  }
}
