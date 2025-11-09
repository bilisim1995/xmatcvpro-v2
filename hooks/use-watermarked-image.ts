'use client';

import { useState, useEffect, useRef } from 'react';
import { getImageAsBase64 } from '@/lib/utils/proxy';

interface UseWatermarkedImageOptions {
  imageUrl: string;
  watermarkText?: string;
  watermarkSize?: 'large' | 'small';
}

export function useWatermarkedImage({ 
  imageUrl, 
  watermarkText = 'xmatch.pro',
  watermarkSize = 'large'
}: UseWatermarkedImageOptions) {
  const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setIsLoading(false);
      setWatermarkedUrl(null);
      return;
    }

    let cancelled = false;

    const createWatermark = async () => {
      try {
        // Try to get image as base64 first (handles CORS)
        let imageSrc = imageUrl;
        let useDirectUrl = false;
        
        // If image is from our CDN, use direct URL (no proxy needed)
        const isOurCDN = imageUrl.includes('cdn.xmatch.pro') || imageUrl.includes('xmatch.pro');
        
        // If image is from external domain (not our CDN), try to get it via proxy
        if (!imageUrl.startsWith('data:') && !imageUrl.startsWith('/') && !isOurCDN) {
          try {
            imageSrc = await getImageAsBase64(imageUrl);
          } catch (error) {
            console.warn('Failed to load image via proxy, using direct URL:', error);
            // Fallback to direct URL
            imageSrc = imageUrl;
            useDirectUrl = true;
          }
        } else if (isOurCDN) {
          // For our CDN, use direct URL
          imageSrc = imageUrl;
          useDirectUrl = true;
        }

        if (cancelled) return;

        const img = new Image();
        if (!useDirectUrl) {
          img.crossOrigin = 'anonymous';
        }

        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Image load timeout'));
          }, 15000); // 15 second timeout

          img.onload = () => {
            clearTimeout(timeout);
            if (cancelled) {
              reject(new Error('Cancelled'));
              return;
            }
            resolve();
          };
          img.onerror = (error) => {
            clearTimeout(timeout);
            console.error('Image load error:', error, imageSrc);
            reject(new Error('Failed to load image'));
          };
          img.src = imageSrc;
        });

        if (cancelled) return;

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Draw the original image
        ctx.drawImage(img, 0, 0);

        // Draw center watermark (diagonal)
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-30 * Math.PI / 180);
        
        const fontSize = watermarkSize === 'large' 
          ? Math.max(canvas.width, canvas.height) * 0.08 
          : Math.max(canvas.width, canvas.height) * 0.04;
        
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(watermarkText, 0, 0);
        ctx.restore();

        // Draw bottom-right watermark
        ctx.save();
        const smallFontSize = Math.max(canvas.width, canvas.height) * 0.012;
        ctx.font = `${smallFontSize}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        
        // Background for bottom watermark
        const textMetrics = ctx.measureText(watermarkText);
        const padding = 6;
        const bgX = canvas.width - padding;
        const bgY = canvas.height - padding;
        const bgWidth = textMetrics.width + padding * 2;
        const bgHeight = smallFontSize + padding * 2;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(bgX - bgWidth, bgY - bgHeight, bgWidth, bgHeight);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(watermarkText, canvas.width - padding, canvas.height - padding);
        ctx.restore();

        if (cancelled) return;

        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setWatermarkedUrl(dataUrl);
        canvasRef.current = canvas;
        setIsLoading(false);
      } catch (error) {
        console.error('Error creating watermarked image:', error);
        // Fallback to original image with CSS overlay approach
        if (!cancelled) {
          setWatermarkedUrl(imageUrl);
          setIsLoading(false);
        }
      }
    };

    createWatermark();

    return () => {
      cancelled = true;
    };
  }, [imageUrl, watermarkText, watermarkSize]);

  return { watermarkedUrl: watermarkedUrl || imageUrl, isLoading };
}

