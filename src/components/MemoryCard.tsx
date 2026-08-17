'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export type Memory = {
  id: string;
  image_url: string;
  caption: string;
  created_at: string;
};

interface MemoryCardProps {
  memory: Memory;
  index: number;
}

export default function MemoryCard({ memory, index }: MemoryCardProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(memory.created_at));

  // Deterministic slight rotation based on index for scrapbook feel
  const rotation = index % 2 === 0 ? (index % 3 === 0 ? 2 : -1.5) : (index % 3 === 0 ? -2 : 1.5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={{ 
        scale: 1.02, 
        rotate: 0, 
        y: -5,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
      }}
      className="bg-white p-3 sm:p-4 rounded-sm shadow-md break-inside-avoid mb-6 flex flex-col border border-stone-100 origin-center"
    >
      <div className="relative w-full overflow-hidden aspect-auto min-h-[200px] border border-stone-100 bg-stone-50 flex items-center justify-center">
        {memory.media_type === 'video' ? (
          <video
            src={memory.image_url}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto object-cover max-h-[70vh]"
          />
        ) : (
          <Image
            src={memory.image_url}
            alt={memory.caption || 'Memory'}
            width={600}
            height={600}
            className="w-full h-auto object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="pt-4 pb-2 px-2 flex flex-col gap-3 min-h-[60px] justify-center">
        {memory.caption && (
          <p className="font-serif italic text-[#3E3232] text-sm sm:text-base leading-relaxed text-center text-balance">
            "{memory.caption}"
          </p>
        )}
        <p className="text-[10px] sm:text-xs text-[#3E3232]/40 font-sans tracking-widest uppercase text-center mt-auto pt-2">
          {formattedDate}
        </p>
      </div>
    </motion.div>
  );
}
