'use client';

interface WatermarkedImageProps {
  src: string;
  alt: string;
  className?: string;
  watermarkSize?: 'large' | 'small';
}

export function WatermarkedImage({ 
  src, 
  alt, 
  className = '',
  watermarkSize = 'large'
}: WatermarkedImageProps) {
  const isAbsolute = className.includes('absolute');
  
  // If absolute positioning, don't wrap in div (parent handles positioning)
  if (isAbsolute) {
    return (
      <>
        <img 
          src={src} 
          alt={alt}
          className={className}
          onError={(e) => {
            console.error('Image failed to load:', src);
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* CSS Watermark Overlay */}
        <div className="absolute inset-0 pointer-events-none select-none z-10">
          <div className="w-full h-full flex items-center justify-center opacity-25">
            <div className={`${watermarkSize === 'large' ? 'text-3xl' : 'text-xl'} font-bold text-white transform rotate-[-30deg] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]`}>
              xmatch.pro
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 bg-black/50 px-1.5 py-0.5 text-[8px] text-white/70 z-10">
          xmatch.pro
        </div>
      </>
    );
  }
  
  return (
    <div className="relative w-full h-full">
      <img 
        src={src} 
        alt={alt}
        className={className}
        onError={(e) => {
          console.error('Image failed to load:', src);
          e.currentTarget.style.display = 'none';
        }}
      />
      {/* CSS Watermark Overlay */}
      <div className="absolute inset-0 pointer-events-none select-none z-10">
        <div className="w-full h-full flex items-center justify-center opacity-25">
          <div className={`${watermarkSize === 'large' ? 'text-3xl' : 'text-xl'} font-bold text-white transform rotate-[-30deg] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]`}>
            xmatch.pro
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 bg-black/50 px-1.5 py-0.5 text-[8px] text-white/70 z-10">
        xmatch.pro
      </div>
    </div>
  );
}

