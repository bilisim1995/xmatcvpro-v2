'use client';

import html2canvas from 'html2canvas';

interface UsePreviewDownloadOptions {
  elementId: string;
  filename: string;
  quality?: number;
  scale?: number;
}

export function usePreviewDownload({ 
  elementId, 
  filename,
  quality = 1.0,
  scale = 2
}: UsePreviewDownloadOptions) {
  const downloadPreview = async () => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Preview element not found');
      }

      // Wait for all images to load
      const images = element.getElementsByTagName('img');
      await Promise.all(
        Array.from(images).map(img => 
          img.complete ? 
            Promise.resolve() : 
            new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              setTimeout(reject, 10000, new Error('Image load timeout'));
            })
        )
      );

      // Create canvas with high quality settings
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            clonedElement.style.width = `${element.offsetWidth}px`;
            clonedElement.style.height = `${element.offsetHeight}px`;
            clonedElement.style.transform = 'none';
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