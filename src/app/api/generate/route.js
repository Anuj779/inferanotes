import { createHash } from "node:crypto";
import { requireUser } from "@/lib/server/admin";
import { readJson, json, failure } from "@/lib/server/http";
import { generationSchema, videoIdFromUrl } from "@/lib/validation";
import { source } from "@/lib/server/transcript";
import { generateNotes } from "@/lib/gemini";
import { reserve, finish } from "@/lib/firestore";
export const runtime = "nodejs";
export const maxDuration = 180;
export async function POST(request) {
  let uid,
    key,
    reserved = false;
  try {
    ({ uid } = await requireUser(request));
    const input = await readJson(request, generationSchema);
    const videoId = videoIdFromUrl(input.url);
    key = createHash("sha256")
      .update(
        JSON.stringify([
          uid,
          videoId,
          input.language,
          input.detail,
          input.transcript || "",
          1,
        ]),
      )
      .digest("hex");
    const reservation = await reserve(uid, key);
    if (reservation.cached) return json({ noteId: key, cached: true });
    reserved = true;
    const extracted = await source(videoId, input.transcript);
    const generated = await generateNotes(
      extracted.transcript,
      input.language,
      input.detail,
    );
    await finish(uid, key, {
      ...generated,
      videoId,
      videoTitle: extracted.title,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      language: input.language,
      detail: input.detail,
    });
    return json({ noteId: key, cached: false });
  } catch (error) {
    if (reserved) {
      try {
        await finish(uid, key);
      } catch {
        /* Lease expires after interrupted work. */
      }
    }
    return failure(error);
  }
}
