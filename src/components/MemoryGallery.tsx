'use client';

import { AnimatePresence, motion } from 'framer-motion';
import MemoryCard, { Memory } from './MemoryCard';

interface MemoryGalleryProps {
  memories: Memory[];
}

export default function MemoryGallery({ memories }: MemoryGalleryProps) {
  // Sort memories by created_at descending (newest first)
  const sortedMemories = [...memories].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (sortedMemories.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1} 
          stroke="#D4A0A0" 
          className="w-24 h-24 mb-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        <h2 className="font-serif text-3xl text-[#3E3232] mb-3">No memories yet...</h2>
        <p className="font-serif italic text-[#3E3232]/70 text-lg">
          Tap the heart below to add your first memory together
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
        <AnimatePresence>
          {sortedMemories.map((memory, index) => (
            <MemoryCard key={memory.id} memory={memory} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
