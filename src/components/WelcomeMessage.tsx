'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface WelcomeMessageProps {
  onComplete: () => void;
}

export default function WelcomeMessage({ onComplete }: WelcomeMessageProps) {
  const [showButton, setShowButton] = useState(false);

  // The beautiful Arabic text
  const message = "عايزك تعرفي اني بحبك اوي و انك ديما بتوحشيني و كل حاجه معموله و متسجله هنا هي معموله بكل حب لانها اسعد لحظات حياتي";
  
  // Split into words rather than characters to preserve Arabic cursive connections perfectly
  const words = message.split(" ");

  // Animation variants
  const container: any = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.15, 
        delayChildren: 0.5 * i 
      },
    }),
  };

  const child: any = {
    hidden: {
      opacity: 0,
      y: 10,
      filter: "blur(4px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="absolute inset-0 bg-[#FAF6F1] z-50 flex flex-col items-center justify-center p-4 sm:p-8"
    >
      <div className="max-w-2xl w-full flex flex-col items-center gap-8">
        
        {/* Physical Letter Container */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full bg-[#fdfbf7] p-8 sm:p-12 md:p-16 rounded-sm shadow-2xl border border-[#e6d5c3] relative flex flex-col items-center"
        >
          {/* Subtle paper texture/gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none rounded-sm" />
          
          {/* Animated Arabic Text */}
          <motion.h2 
            dir="rtl"
            className="relative z-10 text-2xl sm:text-3xl md:text-4xl text-[#3E3232] leading-[1.8] sm:leading-[2] text-center font-serif text-balance"
            variants={container}
            initial="hidden"
            animate="visible"
            onAnimationComplete={() => {
              // Show button slightly after text finishes
              setTimeout(() => setShowButton(true), 800);
            }}
          >
            {words.map((word, index) => (
              <motion.span 
                variants={child} 
                key={index}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>
        </motion.div>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={showButton ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-auto"
        >
          <button
            onClick={onComplete}
            disabled={!showButton}
            style={{ fontFamily: 'var(--font-great-vibes), cursive' }}
            className={`
              px-8 py-3 rounded-full text-2xl text-[#3E3232] bg-[#fdfbf7] 
              border border-[#e6d5c3] shadow-md hover:shadow-lg 
              hover:bg-white hover:scale-105 hover:-rotate-1 
              transition-all duration-300
              ${!showButton && 'opacity-0 pointer-events-none'}
            `}
          >
            next →
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
