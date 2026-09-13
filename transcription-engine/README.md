# InferaNotes Transcription Engine

This is a heavy backend engine designed to run on a Virtual Private Server (VPS) like Render.com. It bypasses YouTube's caption limits by downloading the raw audio and transcribing it perfectly using AI (Groq Whisper API).

## How to deploy on Render.com for Free

1. Push this folder to your GitHub repository.
2. Go to [Render.com](https://render.com) and create an account.
3. Click **New +** and select **Web Service**.
4. Connect your GitHub account and select your `inferanotes` repository.
5. In the settings:
   - **Root Directory**: `transcription-engine`
   - **Environment**: `Docker`
   - **Instance Type**: Free or Starter (Free tier will sleep after 15 mins of inactivity)
6. Scroll down to **Environment Variables** and add:
   - `GROQ_API_KEY` (Your Groq API Key)
7. Click **Create Web Service**.

Once deployed, Render will give you a URL like `https://inferanotes-engine.onrender.com`.

You can then update your Vercel website code to send requests to `https://inferanotes-engine.onrender.com/api/transcribe`!
