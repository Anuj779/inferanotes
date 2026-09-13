import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  videoIdFromUrl,
  generationSchema,
  quotaDecision,
  usageLimit,
} from "../src/lib/validation.js";
const require = createRequire(import.meta.url);
test("Firebase Admin auth loads in a CommonJS server runtime", () => {
  assert.doesNotThrow(() => require("firebase-admin/auth"));
});
test("accepts supported YouTube URLs and query parameter order", () => {
  for (const url of [
    "https://youtu.be/dQw4w9WgXcQ",
    "https://www.youtube.com/watch?list=abc&v=dQw4w9WgXcQ",
    "https://m.youtube.com/shorts/dQw4w9WgXcQ",
    "https://youtube.com/live/dQw4w9WgXcQ",
  ])
    assert.equal(videoIdFromUrl(url), "dQw4w9WgXcQ");
});
test("rejects spoofed hosts, credentials, scripts, playlists and malformed ids", () => {
  for (const url of [
    "https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ",
    "https://evil.com/youtube.com/watch?v=dQw4w9WgXcQ",
    "javascript:alert(1)",
    "https://me@youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtube.com/playlist?list=abc",
    "https://youtu.be/dQw4w9WgXcQextra",
  ])
    assert.throws(() => videoIdFromUrl(url));
});
test("rejects injected identity, unsupported languages and oversized sources", () => {
  const base = { url: "https://youtu.be/dQw4w9WgXcQ" };
  assert.equal(generationSchema.parse(base).language, "en");
  for (const extra of [
    { uid: "victim" },
    { language: "invalid" },
    { transcript: "x".repeat(90001) },
    { transcript: "short" },
  ])
    assert.equal(
      generationSchema.safeParse({ ...base, ...extra }).success,
      false,
    );
});
test("quota rejects concurrency and exhausted daily allowance; resets next day", () => {
  const now = Date.parse("2026-09-13T12:00:00Z");
  assert.throws(
    () => quotaDecision({ leaseUntil: now + 100 }, now, 10),
    (e) => e.status === 409,
  );
  assert.throws(
    () => quotaDecision({ day: "2026-09-13", attempts: 10 }, now, 10),
    (e) => e.status === 429,
  );
  assert.equal(
    quotaDecision({ day: "2026-09-12", attempts: 10 }, now, 10).attempts,
    1,
  );
  assert.equal(
    quotaDecision({ day: "2026-09-13", attempts: 9 }, now, 10).attempts,
    10,
  );
  assert.equal(usageLimit("-5"), 10);
  assert.equal(usageLimit("20"), 20);
});
