'use client';

import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Memory } from './MemoryCard';
import Image from 'next/image';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemoryAdded: (memory: Memory) => void;
}

export default function UploadModal({ isOpen, onClose, onMemoryAdded }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/'))) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    } else if (selectedFile) {
      setError('Please select an image or video file.');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.type.startsWith('image/') || droppedFile.type.startsWith('video/'))) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
      setError(null);
    } else if (droppedFile) {
      setError('Please drop an image or video file.');
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an image.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Upload image
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
      const filePath = `${filename}`;

      const { error: uploadError, data } = await supabase.storage
        .from('memory-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('memory-images')
        .getPublicUrl(filePath);

      // Insert into memories table
      const { data: memoryData, error: dbError } = await supabase
        .from('memories')
        .insert({
          image_url: publicUrl,
          caption: caption.trim() || null,
          media_type: file.type.startsWith('video/') ? 'video' : 'image',
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      onMemoryAdded(memoryData as Memory);
      
      // Reset form
      setFile(null);
      setPreviewUrl(null);
      setCaption('');
      onClose();

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload memory. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFFDF9] rounded-2xl shadow-2xl w-full max-w-[480px] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#D4A0A0]/20">
                <h2 className="font-serif text-2xl text-[#3E3232] flex items-center gap-2">
                  Add a Memory 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#D4A0A0]">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </h2>
                <button 
                  onClick={onClose}
                  className="text-[#3E3232]/50 hover:text-[#3E3232] transition-colors rounded-full p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-5">
                {/* Image Upload Area */}
                <div>
                  {!previewUrl ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-[#D4A0A0]/60 rounded-xl bg-[#FAF6F1]/50 p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAF6F1] transition-colors h-[240px]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-[#D4A0A0] mb-3">
                        <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      <p className="text-[#3E3232] font-medium font-serif text-center">Click or drag a photo or video</p>
                      <p className="text-[#3E3232]/50 text-sm mt-1">Supports JPG, PNG, WEBP, MP4</p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden bg-black/5 h-[240px] flex items-center justify-center">
                      {file?.type.startsWith('video/') ? (
                        <video 
                          src={previewUrl} 
                          className="object-contain w-full h-full"
                          autoPlay 
                          muted 
                          loop 
                        />
                      ) : (
                        <Image 
                          src={previewUrl} 
                          alt="Preview" 
                          fill 
                          className="object-contain"
                        />
                      )}
                      <button 
                        onClick={() => {
                          setFile(null);
                          setPreviewUrl(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors backdrop-blur-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*,video/mp4,video/webm,video/quicktime" 
                    className="hidden" 
                  />
                </div>

                {/* Caption Input */}
                <div>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value.slice(0, 500))}
                    placeholder="Write a caption for this memory..."
                    rows={3}
                    className="w-full bg-[#FAF6F1] border border-[#D4A0A0]/30 rounded-xl p-3 text-[#3E3232] font-serif placeholder:text-[#3E3232]/40 focus:outline-none focus:ring-2 focus:ring-[#D4A0A0]/50 resize-none"
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-[#3E3232]/50">{caption.length}/500</span>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-serif">{error}</p>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!file || isUploading}
                  className="w-full bg-gradient-to-r from-[#D4A0A0] to-[#C08080] text-white font-serif font-medium py-3 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <motion.svg 
                        animate={{ scale: [1, 1.2, 1] }} 
                        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-5 h-5 text-white mr-2"
                      >
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </motion.svg>
                      Uploading...
                    </>
                  ) : (
                    'Save Memory ♥'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
