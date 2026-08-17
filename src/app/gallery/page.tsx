'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import MemoryGallery from '@/components/MemoryGallery';
import AddMemoryButton from '@/components/AddMemoryButton';
import UploadModal from '@/components/UploadModal';
import { Memory } from '@/components/MemoryCard';
import FloatingHearts from '@/components/FloatingHearts';
import RelationshipTimer from '@/components/RelationshipTimer';
import EndingMessage from '@/components/EndingMessage';

export default function GalleryPage() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Basic auth check
    if (sessionStorage.getItem('unlocked') !== 'true') {
      router.push('/');
      return;
    }

    const fetchMemories = async () => {
      try {
        const { data, error } = await supabase
          .from('memories')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setMemories(data as Memory[]);
      } catch (err) {
        console.error('Error fetching memories:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemories();
  }, [router]);

  const handleMemoryAdded = (newMemory: Memory) => {
    setMemories(prev => [newMemory, ...prev]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F1]">
        <div className="animate-pulse flex flex-col items-center">
          <svg className="w-12 h-12 text-[#D4A0A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="mt-4 font-serif text-[#3E3232]">Opening your memory book...</p>
        </div>
      </div>
    );
  }

  const heroMemory = memories.find(m => m.id === '99720067-30a4-4329-bbe9-36a237841d1b');
  const remainingMemories = memories.filter(m => m.id !== '99720067-30a4-4329-bbe9-36a237841d1b');

  return (
    <main className="min-h-screen bg-[#FAF6F1] relative">
      <FloatingHearts />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FAF6F1]/80 backdrop-blur-md border-b border-[#D4A0A0]/20 py-4 text-center shadow-sm">
        <h1 className="font-serif text-2xl md:text-3xl text-[#3E3232]">Our Memory Book</h1>
      </header>

      {/* Storytelling Flow Content */}
      <div className="relative z-10 pb-24 flex flex-col gap-16 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Hero Memory */}
        {heroMemory && (
          <div className="relative w-full max-w-4xl mx-auto aspect-square sm:aspect-video rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 border-white">
            {heroMemory.media_type === 'video' ? (
              <video
                src={heroMemory.image_url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={heroMemory.image_url}
                alt={heroMemory.caption || 'Hero Memory'}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Glassmorphism Caption */}
            {heroMemory.caption && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 px-6 sm:px-10 py-4 sm:py-6 rounded-2xl shadow-xl text-center max-w-xl">
                  <p className="font-serif text-xl sm:text-2xl md:text-3xl text-white drop-shadow-md leading-relaxed font-medium">
                    {heroMemory.caption}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Relationship Timer */}
        <div className="flex flex-col items-center gap-6 mt-4">
          <h2 dir="rtl" className="font-serif text-3xl sm:text-4xl text-[#3E3232] text-center">
            بدايتنا 💕
          </h2>
          <RelationshipTimer />
        </div>

        {/* 3. Special Date Block */}
        <div className="flex flex-col items-center justify-center gap-6 py-8 border-y border-[#D4A0A0]/20 max-w-2xl mx-auto w-full">
          <h2 dir="rtl" className="font-serif text-2xl sm:text-3xl text-[#3E3232] text-center leading-relaxed">
            يوم ما اتاكدت اننا بنحب بعض ❤️
          </h2>
          <div className="bg-[#fdfaf5] border border-[#e6d5c3] shadow-sm px-6 py-2 rounded-full text-[#B54A3B] font-serif tracking-widest text-lg font-medium">
            📅 2024-01-03
          </div>
        </div>

        {/* 4. Scrapbook Gallery */}
        <div className="w-full">
          <MemoryGallery memories={remainingMemories} />
        </div>
        
        {/* Final Ending Message Section */}
        <EndingMessage />
        
      </div>

      {/* Floating Elements */}
      <AddMemoryButton onClick={() => setIsModalOpen(true)} />
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onMemoryAdded={handleMemoryAdded} 
      />
    </main>
  );
}
