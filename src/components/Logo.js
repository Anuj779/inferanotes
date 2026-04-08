'use client';

import { motion } from 'framer-motion';

export default function Logo({ size = 'default' }) {
  const sizes = {
    small: { icon: 28, text: 'text-lg' },
    default: { icon: 36, text: 'text-xl' },
    large: { icon: 48, text: 'text-3xl' },
  };

  const s = sizes[size] || sizes.default;

  return (
    <motion.div
      className="flex items-center gap-2 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Flame SVG Icon */}
      <div className="relative flame-animate">
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="flameGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M24 4C24 4 12 16 12 26C12 32.627 17.373 38 24 38C30.627 38 36 32.627 36 26C36 16 24 4 24 4Z"
            fill="url(#flameGrad)"
            filter="url(#glow)"
          />
          <path
            d="M24 16C24 16 18 22 18 28C18 31.314 20.686 34 24 34C27.314 34 30 31.314 30 28C30 22 24 16 24 16Z"
            fill="white"
            fillOpacity="0.3"
          />
          <path
            d="M24 24C24 24 21 27 21 30C21 31.657 22.343 33 24 33C25.657 33 27 31.657 27 30C27 27 24 24 24 24Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
        {/* Glow effect behind flame */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-40"
          style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }}
        />
      </div>

      {/* Text */}
      <span className={`${s.text} font-bold gradient-text tracking-tight`}>
        Infera<span style={{ fontWeight: 800 }}>Notes</span>
      </span>
    </motion.div>
  );
}
