'use client';

import { useRouter } from 'next/navigation';
import Envelope from '@/components/Envelope';
import FloatingHearts from '@/components/FloatingHearts';
import WelcomeMessage from '@/components/WelcomeMessage';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Optional: if already unlocked in this session, auto-redirect
    if (sessionStorage.getItem('unlocked') === 'true') {
      router.push('/gallery');
    }
  }, [router]);

  const handleUnlock = () => {
    setShowWelcome(true);
  };

  const handleWelcomeComplete = () => {
    sessionStorage.setItem('unlocked', 'true');
    router.push('/gallery');
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAF6F1]">
      <FloatingHearts />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <AnimatePresence mode="wait">
          {!showWelcome ? (
            <Envelope key="envelope" onUnlock={handleUnlock} />
          ) : (
            <WelcomeMessage key="welcome" onComplete={handleWelcomeComplete} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
