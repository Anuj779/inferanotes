# 🔥 InferaNotes

> AI-powered platform that converts YouTube videos into structured, exam-ready study notes.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange?logo=firebase)
![Gemini](https://img.shields.io/badge/Gemini-AI-blue?logo=google)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS%20v4-38bdf8?logo=tailwindcss)

---

## ✨ Features

- 🎯 **YouTube to Notes** — Paste any YouTube URL, get structured study notes
- 🌍 **Multi-Language** — English, Hindi, Hinglish, Marathi
- 📝 **Exam-Ready Format** — Headings, bullet points, key concepts, Q&A
- 📄 **PDF Download** — Export notes as clean PDFs
- 📋 **Copy to Clipboard** — One-click copy
- 🔐 **Google Auth** — Secure login via Firebase
- 📊 **Usage Tracking** — Free tier with 3 videos, upgradeable
- 🌙 **Dark/Light Mode** — Toggle with smooth transitions
- ⚡ **Blazing Fast** — Optimized API calls

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- Firebase account
- Google AI Studio account (for Gemini API)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/inferanotes.git
cd inferanotes
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (e.g., "InferaNotes")
3. **Enable Authentication:**
   - Go to Authentication → Sign-in method
   - Enable **Google** provider
   - Add your domain to Authorized domains
4. **Enable Firestore:**
   - Go to Firestore Database → Create Database
   - Start in **test mode** (configure security rules later)
5. **Get Config:**
   - Go to Project Settings → General
   - Under "Your apps", click the Web app icon (</>)
   - Register the app and copy the config values

### 3. Gemini API Setup

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create a new API key
4. Copy the key

### 4. Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Fill in your values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

GEMINI_API_KEY=AIzaSy...
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
inferanotes/
├── src/
│   ├── app/
│   │   ├── layout.js           # Root layout with providers
│   │   ├── page.js             # Landing page
│   │   ├── globals.css         # Design system & Tailwind
│   │   ├── login/page.js       # Google login page
│   │   ├── dashboard/page.js   # Main dashboard
│   │   ├── notes/[id]/page.js  # Notes viewer
│   │   ├── pricing/page.js     # Pricing page
│   │   └── api/
│   │       ├── validate/       # YouTube URL validation
│   │       ├── transcript/     # Transcript extraction
│   │       ├── generate/       # AI notes generation
│   │       ├── translate/      # Multi-language translation
│   │       └── usage/          # Usage tracking
│   ├── components/             # 12 UI components
│   ├── context/                # Auth & Theme providers
│   └── lib/                    # Firebase, Firestore, Gemini
├── .env.example
└── package.json
```

---

## 🚢 Deploy to Vercel

### Option 1: One-Click Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Import your repo
4. Add environment variables in Vercel dashboard:
   - All `NEXT_PUBLIC_FIREBASE_*` variables
   - `GEMINI_API_KEY`
5. Click "Deploy"

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

### Post-Deployment

- Add your Vercel domain to Firebase Auth → Authorized domains
- Update Firestore security rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /usage/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null;
    }
    match /notes/{noteId} {
      allow read: if request.auth != null && resource.data.uid == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

---

## 📋 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/validate` | POST | Validate YouTube URL, extract video ID |
| `/api/transcript` | POST | Fetch video transcript |
| `/api/generate` | POST | Generate AI notes from transcript |
| `/api/translate` | POST | Translate notes to target language |
| `/api/usage` | GET | Check usage count, fetch history |
| `/api/usage` | POST | Increment usage counter |

---

## 💰 Pricing Plans

| Feature | Free | Starter (₹49/mo) | Pro (₹99/mo) |
|---------|------|-------------------|---------------|
| Videos | 3 total | 30/month | Unlimited |
| Languages | English | All 4 | All 4 |
| PDF Download | ❌ | ✅ | ✅ |
| Q&A Generation | ❌ | ✅ | ✅ |
| Priority Processing | ❌ | ❌ | ✅ |

> **Note:** Payment integration is mock-only in the current MVP. No real transactions are processed.

---

## ⚠️ Policy & Disclaimer

InferaNotes processes only publicly available transcripts and does not store video content. We respect all copyright and content ownership policies. Only public YouTube videos with available captions/subtitles are supported.

---

## 📜 License

MIT License — Feel free to use and modify.

---

Built with ❤️ for students everywhere.
