'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RelationshipTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // The exact starting date: July 6, 2024 (Local time)
    // Note: Month is 0-indexed in JS Date (6 = July)
    const startDate = new Date(2024, 6, 6, 0, 0, 0).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = now - startDate;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <div className="h-24"></div>; // Placeholder to avoid layout shift

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center mb-10 mt-6"
    >
      <div className="bg-[#FFFDF9]/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-[#D4A0A0]/20 max-w-lg w-full mx-4 relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-2 left-2 text-[#D4A0A0]/30 text-lg font-serif">✦</div>
        <div className="absolute bottom-2 right-2 text-[#D4A0A0]/30 text-lg font-serif">✦</div>
        
        <h2 className="text-center font-serif italic text-[#D4A0A0] text-lg mb-4">
          Together Since July 6, 2024
        </h2>
        
        <div className="flex justify-center items-center gap-2 sm:gap-6 text-[#3E3232]">
          <TimeBlock value={timeLeft.days} label="Days" />
          <span className="text-2xl sm:text-3xl font-serif text-[#D4A0A0] mb-5">:</span>
          <TimeBlock value={timeLeft.hours} label="Hours" />
          <span className="text-2xl sm:text-3xl font-serif text-[#D4A0A0] mb-5">:</span>
          <TimeBlock value={timeLeft.minutes} label="Mins" />
          <span className="text-2xl sm:text-3xl font-serif text-[#D4A0A0] mb-5">:</span>
          <TimeBlock value={timeLeft.seconds} label="Secs" />
        </div>
      </div>
    </motion.div>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[50px] sm:min-w-[64px]">
      <span className="text-2xl sm:text-4xl font-serif font-medium tracking-tight">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#3E3232]/60 mt-1 font-sans">
        {label}
      </span>
    </div>
  );
}
