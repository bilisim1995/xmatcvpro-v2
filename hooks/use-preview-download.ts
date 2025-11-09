'use client';

import html2canvas from 'html2canvas';
import { getImageAsBase64 } from '@/lib/utils/proxy';

interface UsePreviewDownloadOptions {
  elementId: string;
  filename: string;
  quality?: number;
  scale?: number;
  backgroundColor?: string;
}

export function usePreviewDownload({ 
  elementId, 
  filename,
  quality = 1.0,
  scale = 3,
  backgroundColor = '#ffffff'
}: UsePreviewDownloadOptions) {
  const downloadPreview = async () => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Preview element not found');
      }

      // Wait a bit for images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Convert all images to base64 to avoid CORS issues
      const images = element.getElementsByTagName('img');
      const imagePromises = Array.from(images).map(async (img) => {
        try {
          // If image is already base64, skip
          if (img.src.startsWith('data:')) {
            return;
          }
          
          // Try to convert via proxy
          const base64 = await getImageAsBase64(img.src);
          img.src = base64;
          
          // Wait for image to load
          await new Promise((resolve) => {
            const tempImg = new Image();
            tempImg.onload = () => resolve(undefined);
            tempImg.onerror = () => resolve(undefined);
            tempImg.src = base64;
          });
        } catch (error) {
          console.warn('Failed to convert image:', img.src, error);
        }
      });
      
      await Promise.all(imagePromises);

      // Wait a bit more for rendering
      await new Promise(resolve => setTimeout(resolve, 300));

      // Create canvas with high quality settings
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor,
        logging: false,
        removeContainer: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc, element) => {
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            // Ensure all styles are preserved
            clonedElement.style.display = 'block';
            clonedElement.style.visibility = 'visible';
            clonedElement.style.opacity = '1';
            clonedElement.style.position = 'relative';
            clonedElement.style.overflow = 'visible';
            
            // Make sure all images are visible
            const clonedImages = clonedElement.getElementsByTagName('img');
            Array.from(clonedImages).forEach((img) => {
              img.style.display = 'block';
              img.style.visibility = 'visible';
              img.style.opacity = '1';
            });
          }
        }
      });

      // Convert to blob with specified quality
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create image blob'));
            }
          },
          'image/png',
          quality
        );
      });

      // Create and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  };

  return { downloadPreview };
}