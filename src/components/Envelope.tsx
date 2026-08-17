'use client';

import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { Lock } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

interface EnvelopeProps {
  onUnlock: () => void;
}

export default function Envelope({ onUnlock }: EnvelopeProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  
  const { play } = useAudio();

  const envelopeControls = useAnimation();
  const flapControls = useAnimation();
  const sealControls = useAnimation();
  const letterControls = useAnimation();
  const containerControls = useAnimation();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOpening) return;
    
    if (password.toLowerCase().trim() === 'rawda') {
      setIsOpening(true);
      setError(false);
      
      // Instantly start playing music since this is a direct user interaction
      play();
      
      // The Animation Sequence
      // 1. Break the seal
      await sealControls.start({
        scale: [1, 1.3, 0],
        opacity: [1, 1, 0],
        rotate: [0, -15, 15, -45],
        transition: { duration: 0.6, ease: "anticipate" }
      });
      
      // 2. Open the flap (rotateX -180 deg)
      await flapControls.start({
        rotateX: -180,
        transition: { duration: 0.8, ease: "easeInOut" }
      });
      
      // 3. Slide letter up
      await letterControls.start({
        y: -140,
        transition: { duration: 1, ease: "easeOut" }
      });
      
      // 4. Fade everything out
      await containerControls.start({
        scale: 1.1,
        opacity: 0,
        transition: { duration: 0.8, ease: "easeIn", delay: 0.5 }
      });
      
      onUnlock();
    } else {
      // Wrong password shake
      setError(true);
      envelopeControls.start({
        x: [-10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      });
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#fdfaf5] flex flex-col items-center justify-center p-4 overflow-hidden relative"
      animate={containerControls}
    >
      <motion.div className="flex flex-col items-center z-10" animate={envelopeControls}>
        
        {/* Envelope Container */}
        <div className="relative w-[320px] sm:w-[380px] h-[220px] sm:h-[260px] perspective-[1200px] mb-12">
          
          {/* Back of the envelope (base) */}
          <div className="absolute inset-0 bg-[#c3a88c] rounded-md shadow-inner" />
          
          {/* Letter (hidden inside initially) */}
          <motion.div 
            initial={{ y: 0 }}
            animate={letterControls}
            className="absolute inset-x-2 top-2 bottom-2 bg-[#FFFDF9] rounded shadow-sm flex flex-col items-center justify-center border border-stone-200 z-10"
          >
            <h2 className="font-serif italic text-2xl text-[#3E3232]">Our Memories Await...</h2>
            <div className="w-12 h-[1px] bg-[#D4A0A0] mt-4" />
          </motion.div>

          {/* Left Flap */}
          <div 
            className="absolute inset-0 bg-[#d4bba0] z-20 drop-shadow-[2px_0_4px_rgba(0,0,0,0.1)]"
            style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)' }}
          />

          {/* Right Flap */}
          <div 
            className="absolute inset-0 bg-[#cfb59a] z-20 drop-shadow-[-2px_0_4px_rgba(0,0,0,0.1)]"
            style={{ clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)' }}
          />

          {/* Bottom Flap */}
          <div 
            className="absolute inset-0 bg-[#dcc4a9] z-20 drop-shadow-[0_-2px_4px_rgba(0,0,0,0.1)]"
            style={{ clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)' }}
          />

          {/* Top Flap (The one that opens) */}
          <motion.div 
            initial={{ rotateX: 0 }}
            animate={flapControls}
            style={{ 
              transformOrigin: 'top',
              transformStyle: 'preserve-3d',
              clipPath: 'polygon(0 0, 100% 0, 50% 50%)'
            }}
            className="absolute inset-0 bg-[#d0b69b] z-30 drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)] flex flex-col items-center pt-8"
          >
            {/* The white label on the top flap */}
            <div className="bg-[#FFFDF9] px-6 py-2 rounded-sm shadow-sm flex flex-col items-center transform -rotate-2 border border-stone-100">
              <span className="text-[8px] uppercase tracking-[0.3em] text-stone-500 mb-1 font-sans">
                LOVE
              </span>
              <span style={{ fontFamily: 'var(--font-great-vibes), cursive' }} className="text-xl text-[#B54A3B]">
                my everything ❤️
              </span>
            </div>
            
            {/* Vintage Stamp Top Right */}
            <div className="absolute top-3 right-4 w-10 h-12 bg-[#F5E6D3] border-[1px] border-dashed border-stone-400 opacity-80 flex items-center justify-center p-1 transform rotate-3">
              <div className="w-full h-full border border-stone-300 rounded-sm flex items-center justify-center bg-white/50">
                <span className="text-[8px] text-stone-500 font-serif">POST</span>
              </div>
            </div>
          </motion.div>

          {/* Wax Seal */}
          <motion.div 
            initial={{ scale: 1, opacity: 1 }}
            animate={sealControls}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-16 h-16 sm:w-20 sm:h-20 bg-[#9c2626] rounded-full flex items-center justify-center shadow-[0_8px_15px_rgba(156,38,38,0.5),inset_0_4px_8px_rgba(255,255,255,0.2),inset_0_-4px_8px_rgba(0,0,0,0.4)] border border-[#7a1d1d]"
          >
            {/* Inner ring of the wax seal */}
            <div className="w-[85%] h-[85%] rounded-full border-2 border-[#b53434] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] overflow-hidden relative">
              {/* Photo inside wax seal (using a placeholder) */}
              <Image 
                src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=200&auto=format&fit=crop" 
                alt="Us" 
                fill 
                className="object-cover opacity-80 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-[#9c2626]/40 mix-blend-multiply" />
            </div>
          </motion.div>
        </div>

        {/* Lock & Prompt */}
        <form onSubmit={handleUnlock} className="flex flex-col items-center w-full max-w-[280px]">
          <div className="flex flex-col items-center mb-6 opacity-60">
            <Lock className="w-5 h-5 text-stone-500 mb-2 stroke-[1.5]" />
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-stone-500 font-sans">
              Enter the secret word
            </p>
          </div>

          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="✦ password ✦"
            suppressHydrationWarning={true}
            autoComplete="off"
            disabled={isOpening}
            className="w-full px-6 py-3.5 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-center text-[#3E3232] placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-[#d4bba0] font-serif transition-shadow mb-4"
          />

          <button
            type="submit"
            disabled={isOpening}
            className="w-full py-3.5 bg-[#B54A3B] hover:bg-[#9c3d30] text-white rounded-full shadow-md hover:shadow-lg transition-all font-serif italic text-lg disabled:opacity-50 tracking-wide"
          >
            💕 Unlock 💕
          </button>
          
          {/* Error Message */}
          <div className="h-6 mt-2">
            {error && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm italic font-serif"
              >
                Incorrect password, please try again.
              </motion.p>
            )}
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
