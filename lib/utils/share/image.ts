'use client';

import html2canvas from 'html2canvas';

export async function captureElement(elementId: string): Promise<string | null> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return null;
  }

  try {
    // Wait for all images to load
    const images = element.getElementsByTagName('img');
    await Promise.all(
      Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error(`Failed to load image: ${img.src}`));
          // Set a timeout to avoid hanging
          setTimeout(() => reject(new Error('Image load timeout')), 10000);
        });
      })
    );

    // Fixed dimensions for consistent output
    const width = 1200;
    const height = Math.round(element.offsetHeight * (width / element.offsetWidth));

    const canvas = await html2canvas(element, {
      scale: 2,
      width,
      height,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (doc) => {
        const el = doc.getElementById(elementId);
        if (el) {
          el.style.width = `${width}px`;
          el.style.height = `${height}px`;
          el.style.transform = 'none';
          el.style.margin = '0';
        }
      }
    });

    return canvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Failed to capture element:', error);
    return null;
  }
}

export async function downloadImage(dataUrl: string, filename: string): Promise<void> {
  if (!dataUrl) {
    throw new Error('No data URL provided for download');
  }

  try {
    // Convert data URL to blob for better memory handling
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download image:', error);
    throw error;
  }
}