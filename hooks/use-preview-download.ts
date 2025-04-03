'use client';

import html2canvas from 'html2canvas';
import { convertImageToBase64 } from '@/lib/utils/image';

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
  scale = 2,
  backgroundColor = '#ffffff'
}: UsePreviewDownloadOptions) {
  const downloadPreview = async () => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Preview element not found');
      }

      // Convert all images to base64
      const images = element.getElementsByTagName('img');
      const imagePromises = Array.from(images).map(async (img) => {
        try {
          const base64 = await convertImageToBase64(img.src);
          img.src = base64;
        } catch (error) {
          console.warn('Failed to convert image:', img.src);
        }
      });
      
      await Promise.all(imagePromises);

      // Create canvas with high quality settings
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor,
        logging: false,
        removeContainer: true,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            clonedElement.style.width = `${element.offsetWidth}px`;
            clonedElement.style.height = `${element.offsetHeight}px`;
            clonedElement.style.margin = '0';
            clonedElement.style.padding = '20px';
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