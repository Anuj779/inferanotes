import { z } from "zod";
export class AppError extends Error {
  constructor(message, status = 400, code = "INVALID_REQUEST") {
    super(message);
    this.status = status;
    this.code = code;
  }
}
export function videoIdFromUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new AppError("Enter a full YouTube URL.");
  }
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new AppError("Invalid YouTube URL.");
  let id;
  if (url.hostname === "youtu.be") id = url.pathname.slice(1);
  else if (
    ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)
  )
    id =
      url.pathname === "/watch"
        ? url.searchParams.get("v")
        : /^\/(?:shorts|embed|live)\/([^/]+)\/?$/.exec(url.pathname)?.[1];
  if (!/^[\w-]{11}$/.test(id || ""))
    throw new AppError("Use a YouTube video link, not a channel or playlist.");
  return id;
}
export const generationSchema = z
  .object({
    url: z.string().trim().min(1).max(2048),
    language: z.enum(["en", "hi", "hinglish", "mr"]).default("en"),
    detail: z.enum(["concise", "detailed"]).default("detailed"),
    transcript: z.string().trim().min(100).max(90000).optional(),
  })
  .strict();
export const languages = {
  en: "English",
  hi: "Hindi",
  hinglish: "Hinglish",
  mr: "Marathi",
};
export function usageLimit(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 && n <= 100 ? n : 10;
}
export function quotaDecision(data, now, limit) {
  const day = new Date(now).toISOString().slice(0, 10);
  if (data?.leaseUntil > now)
    throw new AppError(
      "A note is already being generated. Please wait a moment.",
      409,
      "IN_PROGRESS",
    );
  const attempts = data?.day === day ? data.attempts || 0 : 0;
  if (attempts >= limit)
    throw new AppError(
      "Today’s free allowance is used. Come back tomorrow; your saved notes are always available.",
      429,
      "DAILY_LIMIT",
    );
  return { day, attempts: attempts + 1, leaseUntil: now + 240000 };
}
