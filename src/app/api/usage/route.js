import { admin, requireUser } from "@/lib/server/admin";
import { json, failure } from "@/lib/server/http";
import { usageLimit } from "@/lib/validation";
export async function GET(request) {
  try {
    const { uid } = await requireUser(request);
    const snapshot = await admin().db.collection("usage").doc(uid).get();
    const data = snapshot.data();
    const day = new Date().toISOString().slice(0, 10);
    return json({
      used: data?.day === day ? data.attempts || 0 : 0,
      limit: usageLimit(process.env.DAILY_GENERATION_LIMIT),
      resetsAt: new Date(`${day}T00:00:00Z`).getTime() + 86400000,
    });
  } catch (error) {
    return failure(error);
  }
}
