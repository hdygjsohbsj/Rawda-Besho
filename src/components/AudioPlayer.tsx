'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAudio } from '@/context/AudioContext';

export default function AudioPlayer() {
  const [isMinimized, setIsMinimized] = useState(false);
  const { isPlaying, toggle, hasStartedPlaying } = useAudio();

  // Do not render the widget at all until the music has started playing
  if (!hasStartedPlaying) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
      {/* Toggle Button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="bg-[#FFFDF9]/90 text-[#3E3232] p-2 rounded-full shadow-md backdrop-blur-md hover:bg-[#FAF6F1] transition-colors border border-[#D4A0A0]/20"
        aria-label={isMinimized ? "Show audio player" : "Minimize audio player"}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isMinimized ? (
            <>
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </>
          ) : (
            <path d="M18 15l-6-6-6 6" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-[#FFFDF9]/80 backdrop-blur-xl rounded-2xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#FFFDF9] flex items-center gap-4 max-w-[calc(100vw-32px)] sm:max-w-sm relative overflow-hidden"
          >
            {/* Subtle gradient background element */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4A0A0]/10 to-transparent pointer-events-none" />

            {/* Vinyl / Play Button */}
            <button
              onClick={toggle}
              className="relative w-14 h-14 flex-shrink-0 rounded-full flex items-center justify-center bg-zinc-900 border-2 border-zinc-700 shadow-inner group overflow-hidden"
            >
              {/* Vinyl Grooves */}
              <div className="absolute inset-1 rounded-full border border-zinc-700/50" />
              <div className="absolute inset-2 rounded-full border border-zinc-700/50" />
              <div className="absolute inset-3 rounded-full border border-zinc-700/50" />
              
              {/* Center Label */}
              <motion.div 
                className="w-5 h-5 rounded-full bg-[#D4A0A0] flex items-center justify-center z-10 shadow-sm"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </motion.div>

              {/* Spinning whole vinyl effect */}
              <motion.div
                className="absolute inset-0 z-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              {/* Hover overlay for Play/Pause icon */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <rect x="7" y="6" width="3" height="12" rx="1" />
                    <rect x="14" y="6" width="3" height="12" rx="1" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white" className="ml-1">
                    <path d="M6 4l14 8-14 8V4z" />
                  </svg>
                )}
              </div>
            </button>

            <div className="flex-1 min-w-0 pr-2">
              <h3 className="font-serif text-[#3E3232] font-semibold truncate text-sm sm:text-base">Kol Waad Waadteholak</h3>
              <p className="text-xs text-[#3E3232]/60 truncate font-serif italic mt-0.5">Wael Jassar</p>
            </div>

            {/* Pulsing Equalizer (optional, keeping it tiny) */}
            <div className="flex items-end gap-[2px] h-4 w-6 shrink-0 opacity-70">
              {[1, 2, 3].map((bar) => (
                <motion.div
                  key={bar}
                  className="w-1.5 bg-[#D4A0A0] rounded-t-[1px]"
                  animate={{
                    height: isPlaying ? ['30%', '100%', '40%', '80%', '30%'] : '20%',
                  }}
                  transition={{
                    duration: 0.7,
                    repeat: isPlaying ? Infinity : 0,
                    repeatType: "mirror",
                    delay: bar * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
