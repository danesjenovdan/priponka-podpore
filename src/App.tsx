import React, { useState, useRef } from 'react';
import { ImageEditor } from './components/ImageEditor';
import { Button } from './components/Button';
import { Gender, StickerVariant } from './types';

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [variant, setVariant] = useState<StickerVariant>(StickerVariant.VOTE);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          setProcessedImage(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'moje-zivljenje-moja-pravica.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff5f7] font-sans text-slate-800 selection:bg-rose-200 flex flex-col">
      
      {/* Header */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-rose-200">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
               </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">
                MOJE ŽIVLJENJE
              </h1>
              <p className="text-sm font-bold text-rose-600 tracking-wide uppercase">Moja pravica</p>
            </div>
          </div>
          
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Referendum o dostojni smrti</p>
            <p className="text-lg font-bold text-rose-600">23. november</p>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 py-10 sm:px-6 w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Pokaži svojo podporo!
          </h2>
          <p className="text-lg text-gray-600">
            Svoji profilni sliki za družbena omrežja dodaj slogan kampanje in pomagaj širiti glas za <span className="font-bold text-rose-600">svobodno odločanje o dostojni smrti</span>.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          
          {/* Editor Column */}
          <div className="w-full max-w-[500px] mx-auto flex flex-col gap-8">
            
            {/* Image Editor - Moved to Top */}
            <ImageEditor 
              imageSrc={imageSrc} 
              gender={gender}
              variant={variant}
              onImageProcessed={setProcessedImage}
              onUploadClick={triggerFileInput}
            />

            {/* Action Buttons - Moved below image */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              <Button 
                variant="secondary" 
                onClick={triggerFileInput}
                className="flex-1"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                }
              >
                {imageSrc ? 'Zamenjaj' : 'Naloži fotografijo'}
              </Button>
              
              <Button 
                variant="primary" 
                disabled={!imageSrc} 
                onClick={handleDownload}
                className="flex-1"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                }
              >
                Shrani
              </Button>
            </div>
            
            {/* Controls Container - Moved below buttons */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 space-y-6">
              
              {/* Variant Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Izberi napis za priponko</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: StickerVariant.VOTE, label: 'Glasoval_a sem ZA' },
                    { id: StickerVariant.DIGNIFIED, label: 'Želim dostojno smrt' },
                    { id: StickerVariant.RIGHTS, label: 'Moje življenje, moja pravica' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setVariant(opt.id)}
                      className={`px-4 py-3 rounded-xl text-left text-sm font-bold transition-all border-2 ${
                        variant === opt.id 
                          ? 'border-rose-500 bg-rose-50 text-rose-700' 
                          : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Selector - Only for VOTE variant */}
              {variant === StickerVariant.VOTE && (
                 <div className="animate-fade-in">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Spol (za slovnični spol)</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setGender(Gender.MALE)}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${gender === Gender.MALE ? 'bg-rose-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        Glasoval sem
                      </button>
                      <button 
                        onClick={() => setGender(Gender.FEMALE)}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${gender === Gender.FEMALE ? 'bg-rose-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        Glasovala sem
                      </button>
                      <button 
                        onClick={() => setGender(Gender.NEUTRAL)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${gender === Gender.NEUTRAL ? 'bg-rose-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        Glasujem
                      </button>
                    </div>
                 </div>
              )}
            </div>

          </div>

        </div>
      </main>

      <footer className="bg-[#ff8da1] py-10 mt-auto">
         <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center gap-6">
            
            {/* Date and Vote Badge */}
            <div className="bg-white/25 backdrop-blur-sm rounded-2xl p-3 pl-6 pr-3 inline-flex flex-col sm:flex-row items-center gap-4">
                <span className="text-white font-extrabold text-xl sm:text-2xl tracking-wide drop-shadow-sm">
                    V NEDELJO, 23. 11.
                </span>
                <div className="bg-[#ce2e3e] text-white px-6 py-2 rounded-xl font-black text-xl shadow-md transform -rotate-1 hover:rotate-0 transition-transform cursor-default">
                    GLASUJ ZA
                </div>
            </div>

            {/* Slogan */}
            {/* <p className="text-white font-bold text-lg sm:text-2xl tracking-wide uppercase drop-shadow-md">
                POMOČ PRI PROSTOVOLJNEM KONČANJU ŽIVLJENJA.
            </p> */}
         </div>
      </footer>

    </div>
  );
};

export default App;