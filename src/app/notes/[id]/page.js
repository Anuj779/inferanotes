'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NotesDisplay from '@/components/NotesDisplay';
import SkeletonLoader from '@/components/SkeletonLoader';
import { ArrowLeft } from 'lucide-react';

export default function NotesPage({ params }) {
  const resolvedParams = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && resolvedParams.id) {
      fetchNote();
    }
  }, [user, authLoading, resolvedParams.id]);

  const fetchNote = async () => {
    try {
      const res = await fetch(`/api/usage?uid=${user.uid}&action=note&noteId=${resolvedParams.id}`);
      const data = await res.json();

      if (data.note) {
        setNote(data.note);
      } else {
        setError('Note not found');
      }
    } catch (err) {
      setError('Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <SkeletonLoader lines={8} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen page-enter">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 mb-6 text-sm transition-colors cursor-pointer"
          style={{ color: 'var(--muted)' }}
          id="back-to-dashboard"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </motion.button>

        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-12"
          >
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary cursor-pointer"
            >
              <span>Go to Dashboard</span>
            </button>
          </motion.div>
        ) : note ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <NotesDisplay
              notes={note.notes}
              videoTitle={note.videoTitle}
              videoUrl={note.videoUrl}
            />
          </motion.div>
        ) : null}
      </div>

      <Footer />
    </main>
  );
}
