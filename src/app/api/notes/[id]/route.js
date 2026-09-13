import { requireUser, admin } from "@/lib/server/admin";
import { json, failure } from "@/lib/server/http";
import { getNote } from "@/lib/firestore";
export async function GET(request, { params }) {
  try {
    const { uid } = await requireUser(request);
    return json({ note: await getNote(uid, (await params).id) });
  } catch (error) {
    return failure(error);
  }
}
export async function DELETE(request, { params }) {
  try {
    const { uid } = await requireUser(request);
    const { id } = await params;
    await getNote(uid, id);
    await admin().db.collection("notes").doc(id).delete();
    return json({ success: true });
  } catch (error) {
    return failure(error);
  }
}
