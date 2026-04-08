'use client';

import Link from 'next/link';
import Logo from './Logo';
import { Globe, MessageCircle, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-20" style={{ borderTop: '1px solid var(--border-color)' }}>
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo size="default" />
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Transform YouTube videos into smart, structured notes powered by AI. Built for students.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider gradient-text">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['Home', 'Pricing', 'Dashboard'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-sm transition-colors hover:text-blue-400"
                    style={{ color: 'var(--muted)' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider gradient-text">
              Legal
            </h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Disclaimer'].map((item) => (
                <li key={item}>
                  <span
                    className="text-sm cursor-pointer transition-colors hover:text-blue-400"
                    style={{ color: 'var(--muted)' }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider gradient-text">
              Connect
            </h4>
            <div className="flex gap-3">
              {[
                { icon: Globe, href: '#' },
                { icon: MessageCircle, href: '#' },
                { icon: Mail, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="p-2 rounded-lg glass transition-all hover:scale-110 hover:border-blue-500"
                  style={{ border: '1px solid var(--border-color)' }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="mt-8 p-4 rounded-xl text-xs leading-relaxed"
          style={{
            background: 'var(--surface)',
            color: 'var(--muted)',
            border: '1px solid var(--border-color)',
          }}
        >
          <strong className="text-blue-400">Disclaimer:</strong> InferaNotes processes only publicly
          available transcripts and does not store video content. We respect all copyright and content
          ownership policies.
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            © {new Date().getFullYear()} InferaNotes. All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
            Made with <Heart size={12} className="text-red-400 fill-red-400" /> for students everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
