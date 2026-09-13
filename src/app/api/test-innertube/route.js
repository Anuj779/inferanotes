export const maxDuration = 180;
export const dynamic = "force-dynamic";

export async function GET(request) {
  const url = new URL(request.url);
  const videoId = url.searchParams.get("v") || "UrsmFxEIp5k";
  
  try {
    const res = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', { 
      method: 'POST', 
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "com.google.android.youtube/20.10.38 (Linux; U; Android 14)"
      },
      body: JSON.stringify({ 
        context: { client: { clientName: 'ANDROID', clientVersion: '20.10.38' } }, 
        videoId 
      }) 
    });
    
    const text = await res.text();
    return new Response(text, { headers: { "Content-Type": "application/json" }});
  } catch (err) {
    return Response.json({ success: false, error: String(err) });
  }
}
