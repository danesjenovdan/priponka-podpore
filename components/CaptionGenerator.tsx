import React, { useState } from 'react';
import { generateSocialCaption } from '../services/geminiService';
import { Button } from './Button';
import { Gender, GeneratedCaption } from '../types';

interface CaptionGeneratorProps {
  currentImageBase64: string | null;
  gender: Gender;
}

export const CaptionGenerator: React.FC<CaptionGeneratorProps> = ({ currentImageBase64, gender }) => {
  const [caption, setCaption] = useState<GeneratedCaption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!currentImageBase64) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await generateSocialCaption(currentImageBase64, gender);
      setCaption(result);
    } catch (err) {
      setError("Prišlo je do napake pri generiranju. Preverite API ključ ali poskusite znova.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (caption) {
      const fullText = `${caption.text}\n\n${caption.hashtags.join(' ')}`;
      navigator.clipboard.writeText(fullText);
      alert("Kopirano v odložišče!");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-violet-100 overflow-hidden">
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
           </svg>
           AI Asistent za Objavo
        </h3>
        <p className="text-violet-100 text-sm opacity-90 mt-1">
          Naj umetna inteligenca (Gemini) napiše navdihujoč tekst za vašo sliko.
        </p>
      </div>

      <div className="p-6 space-y-4">
        {!currentImageBase64 && (
          <p className="text-gray-400 text-sm italic text-center">
            Najprej ustvari svojo sliko na levi strani.
          </p>
        )}

        {currentImageBase64 && !caption && (
           <div className="text-center">
             <Button 
               onClick={handleGenerate} 
               isLoading={loading}
               className="w-full"
               variant="secondary"
               icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
               }
             >
               Generiraj tekst objave
             </Button>
             {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
           </div>
        )}

        {caption && (
          <div className="animate-fade-in space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 text-sm leading-relaxed relative">
              <p className="mb-3 font-medium">{caption.text}</p>
              <p className="text-violet-600 font-semibold">{caption.hashtags.join(' ')}</p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" className="flex-1 text-sm">
                Kopiraj
              </Button>
              <Button onClick={handleGenerate} variant="primary" className="flex-1 text-sm" isLoading={loading}>
                Poskusi znova
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};