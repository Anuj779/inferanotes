import { requireUser } from "@/lib/server/admin";
import { readJson, json, failure } from "@/lib/server/http";
import { GoogleGenAI } from "@google/genai";
import { getFirestore } from "firebase-admin/firestore";

export const maxDuration = 60;

export async function POST(request) {
  try {
    const { uid } = await requireUser(request);
    const { noteId, message, history = [] } = await readJson(request, (data) => data);
    
    // Fetch the note to get context
    const db = getFirestore();
    const doc = await db.collection("users").doc(uid).collection("notes").doc(noteId).get();
    
    if (!doc.exists) {
      return json({ error: "Note not found" }, { status: 404 });
    }
    
    const noteData = doc.data();
    const context = noteData.notes || "No notes available.";
    
    const systemInstruction = `You are a helpful AI tutor assisting a student with a YouTube video. 
Here are the study notes from the video:
---
${context}
---
Answer the student's questions based ONLY on these notes. Be concise, encouraging, and cite the video.`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
    
    const contents = history.map(h => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }]
    }));
    
    contents.push({ role: "user", parts: [{ text: message }] });

    const result = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.3,
      }
    });

    return json({ reply: result.text });
  } catch (error) {
    console.error("Chat error:", error);
    return failure(error);
  }
}
