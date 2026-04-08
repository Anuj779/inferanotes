'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UpgradeModal from '@/components/UpgradeModal';
import SkeletonLoader from '@/components/SkeletonLoader';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  Clock,
  FileText,
  Languages,
  ChevronRight,
  Zap,
} from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'hinglish', label: 'Hinglish', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', flag: '🇮🇳' },
];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('en');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [usage, setUsage] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const FREE_LIMIT = 3;

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch history & usage
  useEffect(() => {
    if (user) {
      fetchHistory();
      fetchUsage();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/usage?uid=${user.uid}&action=history`);
      const data = await res.json();
      setHistory(data.notes || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchUsage = async () => {
    try {
      const res = await fetch(`/api/usage?uid=${user.uid}&action=usage`);
      const data = await res.json();
      setUsage(data.usage);
    } catch (err) {
      console.error('Failed to fetch usage:', err);
    }
  };

  const handleGenerate = async () => {
    setError('');

    // Check usage limit
    if (usage && usage.videosProcessed >= FREE_LIMIT) {
      setShowUpgrade(true);
      return;
    }

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setGenerating(true);

    try {
      // Step 1: Validate URL
      setProgress('Validating YouTube URL...');
      const validateRes = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const validateData = await validateRes.json();

      if (!validateRes.ok) {
        throw new Error(validateData.error || 'Invalid YouTube URL');
      }

      // Step 2: Fetch transcript
      setProgress('Extracting transcript...');
      const transcriptRes = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: validateData.videoId }),
      });
      const transcriptData = await transcriptRes.json();

      if (!transcriptRes.ok) {
        throw new Error(transcriptData.error || 'Failed to fetch transcript');
      }

      // Step 3: Generate notes
      setProgress('AI is generating notes...');
      const generateRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcriptData.transcript,
          language,
          videoId: validateData.videoId,
          videoTitle: validateData.title || 'YouTube Video',
          videoUrl: url,
          uid: user.uid,
        }),
      });
      const generateData = await generateRes.json();

      if (!generateRes.ok) {
        throw new Error(generateData.error || 'Failed to generate notes');
      }

      // Step 4: Increment usage
      await fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid }),
      });

      // Navigate to notes page
      router.push(`/notes/${generateData.noteId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
      setProgress('');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full"
          style={{ border: '3px solid var(--border-color)', borderTopColor: '#3B82F6' }}
        />
      </div>
    );
  }

  if (!user) return null;

  const usageCount = usage?.videosProcessed || 0;
  const usagePercent = Math.min((usageCount / FREE_LIMIT) * 100, 100);

  return (
    <main className="min-h-screen page-enter">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{user.displayName?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Paste a YouTube video link to generate smart notes
          </p>
        </motion.div>

        {/* Usage Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-blue-400" />
              <span className="text-sm font-medium">Usage</span>
            </div>
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              {usageCount}/{FREE_LIMIT} videos
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: 'var(--surface)' }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full gradient-bg"
              style={{
                background:
                  usagePercent >= 100
                    ? 'linear-gradient(135deg, #EF4444, #F59E0B)'
                    : undefined,
              }}
            />
          </div>
          {usagePercent >= 100 && (
            <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
              <AlertCircle size={12} />
              Free limit reached.{' '}
              <button
                onClick={() => setShowUpgrade(true)}
                className="underline hover:text-yellow-300 cursor-pointer"
              >
                Upgrade
              </button>{' '}
              for more.
            </p>
          )}
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card card-3d mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-blue-400" />
            <h2 className="font-semibold">Generate Notes</h2>
          </div>

          {/* URL Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>
              YouTube Video URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(''); }}
              placeholder="https://youtube.com/watch?v=..."
              className="input-field"
              disabled={generating || usageCount >= FREE_LIMIT}
              id="youtube-url-input"
            />
          </div>

          {/* Language Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>
              <Languages size={14} className="inline mr-1" />
              Notes Language
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <motion.button
                  key={lang.code}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    language === lang.code ? 'glow-blue' : ''
                  }`}
                  style={{
                    background: language === lang.code ? 'rgba(59, 130, 246, 0.15)' : 'var(--surface)',
                    border: `1px solid ${
                      language === lang.code ? 'rgba(59, 130, 246, 0.4)' : 'var(--border-color)'
                    }`,
                    color: language === lang.code ? '#60A5FA' : 'var(--muted)',
                  }}
                  disabled={generating}
                >
                  {lang.flag} {lang.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#EF4444',
                }}
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress */}
          <AnimatePresence>
            {progress && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm"
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  color: '#60A5FA',
                }}
              >
                <Loader2 size={16} className="animate-spin" />
                {progress}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: generating ? 1 : 1.02 }}
            whileTap={{ scale: generating ? 1 : 0.98 }}
            onClick={handleGenerate}
            disabled={generating || usageCount >= FREE_LIMIT}
            className="btn-primary w-full py-4 text-lg justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            id="generate-notes-btn"
          >
            {generating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate Notes</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Recent History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-blue-400" />
            <h2 className="font-semibold">Recent Notes</h2>
          </div>

          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-16 rounded-xl" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                No notes yet. Generate your first notes above!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((note) => (
                <motion.div
                  key={note.id}
                  whileHover={{ scale: 1.01, borderColor: 'rgba(59, 130, 246, 0.3)' }}
                  onClick={() => router.push(`/notes/${note.id}`)}
                  className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(59, 130, 246, 0.1)' }}
                    >
                      <FileText size={18} className="text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {note.videoTitle || 'Untitled Video'}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>
                        {note.language?.toUpperCase() || 'EN'} •{' '}
                        {note.createdAt?.toDate
                          ? new Date(note.createdAt.toDate()).toLocaleDateString()
                          : 'Recent'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </main>
  );
}
