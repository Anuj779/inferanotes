import "server-only";
import { Timestamp } from "firebase-admin/firestore";
import { admin } from "./server/admin";
import { AppError, quotaDecision, usageLimit } from "./validation";
export async function reserve(uid, key) {
  const { db } = admin();
  const noteRef = db.collection("notes").doc(key);
  const usageRef = db.collection("usage").doc(uid);
  return db.runTransaction(async (tx) => {
    const [note, usage] = await Promise.all([
      tx.get(noteRef),
      tx.get(usageRef),
    ]);
    if (note.exists && note.data().uid === uid)
      return { cached: true, noteId: key };
    const next = quotaDecision(
      usage.data(),
      Date.now(),
      usageLimit(process.env.DAILY_GENERATION_LIMIT),
    );
    tx.set(usageRef, { ...next, activeKey: key, uid }, { merge: true });
    return { cached: false };
  });
}
export async function finish(uid, key, note) {
  const { db } = admin();
  const usageRef = db.collection("usage").doc(uid);
  await db.runTransaction(async (tx) => {
    const usage = await tx.get(usageRef);
    if (usage.data()?.activeKey !== key)
      throw new AppError("This request expired. Please retry.", 409);
    if (note)
      tx.set(db.collection("notes").doc(key), {
        ...note,
        uid,
        createdAt: Timestamp.now(),
        promptVersion: 1,
      });
    tx.set(usageRef, { leaseUntil: 0, activeKey: null }, { merge: true });
  });
}
export async function getNote(uid, id) {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(id))
    throw new AppError("Note not found.", 404);
  const snap = await admin().db.collection("notes").doc(id).get();
  if (!snap.exists || snap.data().uid !== uid)
    throw new AppError("Note not found.", 404);
  return {
    ...snap.data(),
    id,
    createdAt: normalizeDate(snap.data().createdAt),
  };
}
function normalizeDate(value) {
  return value?.toDate ? value.toDate().toISOString() : value || null;
}
export async function listNotes(uid, cursor) {
  const { db } = admin();
  let query = db
    .collection("notes")
    .where("uid", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(20);
  if (cursor) {
    await getNote(uid, cursor);
    query = query.startAfter(await db.collection("notes").doc(cursor).get());
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => {
    const { videoTitle, videoId, language, createdAt } = doc.data();
    return {
      id: doc.id,
      videoTitle,
      videoId,
      language,
      createdAt: normalizeDate(createdAt),
    };
  });
}
