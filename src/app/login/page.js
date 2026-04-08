'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Logo from '@/components/Logo';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full"
          style={{ border: '3px solid var(--border-color)', borderTopColor: '#3B82F6' }}
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-grid page-enter">
      {/* Background orbs */}
      <motion.div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3B82F6, transparent)', top: '10%', right: '20%' }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', bottom: '20%', left: '15%' }}
        animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card max-w-md w-full mx-4 text-center"
        style={{ padding: '48px 32px' }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size="large" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
          Sign in to start converting YouTube videos into smart notes
        </p>

        {/* Google Login Button */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold transition-all cursor-pointer"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-color)',
          }}
          id="google-login-btn"
        >
          {/* Google icon */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>Continue with Google</span>
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
          <span className="text-xs" style={{ color: 'var(--muted)' }}>or</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
        </div>

        {/* Features */}
        <div className="space-y-3" style={{ color: 'var(--muted)' }}>
          {[
            'Convert YouTube videos to study notes',
            'Get notes in 4 languages',
            'Download as PDF',
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Sparkles size={14} className="text-blue-400 shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Back link */}
        <p className="text-xs mt-8" style={{ color: 'var(--muted)' }}>
          <a href="/" className="hover:text-blue-400 transition-colors">
            ← Back to home
          </a>
        </p>
      </motion.div>
    </main>
  );
}
