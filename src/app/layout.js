import "./globals.css";
import "@fontsource-variable/outfit";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
export const metadata = {
  title: {
    default: "InferaNotes | Less replay. More recall.",
    template: "%s | InferaNotes",
  },
  description:
    "Turn YouTube lectures into clear study notes. English, Hindi, Hinglish and Marathi. Free for now, with no subscription.",
};
const themeScript = `(function(){try{document.documentElement.dataset.theme=localStorage.getItem('inferanotes-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){}})()`;
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
