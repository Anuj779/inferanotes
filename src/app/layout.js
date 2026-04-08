import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ShootingStars from '@/components/ShootingStars';

export const metadata = {
  title: 'InferaNotes — Turn YouTube Videos into Smart Notes',
  description:
    'AI-powered platform that converts YouTube videos into structured, exam-ready study notes. Supports English, Hindi, Hinglish & Marathi.',
  keywords: 'youtube notes, AI notes, study notes, transcript, student tools, exam preparation',
  openGraph: {
    title: 'InferaNotes — Smart Notes from YouTube',
    description: 'Turn any YouTube video into structured study notes in seconds.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <ShootingStars />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
