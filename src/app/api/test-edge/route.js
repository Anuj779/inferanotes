export const runtime = "edge";
export const maxDuration = 60; // Edge limit usually shorter, max 60 on some tiers

import { YoutubeTranscript } from "youtube-transcript";

export async function GET(request) {
  const url = new URL(request.url);
  const videoId = url.searchParams.get("v");
  if (!videoId) return Response.json({ error: "Missing videoId" }, { status: 400 });

  try {
    const items = await YoutubeTranscript.fetchTranscript(videoId);
    return Response.json({ success: true, count: items.length });
  } catch (error) {
    return Response.json({ success: false, error: String(error) });
  }
}
