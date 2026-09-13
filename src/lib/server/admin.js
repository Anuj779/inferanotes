import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { AppError } from "../validation";
export function admin() {
  let app = getApps().find((a) => a.name === "inferanotes-server");
  if (!app) {
    const projectId =
      process.env.FIREBASE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!projectId || !clientEmail || !privateKey)
      throw new AppError(
        "The study service is being configured. Please try again later.",
        503,
        "SERVICE_NOT_CONFIGURED",
      );
    app = initializeApp(
      { credential: cert({ projectId, clientEmail, privateKey }) },
      "inferanotes-server",
    );
  }
  return { auth: getAuth(app), db: getFirestore(app) };
}
export async function requireUser(request) {
  const token = /^Bearer (\S+)$/.exec(
    request.headers.get("authorization") || "",
  )?.[1];
  if (!token)
    throw new AppError("Sign in to continue.", 401, "UNAUTHENTICATED");
  const { auth } = admin();
  try {
    return await auth.verifyIdToken(token, true);
  } catch {
    throw new AppError(
      "Your session expired. Please sign in again.",
      401,
      "UNAUTHENTICATED",
    );
  }
}
