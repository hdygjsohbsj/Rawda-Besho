'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type HeartProps = {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
};

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<HeartProps[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // random x percentage
      size: Math.random() * (28 - 12) + 12, // size between 12px and 28px
      duration: Math.random() * (15 - 8) + 8, // duration between 8s and 15s
      delay: Math.random() * 5, // delay up to 5s
      color: Math.random() > 0.5 ? '#D4A0A0' : '#C9A96E', // rose or gold
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-0 opacity-40"
          style={{ left: `${heart.x}%` }}
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: ['0vh', '-100vh'],
            x: [0, 20, -20, 20, 0], // swaying motion
            opacity: [0, 0.4, 0.4, 0],
          }}
          transition={{
            y: {
              duration: heart.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: heart.delay,
            },
            x: {
              duration: heart.duration / 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: heart.delay,
            },
            opacity: {
              duration: heart.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: heart.delay,
            },
          }}
        >
          <svg
            width={heart.size}
            height={heart.size}
            viewBox="0 0 24 24"
            fill={heart.color}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
