'use client';

import React, { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  hasStartedPlaying: boolean;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // We create the audio element dynamically so it exists once across the whole app lifecycle
    const audio = new Audio('/Wael Jassar - Koul Waad.mp3');
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const play = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setHasStartedPlaying(true);
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggle = () => {
    if (isPlaying) pause();
    else play();
  };

  return (
    <AudioContext.Provider value={{ isPlaying, hasStartedPlaying, play, pause, toggle }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
