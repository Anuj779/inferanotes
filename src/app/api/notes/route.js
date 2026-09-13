import { requireUser } from "@/lib/server/admin";
import { json, failure } from "@/lib/server/http";
import { listNotes } from "@/lib/firestore";
export async function GET(request) {
  try {
    const { uid } = await requireUser(request);
    const notes = await listNotes(
      uid,
      new URL(request.url).searchParams.get("cursor"),
    );
    return json({
      notes,
      nextCursor: notes.length === 20 ? notes.at(-1).id : null,
    });
  } catch (error) {
    return failure(error);
  }
}
