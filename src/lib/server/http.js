import "server-only";
import { AppError } from "../validation";
export async function readJson(request, schema) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new AppError("Expected JSON.", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new AppError("Request body required.");
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 400000) {
      await reader.cancel();
      throw new AppError("Transcript is too large.", 413);
    }
    chunks.push(Buffer.from(value));
  }
  let body;
  try {
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new AppError("Invalid JSON.");
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    throw new AppError(
      "Check the video URL, language, and transcript length (100 to 90,000 characters).",
    );
  return parsed.data;
}
export function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}
export function failure(error) {
  const known = error instanceof AppError;
  if (!known)
    console.error("Request failed", { name: error.name, code: error.code });
  return json(
    {
      error: known ? error.message : "Something went wrong. Please try again.",
      code: known ? error.code : "INTERNAL_ERROR",
    },
    known ? error.status : 500,
  );
}
