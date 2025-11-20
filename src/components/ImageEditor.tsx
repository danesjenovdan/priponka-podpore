import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Gender, StickerVariant } from '../types';

interface ImageEditorProps {
  imageSrc: string | null;
  gender: Gender;
  variant: StickerVariant;
  onImageProcessed: (base64: string) => void;
  onUploadClick?: () => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ imageSrc, gender, variant, onImageProcessed, onUploadClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Load image object
  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        setImgElement(img);
        setScale(1);
        setPosition({ x: 0, y: 0 });
      };
    }
  }, [imageSrc]);

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 1080; // High res for download
    canvas.width = size;
    canvas.height = size;

    // Clear
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Calculate positioning to cover
    const imgAspect = imgElement.width / imgElement.height;
    const canvasAspect = 1; // Square
    
    let drawWidth, drawHeight;

    if (imgAspect > canvasAspect) {
       drawHeight = size;
       drawWidth = size * imgAspect;
    } else {
       drawWidth = size;
       drawHeight = size / imgAspect;
    }

    // Apply user transforms
    const centerX = size / 2;
    const centerY = size / 2;

    ctx.save();
    ctx.translate(centerX + position.x, centerY + position.y);
    ctx.scale(scale, scale);
    // Draw centered
    ctx.drawImage(imgElement, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    // Draw Overlay
    // Gradient at the bottom - RED/ROSE THEME
    const gradientHeight = size * 0.45;
    const gradient = ctx.createLinearGradient(0, size - gradientHeight, 0, size);
    gradient.addColorStop(0, 'rgba(225, 29, 72, 0)'); // Rose-600 transparent
    gradient.addColorStop(0.4, 'rgba(225, 29, 72, 0.85)'); // Rose-600
    gradient.addColorStop(1, 'rgba(190, 18, 60, 1)'); // Rose-700

    ctx.fillStyle = gradient;
    ctx.fillRect(0, size - gradientHeight, size, gradientHeight);

    // Badge / Circle
    const badgeRadius = size * 0.12;
    const badgeX = size - badgeRadius - 40;
    const badgeY = size - badgeRadius - 40;

    // White circle border
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#e11d48'; // Rose 600
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Heart shape inside badge
    const heartScale = 4.5;
    ctx.save();
    ctx.translate(badgeX, badgeY - 10);
    ctx.scale(heartScale, heartScale);
    ctx.beginPath();
    // Simplified heart path
    ctx.moveTo(0, 0); 
    // We will just draw text "ZA" as per standard campaign material usually, 
    // but let's keep the circle consistent.
    ctx.restore();

    // Text "ZA" in badge
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 120px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("ZA", badgeX, badgeY + 15);

    // Text Overlay Content
    let line1 = "";
    let line2 = "";
    let line1Font = "800 90px Inter, sans-serif";
    let line2Font = "600 50px Inter, sans-serif";
    let line1Y = size - 180;
    let line2Y = size - 110;

    if (variant === StickerVariant.VOTE) {
        if (gender === Gender.FEMALE) line1 = "GLASOVALA SEM";
        else if (gender === Gender.MALE) line1 = "GLASOVAL SEM";
        else line1 = "GLASUJEM";
        
        line2 = "ZA SVOBODNO ODLOČANJE";
    } else if (variant === StickerVariant.DIGNIFIED) {
        line1 = "ŽELIM";
        line1Font = "800 100px Inter, sans-serif";
        line2 = "DOSTOJNO SMRT";
        line2Font = "700 75px Inter, sans-serif";
        line1Y = size - 200;
        line2Y = size - 100;
    } else if (variant === StickerVariant.RIGHTS) {
        line1 = "MOJE ŽIVLJENJE,";
        line1Font = "800 75px Inter, sans-serif";
        line2 = "MOJA PRAVICA";
        line2Font = "800 100px Inter, sans-serif";
        line1Y = size - 200;
        line2Y = size - 90;
    }

    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";

    // Draw Lines
    ctx.font = line1Font;
    ctx.fillText(line1.toUpperCase(), 50, line1Y);

    ctx.font = line2Font;
    ctx.fillText(line2.toUpperCase(), 50, line2Y);

    // Export Logic
    if (onImageProcessed) {
      // We don't auto-export constantly to avoid performance issues, handled by parent mostly
    }

  }, [imgElement, scale, position, gender, variant]);

  // Initial Draw
  useEffect(() => {
    requestAnimationFrame(draw);
  }, [draw]);

  // Export handling
  const handleExport = () => {
      if (canvasRef.current) {
          const data = canvasRef.current.toDataURL('image/png');
          onImageProcessed(data);
          return data;
      }
      return null;
  };
  
  useEffect(() => {
      const timeoutId = setTimeout(() => {
        handleExport();
      }, 500);
      return () => clearTimeout(timeoutId);
  }, [scale, position, gender, variant, imgElement]);


  // Mouse/Touch Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imgElement) return;
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setPosition(p => ({ x: p.x + dx * (1080 / 400), y: p.y + dy * (1080 / 400) })); 
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      
      {/* Canvas Container */}
      <div 
        className={`relative w-full max-w-[450px] aspect-square rounded-2xl overflow-hidden shadow-2xl border-8 border-white bg-gray-100 touch-none ring-1 ring-gray-200 ${imgElement ? 'cursor-move' : 'cursor-pointer hover:bg-gray-50 transition-colors'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => !imgElement && onUploadClick?.()}
      >
        {!imgElement && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none p-6 text-center">
            <div className="w-20 h-20 bg-rose-100 text-rose-400 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
            </div>
            <p className="text-lg font-semibold text-gray-600">Naloži sliko za začetek</p>
            <p className="text-sm text-gray-400 mt-2">Podpri kampanjo s svojo fotografijo</p>
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>

      {/* Controls */}
      {imgElement && (
        <div className="w-full max-w-[450px] bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Prilagodi Povečavo</label>
            <input 
              type="range" 
              min="0.5" 
              max="3" 
              step="0.1" 
              value={scale} 
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-rose-600 hover:accent-rose-700"
            />
        </div>
      )}
    </div>
  );
};